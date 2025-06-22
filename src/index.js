import { formComponents } from './components/index.js';
import sidebarItems from './data/sidebar-config.json';
import './style.css';
import formData from './data/form-data.json';

const appContainer = document.createElement('div');
appContainer.className = 'app-container';

const sidebar = document.createElement('div');
sidebar.className = 'sidebar';

const main = document.createElement('div');
main.className = 'main-content';
main.id = 'form-canvas';

const jsonBar = document.createElement('div');
jsonBar.className = 'json-bar';

//container for sidebar toggle buttons
const sidebarToggleContainer = document.createElement('div');
sidebarToggleContainer.className = 'sidebar-toggle-container';

//toggle buttons
const sidebarToggleButton1 = document.createElement('button');
sidebarToggleButton1.textContent = 'get sidebar1';
sidebarToggleButton1.className = 'sidebar-toggle-btn active';

const sidebarToggleButton2 = document.createElement('button');
sidebarToggleButton2.textContent = 'get sidebar2';
sidebarToggleButton2.className = 'sidebar-toggle-btn';

sidebarToggleContainer.appendChild(sidebarToggleButton1);
sidebarToggleContainer.appendChild(sidebarToggleButton2);

const jsonButton = document.createElement('button');
jsonButton.textContent = 'Get JSON';
jsonButton.className = 'generate-json-btn';

const htmlButton = document.createElement('button');
htmlButton.textContent = 'Get HTML';
htmlButton.className = 'generate-html-btn';

const clearButton = document.createElement('button');
clearButton.textContent = 'Clear';
clearButton.className = 'clear-btn';

const sharedOutput = document.createElement('pre');
sharedOutput.className = 'json-output';

jsonBar.appendChild(jsonButton);
jsonBar.appendChild(htmlButton);
jsonBar.appendChild(clearButton);
jsonBar.appendChild(sharedOutput);

const mainWrapper = document.createElement('div');
mainWrapper.className = 'main-wrapper';

mainWrapper.appendChild(main);
mainWrapper.appendChild(jsonBar);

appContainer.appendChild(sidebar);
appContainer.appendChild(mainWrapper);
document.body.appendChild(appContainer);

let myControllerItem = null;

function getDefaultData(type) {
  if (type === 'input-fields') {
    return {
      type: 'fieldset',
      label: 'Input Fields',
      children: [
        getDefaultData('autocomplete'),
        getDefaultData('button'),
        getDefaultData('checkbox'),
        getDefaultData('datefield'),
        getDefaultData('uploadfile'),
        getDefaultData('header')
      ]
    };
  }
 
  return {
    type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
    values: [],
    name: `${type}-${Date.now()}`,
    required: false,
    children: []
  };
}

let currentDropTarget = main;
let selectedFieldset = null;
let dragSrcEl = null;

let sidebar1Items = sidebarItems.filter(item => item.type !== 'controller');
let sidebar2Items = sidebarItems.filter(item => item.type === 'controller');

