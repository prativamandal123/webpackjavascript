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
  return {
    type,
    label: type.charAt(0).toUpperCase() + type.slice(1),
    values: [],
    name: `${type}-${Date.now()}`,
    required: false,
    children: [] // for fieldsets to hold nested blocks
  };
}

let currentDropTarget = main;
let selectedFieldset = null;
let dragSrcEl = null;

// ─── SIDEBAR: create draggable items and click behavior ───────────────────
sidebarItems.forEach(item => {
  const el = document.createElement('div');
  el.className = 'sidebar-item';
  el.textContent = (item.icon || '') + ' ' + item.label;
  el.dataset.type = item.type;
  el.setAttribute('draggable', 'true');

  el.addEventListener('dragstart', e => {
    e.dataTransfer.setData('type', item.type);
  });

  el.addEventListener('click', () => {
    const type = item.type;
    const data = formData.find(f => f.type === type) || getDefaultData(type);

    if (type === 'fieldset') {
      renderFormBlock(type, JSON.parse(JSON.stringify(data)), main);
      if (selectedFieldset) {
        selectedFieldset.classList.remove('selected-fieldset');
        selectedFieldset.querySelector('.fieldset-children')
                        .classList.remove('selected-fieldset');
        selectedFieldset = null;
        currentDropTarget = main;
      }
    }
    else {
      if (selectedFieldset) {
        const nestedContainer = selectedFieldset.querySelector('.fieldset-children');
        renderFormBlock(type, JSON.parse(JSON.stringify(data)), nestedContainer);
      }
    }
  });

  sidebar.appendChild(el);
});

// ─── DROP TARGET SETUP ────────────────────────────────────────────────────
function setupMainDropArea(container) {
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
    if (type !== 'fieldset') return;
    
    const rows = container.querySelectorAll('.form-row');
    let targetRow = null;
    
    if (rows.length > 0) {
      const dropY = e.clientY;
      let closestDistance = Infinity;
      
      rows.forEach(row => {
        const rect = row.getBoundingClientRect();
        const rowMidY = rect.top + rect.height / 2;
        const distance = Math.abs(dropY - rowMidY);
        
        if (distance < closestDistance && distance < 50) {
          closestDistance = distance;
          targetRow = row;
        }
      });
    }
    
    if (targetRow) {
      const data = formData.find(f => f.type === 'fieldset') || getDefaultData('fieldset');
      renderFormBlock('fieldset', JSON.parse(JSON.stringify(data)), targetRow);
    } else {
      const row = createRowContainer();
      container.appendChild(row);
      const data = formData.find(f => f.type === 'fieldset') || getDefaultData('fieldset');
      renderFormBlock('fieldset', JSON.parse(JSON.stringify(data)), row);
    }
  });
}
setupMainDropArea(main);

function createRowContainer() {
  const row = document.createElement('div');
  row.className = 'form-row';
  row.style.width = '100%';
  row.style.display = 'flex';
  row.style.gap = '20px';
  
  row.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();
    row.classList.add('drag-over-row');
  });
  
  row.addEventListener('dragleave', e => {
    e.stopPropagation();
    row.classList.remove('drag-over-row');
  });
  
  row.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();
    row.classList.remove('drag-over-row');
    const type = e.dataTransfer.getData('type');
    if (type !== 'fieldset') return;
    const data = formData.find(f => f.type === 'fieldset') || getDefaultData('fieldset');
    renderFormBlock('fieldset', JSON.parse(JSON.stringify(data)), row);
  });
  
  return row;
}

