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

//Generate Buttons and Shared Output
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

//Create wrapper
const mainWrapper = document.createElement('div');
mainWrapper.className = 'main-wrapper';

mainWrapper.appendChild(main);
mainWrapper.appendChild(jsonBar);

//Assemble page
appContainer.appendChild(sidebar);
appContainer.appendChild(mainWrapper);
document.body.appendChild(appContainer);

//Helpers
function getDefaultData(type) {
  return {
    label: type.charAt(0).toUpperCase() + type.slice(1),
    values: [],
    name: `${type}-${Date.now()}`,
    required: false
  };
}

// Sidebar items
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
    const data = formData.find(f => f.type === item.type);
    renderFormBlock(item.type, data || getDefaultData(item.type));
  });

  sidebar.appendChild(el);
});

// Drop area
main.addEventListener('dragover', e => e.preventDefault());
main.addEventListener('dragenter', e => {
  e.preventDefault();
  main.classList.add('drag-over');
});
main.addEventListener('dragleave', e => {
  e.preventDefault();
  main.classList.remove('drag-over');
});
main.addEventListener('drop', e => {
  e.preventDefault();
  main.classList.remove('drag-over');
  const type = e.dataTransfer.getData('type');
  if (!type) return;
  const data = formData.find(f => f.type === type) || getDefaultData(type);
  renderFormBlock(type, data);
});

//variable to track dragging inside main
let dragSrcEl = null;

//Render form block
function renderFormBlock(type, data) {
  const block = document.createElement('div');
  block.className = 'form-block';

  // Make blocks draggable within main container for reordering
  block.setAttribute('draggable', 'true');

  block.addEventListener('dragstart', (e) => {
    dragSrcEl = block;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', block.innerHTML);
  });

  block.addEventListener('dragover', (e) => {
    e.preventDefault(); // Necessary to allow drop
    e.dataTransfer.dropEffect = 'move';
    block.classList.add('drag-over-reorder');
  });

  block.addEventListener('dragleave', (e) => {
    block.classList.remove('drag-over-reorder');
  });

  block.addEventListener('drop', (e) => {
    e.stopPropagation(); // Stops some browsers from redirecting.
    block.classList.remove('drag-over-reorder');

    if (dragSrcEl !== block) {
      // Reorder blocks in the main container
      const blocksArray = Array.from(main.querySelectorAll('.form-block'));
      const srcIndex = blocksArray.indexOf(dragSrcEl);
      const targetIndex = blocksArray.indexOf(block);

      if (srcIndex < targetIndex) {
        main.insertBefore(dragSrcEl, block.nextSibling);
      } else {
        main.insertBefore(dragSrcEl, block);
      }
    }
    return false;
  });

  // Existing code ...
  const toolbar = document.createElement('div');
  toolbar.className = 'toolbar';

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '❌';
  deleteBtn.className = 'delete-btn';
  deleteBtn.title = 'Delete';
  deleteBtn.addEventListener('click', () => block.remove());

  const settingsBtn = document.createElement('button');
  settingsBtn.innerHTML = '✏️';
  settingsBtn.className = 'edit-btn';
  settingsBtn.title = 'Edit';

  const content = document.createElement('div');
  content.className = 'form-content';

  const fieldContainer = document.createElement('div');
  fieldContainer.className = 'field-container';

  const previewFn = formComponents[type];
  const settingsKey = type + 'Settings';
  const settingsFn = formComponents[settingsKey];

  if (!previewFn) {
    fieldContainer.innerHTML = `<p class="warning">Unknown component: <strong>${type}</strong></p>`;
  } else {
    fieldContainer.innerHTML = previewFn(data);
    fieldContainer.__data = data;
  }

  fieldContainer.dataset.mode = 'input';
  content.appendChild(fieldContainer);

  settingsBtn.addEventListener('click', () => {
    if (!settingsFn) return;

    if (fieldContainer.dataset.mode === 'settings') {
      const labelInput = fieldContainer.querySelector('input[value][type="text"]');
      if (labelInput && labelInput.value.trim() !== '') {
        data.label = labelInput.value.trim();
      }

      fieldContainer.innerHTML = previewFn(data);
      fieldContainer.__data = data;
      fieldContainer.dataset.mode = 'input';
    } else {
      fieldContainer.innerHTML = settingsFn(data);
      fieldContainer.dataset.mode = 'settings';
    }
  });

  toolbar.appendChild(settingsBtn);
  toolbar.appendChild(deleteBtn);

  block.appendChild(toolbar);
  block.appendChild(content);
  main.appendChild(block);
}


// Helpers
function getFormDataFromCanvas() {
  const blocks = main.querySelectorAll('.form-block');
  const result = [];

  blocks.forEach(block => {
    const fieldContainer = block.querySelector('.field-container');
    if (fieldContainer && fieldContainer.__data) {
      result.push(fieldContainer.__data);
    }
  });

  return result;
}

function getHTMLFromCanvas() {
  const blocks = main.querySelectorAll('.form-block');
  let html = '';

  blocks.forEach(block => {
    const fieldContainer = block.querySelector('.field-container');
    if (fieldContainer && fieldContainer.dataset.mode === 'input') {
      html += fieldContainer.innerHTML + '\n';
    }
  });

  return html.trim();
}

// Button listeners
jsonButton.addEventListener('click', () => {
  const data = getFormDataFromCanvas();
  sharedOutput.textContent = JSON.stringify(data, null, 2);
});

htmlButton.addEventListener('click', () => {
  const html = getHTMLFromCanvas();
  sharedOutput.textContent = html;
});

clearButton.addEventListener('click', () => {
  main.innerHTML = '';            // Clear all dropped fields
  sharedOutput.textContent = '';  // Clear output area
});

// Assuming you already have your reorder code for .form-blocks (unchanged)

// --- Make entire main container draggable WITHOUT breaking reorder ---

const mainEl = document.getElementById('form-canvas');

let isDraggingMain = false;
let startX, startY;
let origX = 0, origY = 0;

mainEl.style.touchAction = 'none'; // important for pointer events on touch devices

mainEl.addEventListener('pointerdown', (e) => {
  // Only start drag if NOT clicking inside a form block or its controls
  if (e.target.closest('.form-block, button, input, textarea, select')) {
    return; // skip dragging main if interacting with form blocks
  }
  
  e.preventDefault();
  isDraggingMain = true;
  startX = e.clientX;
  startY = e.clientY;

  // Parse current transform translate values if any
  const style = window.getComputedStyle(mainEl);
  const matrix = new DOMMatrixReadOnly(style.transform);
  origX = matrix.m41; // translateX
  origY = matrix.m42; // translateY

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