function renderSidebar1() {
  sidebar.innerHTML = '';
  sidebar1Items.forEach(item => {
    if (item.children) {
      const parentContainer = document.createElement('div');
      parentContainer.className = 'sidebar-parent-container';
     
      const parentEl = document.createElement('div');
      parentEl.className = 'sidebar-parent-item';
     
      const toggleIcon = document.createElement('span');
      toggleIcon.className = 'toggle-icon';
      toggleIcon.textContent = '▶';
      toggleIcon.style.marginRight = '5px';
      toggleIcon.style.cursor = 'pointer';
     
      const label = document.createElement('span');
      label.textContent = item.label;
      label.style.cursor = 'pointer';
     
      parentEl.appendChild(toggleIcon);
      parentEl.appendChild(label);
      parentEl.dataset.type = item.type;
     
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'sidebar-children-container';
      childrenContainer.style.display = 'none';
     
      item.children.forEach(child => {
        const childEl = document.createElement('div');
        childEl.className = 'sidebar-child-item';
        childEl.textContent = child.label;
        childEl.dataset.type = child.type;
        childEl.setAttribute('draggable', 'true');
       
        childEl.addEventListener('dragstart', e => {
          e.dataTransfer.setData('type', child.type);
        });
       
        childEl.addEventListener('click', () => {
          const data = formData.find(f => f.type === child.type) || getDefaultData(child.type);
          renderFormBlock(child.type, JSON.parse(JSON.stringify(data)), currentDropTarget);
        });
       
        childrenContainer.appendChild(childEl);
      });
     
      const toggleChildren = () => {
        const isHidden = childrenContainer.style.display === 'none';
        childrenContainer.style.display = isHidden ? 'block' : 'none';
        toggleIcon.textContent = isHidden ? '▼' : '▶';
      };
     
      parentEl.addEventListener('click', (e) => {
        if (!e.target.classList.contains('sidebar-child-item')) {
          toggleChildren();
        }
      });
     
      parentContainer.appendChild(parentEl);
      parentContainer.appendChild(childrenContainer);
      sidebar.appendChild(parentContainer);
    } else {
      const el = document.createElement('div');
      el.className = 'sidebar-item';
      el.textContent = item.label;
      el.dataset.type = item.type;
      el.setAttribute('draggable', 'true');
     
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('type', item.type);
      });
     
      el.addEventListener('click', () => {
        const data = formData.find(f => f.type === item.type) || getDefaultData(item.type);
        renderFormBlock(item.type, JSON.parse(JSON.stringify(data)), currentDropTarget);
      });
     
      sidebar.appendChild(el);
    }
  });
  
  sidebar.appendChild(sidebarToggleContainer);
  sidebarToggleButton1.classList.add('active');
  sidebarToggleButton2.classList.remove('active');
}

function renderSidebar2() {
  sidebar.innerHTML = '';
  if (sidebar2Items.length > 0) {
    const item = sidebar2Items[0];
    myControllerItem = item;
    
    const parentContainer = document.createElement('div');
    parentContainer.className = 'sidebar-parent-container';
   
    const parentEl = document.createElement('div');
    parentEl.className = 'sidebar-parent-item';
   
    const toggleIcon = document.createElement('span');
    toggleIcon.className = 'toggle-icon';
    toggleIcon.textContent = '▶';
    toggleIcon.style.marginRight = '5px';
    toggleIcon.style.cursor = 'pointer';
   
    const label = document.createElement('span');
    label.textContent = item.label;
    label.style.cursor = 'pointer';
   
    parentEl.appendChild(toggleIcon);
    parentEl.appendChild(label);
    parentEl.dataset.type = item.type;
   
    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'sidebar-children-container';
    childrenContainer.style.display = 'none';
   
    const toggleChildren = () => {
      const isHidden = childrenContainer.style.display === 'none';
      childrenContainer.style.display = isHidden ? 'block' : 'none';
      toggleIcon.textContent = isHidden ? '▼' : '▶';
    };
   
    parentEl.addEventListener('click', (e) => {
      if (!e.target.classList.contains('sidebar-child-item')) {
        toggleChildren();
      }
    });
   
    parentContainer.appendChild(parentEl);
    parentContainer.appendChild(childrenContainer);
    sidebar.appendChild(parentContainer);
    
    updateSidebarController();
  }
  
  sidebar.appendChild(sidebarToggleContainer);
  sidebarToggleButton2.classList.add('active');
  sidebarToggleButton1.classList.remove('active');
}

sidebarToggleButton1.addEventListener('click', renderSidebar1);
sidebarToggleButton2.addEventListener('click', renderSidebar2);

renderSidebar1();

function setupDropTarget(container) {
  container.addEventListener('dragover', e => {
    e.preventDefault();
    container.classList.add('drag-over');
  });

  container.addEventListener('dragleave', e => {
    container.classList.remove('drag-over');
  });

  container.addEventListener('drop', e => {
    e.preventDefault();
    container.classList.remove('drag-over');
    const type = e.dataTransfer.getData('type');
    if (!type) return;

    if (type === 'fieldset' && container.classList.contains('fieldset-children')) {
      return;
    }

    const data = formData.find(f => f.type === type) || getDefaultData(type);
    renderFormBlock(type, JSON.parse(JSON.stringify(data)), container);
  });
}
setupDropTarget(main);

