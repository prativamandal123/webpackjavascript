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

appContainer.appendChild(sidebar);
appContainer.appendChild(main);
document.body.appendChild(appContainer);

function getDefaultData(type) {
  return {
    label: type.charAt(0).toUpperCase() + type.slice(1),
    values: [],
    name: `${type}-${Date.now()}`,
    required: false
  };
}

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
  settingsBtn.innerHTML = '⚙️';
  settingsBtn.className = 'edit-btn';
  settingsBtn.title = 'Edit';

  // Main content container inside form-block
  const content = document.createElement('div');
  content.className = 'form-content';

  // Always render label upfront
  const labelEl = document.createElement('label');
  labelEl.textContent = data.label || type.charAt(0).toUpperCase() + type.slice(1);
  content.appendChild(labelEl);

  // Container for input or settings form
  const fieldContainer = document.createElement('div');
  fieldContainer.className = 'field-container';
  fieldContainer.innerHTML = formComponents[type] ? formComponents[type](data) : `<p class="warning">Unknown component: <strong>${type}</strong></p>`;
  content.appendChild(fieldContainer);

  settingsBtn.addEventListener('click', () => {
    const settingsKey = type + 'Settings';
    const extendedSettings = formComponents[settingsKey];
    if (!extendedSettings) return;

    // Toggle between input and settings
    if (fieldContainer.dataset.mode === 'settings') {
      // Switch back to input field preview
      fieldContainer.innerHTML = formComponents[type](data);
      fieldContainer.dataset.mode = 'input';
    } else {
      // Switch to settings form
      fieldContainer.innerHTML = extendedSettings(data);
      fieldContainer.dataset.mode = 'settings';
    }
  });

  toolbar.appendChild(settingsBtn);
  toolbar.appendChild(deleteBtn);

  block.appendChild(toolbar);
  block.appendChild(content);
  main.appendChild(block);
}
