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

// === Generate JSON Button and Output ===
const jsonBar = document.createElement('div');
jsonBar.className = 'json-bar';

const jsonButton = document.createElement('button');
jsonButton.textContent = 'Generate JSON';
jsonButton.className = 'generate-json-btn';

const jsonOutput = document.createElement('pre');
jsonOutput.className = 'json-output';

jsonBar.appendChild(jsonButton);
jsonBar.appendChild(jsonOutput);

// Create a wrapper to hold main and jsonBar vertically
const mainWrapper = document.createElement('div');
mainWrapper.className = 'main-wrapper';

mainWrapper.appendChild(main);
mainWrapper.appendChild(jsonBar);

// Append sidebar and mainWrapper to appContainer
appContainer.appendChild(sidebar);
appContainer.appendChild(mainWrapper);

document.body.appendChild(appContainer);

// Default data helper
function getDefaultData(type) {
  return {
    label: type.charAt(0).toUpperCase() + type.slice(1),
    values: [],
    name: `${type}-${Date.now()}`,
    required: false
  };
}

// Create sidebar draggable items
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

// Allow main content area to accept drops
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

// Render form block
function renderFormBlock(type, data) {
  const block = document.createElement('div');
  block.className = 'form-block';

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
  fieldContainer.__data = data;

  const previewFn = formComponents[type];
  const settingsKey = type + 'Settings';
  const settingsFn = formComponents[settingsKey];

  if (!previewFn) {
    fieldContainer.innerHTML = `<p class="warning">Unknown component: <strong>${type}</strong></p>`;
    block.appendChild(fieldContainer);
    main.appendChild(block);
    return;
  }

  // 👇 Full preview (label + input)
  const previewDiv = document.createElement('div');
  previewDiv.className = 'preview-view';
  previewDiv.innerHTML = previewFn(data);

  // 👇 Label-only preview
  const labelPreview = document.createElement('div');
  labelPreview.className = 'label-only-preview';
  labelPreview.style.display = 'none';
  labelPreview.textContent = data.label || 'Untitled';

  // 👇 Settings section (hidden initially)
  const settingsDiv = document.createElement('div');
  settingsDiv.className = 'settings-view';
  settingsDiv.style.display = 'none';
  settingsDiv.innerHTML = settingsFn(data);

  // 👇 Toggle settings view
  let isEditing = false;
  settingsBtn.addEventListener('click', () => {
    if (isEditing) {
      // Save label
      const labelInput = settingsDiv.querySelector('input[type="text"]');
      if (labelInput && labelInput.value.trim()) {
        data.label = labelInput.value.trim();
      }

      previewDiv.innerHTML = previewFn(data);
      labelPreview.textContent = data.label || 'Untitled';

      // Show full preview again
      previewDiv.style.display = 'block';
      labelPreview.style.display = 'none';
      settingsDiv.style.display = 'none';
      isEditing = false;
    } else {
      // Show only label + settings
      previewDiv.style.display = 'none';
      labelPreview.style.display = 'block';
      settingsDiv.style.display = 'block';
      isEditing = true;
    }
  });

  fieldContainer.appendChild(previewDiv);      // full view
  fieldContainer.appendChild(labelPreview);    // label only
  fieldContainer.appendChild(settingsDiv);     // settings form

  content.appendChild(fieldContainer);
  toolbar.appendChild(settingsBtn);
  toolbar.appendChild(deleteBtn);

  block.appendChild(toolbar);
  block.appendChild(content);
  main.appendChild(block);
}



// Generate JSON from dropped components
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

// Button click handler
jsonButton.addEventListener('click', () => {
  const data = getFormDataFromCanvas();
  jsonOutput.textContent = JSON.stringify(data, null, 2);
});