function updateControllerItems() {
  if (!myControllerItem) return;
  
  myControllerItem.children = [];
  
  // First add the top-level items (not in fieldsets)
  const topLevelItems = main.querySelectorAll(':scope > .form-block:not(.fieldset-block)');
  topLevelItems.forEach((item, index) => {
    const type = item.__data.type;
    const label = item.__data.label || type;
    const name = item.__data.name || `${type}-${index}`;
    
    myControllerItem.children.push({
      label: label,
      type: type,
      id: name
    });
    
    if (!item.__data.name) {
      item.__data.name = name;
    }
  });
  
  // Then add the fieldsets and their children
  const fieldsets = main.querySelectorAll('.fieldset-block');
  fieldsets.forEach((fieldset, index) => {
    const fieldsetData = fieldset.__data;
    const fieldsetId = fieldsetData.name || `fieldset-${index}`;
    
    const fieldsetEntry = {
      type: 'fieldset',
      label: fieldsetData.label || `Fieldset ${index + 1}`,
      id: fieldsetId,
      children: []
    };
    
    const nestedContainer = fieldset.querySelector('.fieldset-children');
    if (nestedContainer) {
      const children = nestedContainer.querySelectorAll('.form-block');
      
      children.forEach(child => {
        const type = child.__data.type;
        const label = child.__data.label || type;
        const name = child.__data.name || `${type}-${Date.now()}`;
        
        fieldsetEntry.children.push({
          label: label,
          type: type,
          id: name
        });
        
        if (!child.__data.name) {
          child.__data.name = name;
        }
      });
    }
    
    myControllerItem.children.push(fieldsetEntry);
  });
  
  updateSidebarController();
}

