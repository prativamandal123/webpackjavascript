import sidebarItems from './data/sidebar-config.json';
import { formComponents } from './components/index.js';
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

//Sidebar items(tree str)
sidebarItems.forEach(item => {
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

function renderFormBlock(type, data, container) {
  const block = document.createElement('div');
  block.className = 'form-block';
  block.setAttribute('draggable', 'true');
  block.__data = data;

  // Drag event for reordering
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
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    block.classList.add('drag-over-reorder');
  });

  block.addEventListener('dragleave', (e) => {
    block.classList.remove('drag-over-reorder');
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
    }
    return false;
  });

  //Toolbar
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '❌';
  deleteBtn.className = 'delete-btn';
  deleteBtn.title = 'Delete';
  deleteBtn.addEventListener('click', () => {
    block.remove();
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
    return;
  }

  // Fieldset specific rendering
  if (type === 'fieldset') {
    block.classList.add('fieldset-block');

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