// ─── RENDER A FORM BLOCK ────────────────────────────────────────────────
function renderFormBlock(type, data, container) {
  const block = document.createElement('div');
  block.className = 'form-block';
  if (type === 'fieldset') {
    block.classList.add('fieldset-block');
  }
  block.setAttribute('draggable', 'true');
  block.__data = data;

  // Drag and drop handlers
  block.addEventListener('dragstart', e => {
    e.stopPropagation();
    dragSrcEl = block;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', block.innerHTML);
    e.dataTransfer.setData('type', type);
    setTimeout(() => block.classList.add('dragging'), 0);
  });

  block.addEventListener('dragend', () => {
    block.classList.remove('dragging');
    dragSrcEl = null;
  });

  block.addEventListener('dragover', e => {
    if (dragSrcEl && dragSrcEl !== block && 
        dragSrcEl.parentElement === block.parentElement) {
      e.preventDefault();
      e.stopPropagation();
      const rect = block.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      block.classList.toggle('drag-over-top', e.clientY < midpoint);
      block.classList.toggle('drag-over-bottom', e.clientY >= midpoint);
    }
  });

  block.addEventListener('dragleave', e => {
    e.stopPropagation();
    block.classList.remove('drag-over-top', 'drag-over-bottom');
  });

  block.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();
    block.classList.remove('drag-over-top', 'drag-over-bottom');
    
    if (dragSrcEl && dragSrcEl !== block && 
        dragSrcEl.parentElement === block.parentElement) {
      const rect = block.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const isAfter = e.clientY > midpoint;
      
      if (isAfter) {
        block.parentElement.insertBefore(dragSrcEl, block.nextSibling);
      } else {
        block.parentElement.insertBefore(dragSrcEl, block);
      }
    }
  });

  // ─── TOOLBAR ────────────────────────────────────────────────────────
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '❌';
  deleteBtn.title = 'Delete';
  deleteBtn.addEventListener('click', () => block.remove());

  const settingsBtn = document.createElement('button');
  settingsBtn.innerHTML = '✏️';
  settingsBtn.title = 'Edit';
  
  // Combined settings button handler
  settingsBtn.addEventListener('click', () => {
    if (type === 'fieldset') {
      const newLabel = prompt('Enter new label:', data.label);
      if (newLabel && newLabel.trim()) {
        data.label = newLabel.trim();
        if (typeof rerenderContent === 'function') {
          rerenderContent();
        }
      }
    } else {
      if (isEditing) {
        const labelIn = settingsDiv?.querySelector('input[type="text"]');
        if (labelIn && labelIn.value.trim()) {
          data.label = labelIn.value.trim();
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
    }
  });

  toolbar.appendChild(settingsBtn);
  toolbar.appendChild(deleteBtn);
  block.appendChild(toolbar);

  // ─── CONTENT AREA ────────────────────────────────────────────────────
  const content = document.createElement('div');
  content.className = 'form-content';

  if (type === 'fieldset') {
    const fieldsetEl = document.createElement('fieldset');
    const legendEl = document.createElement('legend');
    legendEl.textContent = data.label || 'Fieldset';
    fieldsetEl.appendChild(legendEl);

    const nestedContainer = document.createElement('div');
    nestedContainer.className = 'fieldset-children';
    fieldsetEl.appendChild(nestedContainer);

    fieldsetEl.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      if (selectedFieldset) {
        selectedFieldset.classList.remove('selected-fieldset');
        selectedFieldset.querySelector('.fieldset-children')
                        .classList.remove('selected-fieldset');
      }
      selectedFieldset = fieldsetEl;
      currentDropTarget = nestedContainer;
      fieldsetEl.classList.add('selected-fieldset');
      nestedContainer.classList.add('selected-fieldset');
      e.stopPropagation();
    });

    nestedContainer.addEventListener('dragover', e => {
      e.preventDefault();
      e.stopPropagation();
      nestedContainer.classList.add('drag-over');
    });

    nestedContainer.addEventListener('dragleave', e => {
      e.stopPropagation();
      nestedContainer.classList.remove('drag-over');
    });

    nestedContainer.addEventListener('drop', e => {
      e.preventDefault();
      e.stopPropagation();
      nestedContainer.classList.remove('drag-over');
      const nestedType = e.dataTransfer.getData('type');
      if (!nestedType || nestedType === 'fieldset') return;
      
      const nestedData = formData.find(f => f.type === nestedType) || getDefaultData(nestedType);
      
      const rows = nestedContainer.querySelectorAll('.form-row');
      let targetRow = null;
      
      if (rows.length > 0) {
        const lastRow = rows[rows.length - 1];
        if (lastRow.querySelectorAll('.form-block').length < 2) {
          targetRow = lastRow;
        }
      }
      
      if (targetRow) {
        renderFormBlock(nestedType, JSON.parse(JSON.stringify(nestedData)), targetRow);
      } else {
        const row = createRowContainer();
        nestedContainer.appendChild(row);
        renderFormBlock(nestedType, JSON.parse(JSON.stringify(nestedData)), row);
      }
    });

    if (Array.isArray(data.children)) {
      data.children.forEach(childData => {
        renderFormBlock(childData.type, childData, nestedContainer);
      });
    }

    content.appendChild(fieldsetEl);

    function rerenderContent() {
      legendEl.textContent = data.label || 'Fieldset';
    }
  }
  else {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'field-container';
    fieldContainer.__data = data;

    const previewFn = formComponents[type];
    const settingsFn = formComponents[type + 'Settings'];

    if (!previewFn) {
      fieldContainer.innerHTML = `<p class="warning">Unknown component: <strong>${type}</strong></p>`;
      content.appendChild(fieldContainer);
      block.appendChild(content);
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
    fieldContainer.appendChild(previewDiv);
    fieldContainer.appendChild(labelPreview);
    fieldContainer.appendChild(settingsDiv);
    content.appendChild(fieldContainer);
  }

  block.addEventListener('click', e => {
    if (selectedFieldset) {
      selectedFieldset.classList.remove('selected-fieldset');
      selectedFieldset.querySelector('.fieldset-children')
                      .classList.remove('selected-fieldset');
      selectedFieldset = null;
      currentDropTarget = main;
    }
    e.stopPropagation();
  });

  block.appendChild(content);
  container.appendChild(block);
}