function updateSidebarController() {
  const controllerParent = document.querySelector('.sidebar-parent-item[data-type="controller"]');
  if (!controllerParent) return;
  
  // Save open states
  const openStates = {};
  const existingContainers = document.querySelectorAll('.controller-fieldset-container, .controller-top-level-item');
  existingContainers.forEach(container => {
    if (container.classList.contains('controller-fieldset-container')) {
      const header = container.querySelector('.controller-fieldset-header');
      const childrenContainer = container.querySelector('.controller-fieldset-children');
      if (header && childrenContainer) {
        openStates[header.dataset.id] = childrenContainer.style.display !== 'none';
      }
    }
  });

  let childrenContainer = controllerParent.nextElementSibling;
  if (!childrenContainer || !childrenContainer.classList.contains('sidebar-children-container')) {
    childrenContainer = document.createElement('div');
    childrenContainer.className = 'sidebar-children-container';
    controllerParent.parentNode.appendChild(childrenContainer);
  }
  
  childrenContainer.innerHTML = '';
  
  myControllerItem.children.forEach(item => {
    if (item.type === 'fieldset') {
      // Handle fieldset items
      const fieldsetContainer = document.createElement('div');
      fieldsetContainer.className = 'controller-fieldset-container';
      
      const fieldsetHeader = document.createElement('div');
      fieldsetHeader.className = 'controller-fieldset-header';
      fieldsetHeader.setAttribute('draggable', 'true');
      fieldsetHeader.dataset.id = item.id;
      
      const toggleIcon = document.createElement('span');
      toggleIcon.className = 'toggle-icon';
      toggleIcon.textContent = '▶';
      toggleIcon.style.marginRight = '5px';
      toggleIcon.style.cursor = 'pointer';
      
      const fieldsetLabel = document.createElement('span');
      fieldsetLabel.textContent = item.label;
      fieldsetLabel.style.cursor = 'pointer';
      
      fieldsetHeader.appendChild(toggleIcon);
      fieldsetHeader.appendChild(fieldsetLabel);
      
      const fieldsetChildrenContainer = document.createElement('div');
      fieldsetChildrenContainer.className = 'controller-fieldset-children';
      fieldsetChildrenContainer.style.display = 'none';
      
      if (openStates[item.id]) {
        fieldsetChildrenContainer.style.display = 'block';
        toggleIcon.textContent = '▼';
      }
      
      item.children.forEach(child => {
        const childEl = document.createElement('div');
        childEl.className = 'sidebar-child-item';
        childEl.textContent = child.label;
        childEl.dataset.type = child.type;
        childEl.dataset.id = child.id;
        childEl.style.paddingLeft = '20px';
        childEl.setAttribute('draggable', 'true');
        
        childEl.addEventListener('dragstart', e => {
          e.dataTransfer.setData('controller-item', child.id);
          e.target.classList.add('dragging');
        });
        
        childEl.addEventListener('dragend', e => {
          e.target.classList.remove('dragging');
        });
        
        childEl.addEventListener('click', () => {
          highlightFormElement(child.id, child.type, child.label);
        });
        
        fieldsetChildrenContainer.appendChild(childEl);
      });
      
      const toggleChildren = () => {
        const isHidden = fieldsetChildrenContainer.style.display === 'none';
        fieldsetChildrenContainer.style.display = isHidden ? 'block' : 'none';
        toggleIcon.textContent = isHidden ? '▼' : '▶';
      };
      
      fieldsetHeader.addEventListener('click', (e) => {
        if (!e.target.classList.contains('sidebar-child-item')) {
          toggleChildren();
        }
      });
      
      fieldsetHeader.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('controller-fieldset', item.id);
        e.target.classList.add('dragging-fieldset');
      });
      
      fieldsetHeader.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging-fieldset');
      });
      
      fieldsetContainer.appendChild(fieldsetHeader);
      fieldsetContainer.appendChild(fieldsetChildrenContainer);
      childrenContainer.appendChild(fieldsetContainer);
    } else {
      // Handle top-level items
      const topLevelItem = document.createElement('div');
      topLevelItem.className = 'controller-top-level-item';
      topLevelItem.setAttribute('draggable', 'true');
      topLevelItem.dataset.id = item.id;
      
      const itemLabel = document.createElement('span');
      itemLabel.textContent = item.label;
      itemLabel.style.cursor = 'pointer';
      
      topLevelItem.appendChild(itemLabel);
      topLevelItem.dataset.type = item.type;
      
      topLevelItem.addEventListener('dragstart', e => {
        e.dataTransfer.setData('controller-item', item.id);
        e.target.classList.add('dragging');
      });
      
      topLevelItem.addEventListener('dragend', e => {
        e.target.classList.remove('dragging');
      });
      
      topLevelItem.addEventListener('click', () => {
        highlightFormElement(item.id, item.type, item.label);
      });
      
      childrenContainer.appendChild(topLevelItem);
    }
  });
  
  setupControllerDragDrop(childrenContainer);
}

function highlightFormElement(id, type, label) {
  // First check top-level items
  const topLevelItems = main.querySelectorAll(':scope > .form-block:not(.fieldset-block)');
  for (const item of topLevelItems) {
    if (item.__data.name === id || 
        (item.__data.type === type && item.__data.label === label)) {
      item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      item.classList.add('highlight');
      setTimeout(() => item.classList.remove('highlight'), 2000);
      return;
    }
  }
  
  // Then check items inside fieldsets
  const fieldsets = main.querySelectorAll('.fieldset-block');
  for (const fieldset of fieldsets) {
    const nestedContainer = fieldset.querySelector('.fieldset-children');
    if (nestedContainer) {
      const items = nestedContainer.querySelectorAll('.form-block');
      for (const item of items) {
        if (item.__data.name === id ||
            (item.__data.type === type && item.__data.label === label)) {
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
          item.classList.add('highlight');
          setTimeout(() => item.classList.remove('highlight'), 2000);
          return;
        }
      }
    }
  }
  
  alert('Corresponding form element not found!');
}

