export function Checkbox(data = {}) {
  const name = data.name || `checkbox-group-${Date.now()}`;

  return `
    <div class="${data.className || ''}">
      <div style="font-weight: bold; color: black; margin-bottom: 5px;">Checkbox</div>
      <label style="${data.inline ? 'display:inline-block;margin-right:10px;' : 'display:block;'}">
        <input type="checkbox" name="${name}" value="option-1" />
      </label>
    </div>
  `;
}


// Extended Settings Panel
export function CheckboxSettings(data = {}) {
  const values = data.values || [];
  const id = `checkbox-options-${Date.now()}`;

  const optionsHTML = values.map(v => `
    <div class="option-item">
      <input type="text" placeholder="Label" value="${v.label || ''}" />
      <input type="text" placeholder="Value" value="${v.value || ''}" />
    </div>
  `).join('');

  
  setTimeout(() => {
    const addBtn = document.querySelector(`#${id}-btn`);
    const wrapper = document.querySelector(`#${id}`);
    if (addBtn && wrapper) {
      addBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerHTML = `
          <input type="text" placeholder="Label" />
          <input type="text" placeholder="Value" />
        `;
        wrapper.appendChild(div);
      });
    }
  }, 0);

  return `
    <div class="form-settings">
      <label>Required</label>
      <input type="checkbox" ${data.required ? 'checked' : ''} />

      <label>Label</label>
      <input type="text" value="${data.label || ''}" />

      <label>Help Text</label>
      <input type="text" value="${data.helpText || ''}" />

      <label>Display Checkbox Inline</label>
      <input type="checkbox" ${data.inline ? 'checked' : ''} />

      <label>Enable "Other" Option</label>
      <input type="checkbox" ${data.otherOption ? 'checked' : ''} />

      <label>Class</label>
      <input type="text" placeholder="space separated classes" value="${data.className || ''}" />

      <label>Name</label>
      <input type="text" value="${data.name || `checkbox-group-${Date.now()}`}" />

      <label>Access Limit</label>
      <input type="checkbox" ${data.access ? 'checked' : ''} /> Limit access to specific roles

      <label>Options</label>
      <div class="options-wrapper" id="${id}">
        ${optionsHTML}
      </div>
      <button type="button" class="add-option" id="${id}-btn">Add Option +</button>
    </div>
  `;
}