// ─── DATA COLLECTION FUNCTIONS ────────────────────────────────────────
function collectData(container) {
  const result = [];
  
  container.childNodes.forEach(child => {
    if (child.classList && child.classList.contains('form-row')) {
      const rowChildren = [];
      
      child.querySelectorAll(':scope > .form-block').forEach(block => {
        const data = JSON.parse(JSON.stringify(block.__data || {}));
        if (data.type === 'fieldset') {
          const nested = block.querySelector('.fieldset-children');
          data.children = collectData(nested);
        }
        rowChildren.push(data);
      });
      
      if (rowChildren.length > 0) {
        result.push({
          type: 'row',
          children: rowChildren
        });
      }
    } else if (child.classList && child.classList.contains('form-block')) {
      const data = JSON.parse(JSON.stringify(child.__data || {}));
      if (data.type === 'fieldset') {
        const nested = child.querySelector('.fieldset-children');
        data.children = collectData(nested);
      }
      result.push(data);
    }
  });
  
  return result;
}

function collectHTML(container) {
  let html = '';
  
  container.childNodes.forEach(child => {
    if (child.classList && child.classList.contains('form-row')) {
      html += '<div class="form-row">\n';
      
      child.querySelectorAll(':scope > .form-block').forEach(block => {
        const data = block.__data || {};
        if (data.type === 'fieldset') {
          const legendText = block.querySelector('legend').textContent;
          const nested = block.querySelector('.fieldset-children');
          const nestedHTML = collectHTML(nested);
          html += `<fieldset style="flex:1"><legend>${legendText}</legend>\n${nestedHTML}</fieldset>\n`;
        } else {
          const previewDiv = block.querySelector('.preview-view');
          if (previewDiv) {
            html += `<div style="flex:1">${previewDiv.innerHTML}</div>\n`;
          }
        }
      });
      
      html += '</div>\n';
    } else if (child.classList && child.classList.contains('form-block')) {
      const data = child.__data || {};
      if (data.type === 'fieldset') {
        const legendText = child.querySelector('legend').textContent;
        const nested = child.querySelector('.fieldset-children');
        const nestedHTML = collectHTML(nested);
        html += `<fieldset><legend>${legendText}</legend>\n${nestedHTML}</fieldset>\n`;
      } else {
        const previewDiv = child.querySelector('.preview-view');
        if (previewDiv) {
          html += previewDiv.innerHTML + '\n';
        }
      }
    }
  });
  
  return html;
}

// ─── BUTTON LISTENERS ────────────────────────────────────────────────
jsonButton.addEventListener('click', () => {
  const data = collectData(main);
  sharedOutput.textContent = JSON.stringify(data, null, 2);
});

htmlButton.addEventListener('click', () => {
  const html = collectHTML(main);
  sharedOutput.textContent = html.trim();
});

clearButton.addEventListener('click', () => {
  main.innerHTML = '';
  sharedOutput.textContent = '';
  currentDropTarget = main;
  selectedFieldset = null;
});

// ─── MAIN CANVAS DRAG-MOVE ──────────────────────────────────────────
const mainEl = document.getElementById('form-canvas');
let isDraggingMain = false;
let startX, startY;
let origX = 0, origY = 0;

mainEl.style.touchAction = 'none';

mainEl.addEventListener('pointerdown', e => {
  if (e.target.closest('.form-block, button, input, textarea, select, legend')) return;
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