function setupControllerDragDrop(container) {
  let draggedItem = null;
  let dropIndicator = null;

  container.addEventListener('dragover', e => {
    e.preventDefault();
    draggedItem = document.querySelector('.dragging, .dragging-fieldset');
    if (!draggedItem) return;

    if (dropIndicator) {
      dropIndicator.remove();
    }

    const isFieldset = draggedItem.classList.contains('dragging-fieldset');
    const isTopLevel = draggedItem.classList.contains('controller-top-level-item');
    const selector = isFieldset ? '.controller-fieldset-container' : 
                     isTopLevel ? '.controller-top-level-item' : '.sidebar-child-item';
    
    const afterElement = getDragAfterElement(container, e.clientY, selector);
    
    dropIndicator = document.createElement('div');
    dropIndicator.className = 'drop-indicator';
    
    if (afterElement && afterElement.parentNode === container) {
      container.insertBefore(dropIndicator, afterElement);
    } else {
      container.appendChild(dropIndicator);
    }
  });

  container.addEventListener('dragleave', e => {
    if (dropIndicator) {
      dropIndicator.remove();
    }
  });

  container.addEventListener('drop', e => {
    e.preventDefault();
    
    if (dropIndicator) {
      dropIndicator.remove();
    }
    
    const itemId = e.dataTransfer.getData('controller-item');
    const fieldsetId = e.dataTransfer.getData('controller-fieldset');
    
    if (fieldsetId) {
      // Handle fieldset reordering
      const draggable = document.querySelector('.dragging-fieldset');
      if (!draggable) return;
      
      const fieldsetContainer = draggable.closest('.controller-fieldset-container');
      const afterElement = getDragAfterElement(container, e.clientY, '.controller-fieldset-container');
      
      if (fieldsetContainer && fieldsetContainer.parentNode === container) {
        if (afterElement && afterElement.parentNode === container && afterElement !== fieldsetContainer) {
          const temp = document.createElement('div');
          container.insertBefore(temp, afterElement);
          container.insertBefore(afterElement, fieldsetContainer);
          container.insertBefore(fieldsetContainer, temp);
          container.removeChild(temp);
        } else if (!afterElement && fieldsetContainer !== container.lastChild) {
          container.appendChild(fieldsetContainer);
        }
        
        const fieldsetContainers = Array.from(container.querySelectorAll('.controller-fieldset-container'));
        const newOrder = fieldsetContainers.map(el => el.querySelector('.controller-fieldset-header').dataset.id);
        
        const mainFieldsets = Array.from(main.querySelectorAll('.fieldset-block'));
        mainFieldsets.sort((a, b) => {
          const aIndex = newOrder.indexOf(a.__data.name);
          const bIndex = newOrder.indexOf(b.__data.name);
          return aIndex - bIndex;
        });

        main.innerHTML = '';
        mainFieldsets.forEach(fieldset => {
          main.appendChild(fieldset);
        });
        
        // Also reorder top-level items
        const topLevelItems = Array.from(container.querySelectorAll('.controller-top-level-item'));
        const topLevelOrder = topLevelItems.map(el => el.dataset.id);
        
        const mainTopLevelItems = Array.from(main.querySelectorAll(':scope > .form-block:not(.fieldset-block)'));
        mainTopLevelItems.sort((a, b) => {
          const aIndex = topLevelOrder.indexOf(a.__data.name);
          const bIndex = topLevelOrder.indexOf(b.__data.name);
          return aIndex - bIndex;
        });
        
        mainTopLevelItems.forEach(item => {
          main.appendChild(item);
        });
      }
      return;
    }

    if (!itemId) return;

    const draggable = document.querySelector('.dragging');
    if (!draggable) return;
    
    const isTopLevel = draggable.classList.contains('controller-top-level-item');
    const selector = isTopLevel ? '.controller-top-level-item' : '.sidebar-child-item';
    const afterElement = getDragAfterElement(container, e.clientY, selector);
    const parentContainer = draggable.parentNode;
    
    if (draggable.parentNode === parentContainer && afterElement && afterElement.parentNode === parentContainer) {
      const temp = document.createElement('div');
      parentContainer.insertBefore(temp, afterElement);
      parentContainer.insertBefore(afterElement, draggable);
      parentContainer.insertBefore(draggable, temp);
      parentContainer.removeChild(temp);

      if (isTopLevel) {
        // Handle top-level items reordering
        const topLevelItems = Array.from(container.querySelectorAll('.controller-top-level-item'));
        const newOrder = topLevelItems.map(el => el.dataset.id);
        
        const mainTopLevelItems = Array.from(main.querySelectorAll(':scope > .form-block:not(.fieldset-block)'));
        mainTopLevelItems.sort((a, b) => {
          const aIndex = newOrder.indexOf(a.__data.name);
          const bIndex = newOrder.indexOf(b.__data.name);
          return aIndex - bIndex;
        });
        
        mainTopLevelItems.forEach(item => {
          main.appendChild(item);
        });
      } else {
        // Handle items inside fieldsets
        const childItems = Array.from(parentContainer.querySelectorAll('.sidebar-child-item'));
        const newOrder = childItems.map(el => el.dataset.id);

        const fieldsets = main.querySelectorAll('.fieldset-block');
        fieldsets.forEach(fieldset => {
          const nestedContainer = fieldset.querySelector('.fieldset-children');
          if (nestedContainer) {
            const items = Array.from(nestedContainer.querySelectorAll('.form-block'));
            
            items.sort((a, b) => {
              const aIndex = newOrder.indexOf(a.__data.name);
              const bIndex = newOrder.indexOf(b.__data.name);
              return aIndex - bIndex;
            });

            nestedContainer.innerHTML = '';
            items.forEach(item => {
              nestedContainer.appendChild(item);
            });
          }
        });
      }
    }
  });
}

function getDragAfterElement(container, y, selector) {
  const draggableElements = [...container.querySelectorAll(`${selector}:not(.dragging):not(.dragging-fieldset)`)];
  
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function renderFormBlock(type, data, container) {
  const block = document.createElement('div');
  block.className = 'form-block';
  block.setAttribute('draggable', 'true');
  block.__data = data;
  block.__isInFieldset = container.classList.contains('fieldset-children');

  block.addEventListener('dragstart', (e) => {
    dragSrcEl = block;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', block.innerHTML);
    e.stopPropagation();
  });

  block.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    block.classList.add('drag-over-reorder');
    e.stopPropagation();
  });

  block.addEventListener('dragleave', (e) => {
    block.classList.remove('drag-over-reorder');
    e.stopPropagation();
  });

  block.addEventListener('drop', (e) => {
    e.stopPropagation();
    block.classList.remove('drag-over-reorder');

    if (dragSrcEl && dragSrcEl !== block && dragSrcEl.parentElement === block.parentElement) {
      const siblings = Array.from(block.parentElement.children);
      const srcIndex = siblings.indexOf(dragSrcEl);
      const targetIndex = siblings.indexOf(block);

      if (srcIndex < targetIndex) {
        block.parentElement.insertBefore(dragSrcEl, block.nextSibling);
      } else {
        block.parentElement.insertBefore(dragSrcEl, block);
      }

      if (block.__isInFieldset && myControllerItem) {
        updateControllerItems();
      }
    }
    return false;
  });

  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '❌';
  deleteBtn.className = 'delete-btn';
  deleteBtn.title = 'Delete';
  deleteBtn.addEventListener('click', () => {
    block.remove();
    if (myControllerItem) updateControllerItems();
  });

  if (type !== 'fieldset') {
    const settingsBtn = document.createElement('button');
    settingsBtn.innerHTML = '✏️';
    settingsBtn.className = 'edit-btn';
    settingsBtn.title = 'Edit';

    toolbar.appendChild(settingsBtn);

    const content = document.createElement('div');
    content.className = 'form-content';

    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'field-container';
    fieldContainer.__data = data;

    const previewFn = formComponents[type];
    const settingsKey = type + 'Settings';
    const settingsFn = formComponents[settingsKey];

    if (!previewFn) {
      fieldContainer.innerHTML = `<p class="warning">Unknown component: <strong>${type}</strong></p>`;
      block.appendChild(fieldContainer);
      container.appendChild(block);
      return;
    }

    const previewDiv = document.createElement('div');
    previewDiv.className = 'preview-view';
    previewDiv.innerHTML = previewFn(data);

    const labelPreview = document.createElement('div');
    labelPreview.className = 'label-only-preview';
    labelPreview.style.display = 'none';
    labelPreview.textContent = data.label || 'Untitled';

    const settingsDiv = document.createElement('div');
    settingsDiv.className = 'settings-view';
    settingsDiv.style.display = 'none';
    settingsDiv.innerHTML = settingsFn ? settingsFn(data) : '';
    let isEditing = false;

    fieldContainer.dataset.mode = 'input';

    settingsBtn.addEventListener('click', () => {
      if (isEditing) {
        const labelInput = settingsDiv.querySelector('input[type="text"]');
        if (labelInput && labelInput.value.trim()) {
          data.label = labelInput.value.trim();
          fieldContainer.__data.label = data.label;
          if (myControllerItem) updateControllerItems();
        }
        previewDiv.innerHTML = previewFn(data);
        labelPreview.textContent = data.label || 'Untitled';

        previewDiv.style.display = 'block';
        labelPreview.style.display = 'none';
        settingsDiv.style.display = 'none';
        isEditing = false;
      } else {
        previewDiv.style.display = 'none';
        labelPreview.style.display = 'block';
        settingsDiv.style.display = 'block';
        isEditing = true;
      }
    });

    fieldContainer.appendChild(previewDiv);
    fieldContainer.appendChild(labelPreview);
    fieldContainer.appendChild(settingsDiv);

    toolbar.appendChild(deleteBtn);
    block.appendChild(toolbar);
    block.appendChild(content);
    content.appendChild(fieldContainer);

    container.appendChild(block);
    if (myControllerItem) updateControllerItems();
    return;
  }

  if (type === 'fieldset') {
    block.classList.add('fieldset-block');
    block.setAttribute('draggable', 'true');

    block.addEventListener('dragstart', (e) => {
      dragSrcEl = block;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', block.innerHTML);
      e.stopPropagation();
    });

    block.addEventListener('dragover', (e) => {
      if (dragSrcEl && dragSrcEl !== block && dragSrcEl.classList.contains('fieldset-block')) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        block.classList.add('drag-over-reorder');
      }
      e.stopPropagation();
    });

    block.addEventListener('dragleave', (e) => {
      block.classList.remove('drag-over-reorder');
      e.stopPropagation();
    });

    block.addEventListener('drop', (e) => {
      e.stopPropagation();
      block.classList.remove('drag-over-reorder');

      if (dragSrcEl && dragSrcEl !== block &&
          dragSrcEl.classList.contains('fieldset-block') &&
          dragSrcEl.parentElement === block.parentElement) {
       
        const siblings = Array.from(block.parentElement.children);
        const srcIndex = siblings.indexOf(dragSrcEl);
        const targetIndex = siblings.indexOf(block);

        if (srcIndex < targetIndex) {
          block.parentElement.insertBefore(dragSrcEl, block.nextSibling);
        } else {
          block.parentElement.insertBefore(dragSrcEl, block);
        }

        updateControllerItems();
      }
    });

    block.addEventListener('dragend', () => {
      block.classList.remove('drag-over-reorder');
    });

    block.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      if (selectedFieldset) {
        selectedFieldset.classList.remove('selected-fieldset');
      }
      selectedFieldset = block;
      currentDropTarget = block.querySelector('.fieldset-children');
      block.classList.add('selected-fieldset');
      e.stopPropagation();
    });

    const legend = document.createElement('legend');
    legend.textContent = data.label || 'Fieldset';

    const nestedContainer = document.createElement('div');
    nestedContainer.className = 'fieldset-children';
    nestedContainer.style.minHeight = '40px';
    nestedContainer.style.border = '1px dashed #ccc';
    nestedContainer.style.padding = '5px';
    nestedContainer.style.marginTop = '10px';

    setupDropTarget(nestedContainer);

    if (Array.isArray(data.children)) {
      data.children.forEach(childData => {
        renderFormBlock(childData.type, childData, nestedContainer);
      });
    }

    const fieldsetEl = document.createElement('fieldset');
    fieldsetEl.appendChild(legend);
    fieldsetEl.appendChild(nestedContainer);

    const content = document.createElement('div');
    content.className = 'form-content';
    content.appendChild(fieldsetEl);

    toolbar.appendChild(deleteBtn);
    block.appendChild(toolbar);
    block.appendChild(content);

    container.appendChild(block);

    const observer = new MutationObserver(() => {
      if (myControllerItem) updateControllerItems();
    });
    observer.observe(nestedContainer, { childList: true });
    if (myControllerItem) updateControllerItems();
  }
}

function collectData(container) {
  const blocks = container.querySelectorAll(':scope > .form-block');
  const result = [];

  blocks.forEach(block => {
    const data = JSON.parse(JSON.stringify(block.__data || {}));
    if (data.type === 'fieldset') {
      const nestedContainer = block.querySelector('.fieldset-children');
      if (nestedContainer) {
        data.children = collectData(nestedContainer);
      }
    }
    result.push(data);
  });

  return result;
}

function collectHTML(container) {
  const blocks = container.querySelectorAll(':scope > .form-block');
  let html = '';

  blocks.forEach(block => {
    const data = block.__data || {};
    if (data.type === 'fieldset') {
      const legend = block.querySelector('legend')?.textContent || '';
      const nestedContainer = block.querySelector('.fieldset-children');
      const nestedHtml = nestedContainer ? collectHTML(nestedContainer) : '';
      html += `<fieldset><legend>${legend}</legend>${nestedHtml}</fieldset>\n`;
    } else {
      const previewDiv = block.querySelector('.preview-view');
      if (previewDiv) {
        html += previewDiv.innerHTML + '\n';
      }
    }
  });

  return html;
}

jsonButton.addEventListener('click', () => {
  const data = collectData(main);
  sharedOutput.textContent = JSON.stringify(data, null, 2);
});

htmlButton.addEventListener('click', () => {
  const html = collectHTML(main);
  sharedOutput.textContent = html;
});

clearButton.addEventListener('click', () => {
  main.innerHTML = '';
  sharedOutput.textContent = '';
  selectedFieldset = null;
  currentDropTarget = main;
  if (myControllerItem) {
    myControllerItem.children = [];
    updateSidebarController();
  }
});

const mainEl = document.getElementById('form-canvas');
let isDraggingMain = false;
let startX, startY;
let origX = 0, origY = 0;

mainEl.style.touchAction = 'none';

mainEl.addEventListener('pointerdown', (e) => {
  if (e.target.closest('.form-block, button, input, textarea, select, legend')) {
    return;
  }
  e.preventDefault();
  isDraggingMain = true;
  startX = e.clientX;
  startY = e.clientY;

  const style = window.getComputedStyle(mainEl);
  const matrix = new DOMMatrixReadOnly(style.transform);
  origX = matrix.m41;
  origY = matrix.m42;

  window.addEventListener('pointermove', pointerMoveHandler);
  window.addEventListener('pointerup', pointerUpHandler);
  window.addEventListener('pointercancel', pointerUpHandler);
});

function pointerMoveHandler(e) {
  if (!isDraggingMain) return;
  e.preventDefault();

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  mainEl.style.transform = `translate(${origX + dx}px, ${origY + dy}px)`;
}

function pointerUpHandler(e) {
  if (!isDraggingMain) return;
  e.preventDefault();

  isDraggingMain = false;

  window.removeEventListener('pointermove', pointerMoveHandler);
  window.removeEventListener('pointerup', pointerUpHandler);
  window.removeEventListener('pointercancel', pointerUpHandler);
}

document.addEventListener('DOMContentLoaded', () => {
  if (myControllerItem) {
    updateSidebarController();
  }
});