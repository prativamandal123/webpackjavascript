export function Autocomplete(data = {}) {
  const id = `autocomplete-list-${Date.now()}`;
  const options = (data.values || [])
    .map(opt => `<option value="${opt.label}">`)
    .join('');

  return `
    <div class="${data.className || ''}">
      ${data.label ? `<label><strong>${data.label}</strong></label>` : ''}
      <input type="text" name="${data.name || 'autocomplete'}" placeholder="${data.placeholder || ''}" list="${id}" />
      <datalist id="${id}">
        ${options}
      </datalist>
    </div>
  `;
}


export function AutocompleteSettings(data = {}) {
  const values = data.values || [];
  const id = `options-${Date.now()}`;

  // Initial options HTML with delete buttons
  const optionsHTML = values.map((v) => `
    <div class="option-item">
      <input type="text" placeholder="Label" value="${v.label}" />
      <input type="text" placeholder="Value" value="${v.value}" />
      <button type="button" class="delete-option" title="Remove">❌</button>
    </div>
  `).join('');

  setTimeout(() => {
    const addBtn = document.querySelector(`#${id}-btn`);
    const wrapper = document.querySelector(`#${id}`);

    if (addBtn && wrapper) {
      // Add new option
      addBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerHTML = `
          <input type="text" placeholder="Label" />
          <input type="text" placeholder="Value" />
          <button type="button" class="delete-option" title="Remove">❌</button>
        `;
        wrapper.appendChild(div);
      });

      // Use event delegation to handle delete clicks
      wrapper.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-option')) {
          const parent = e.target.closest('.option-item');
          if (parent) parent.remove();
        }
      });
    }
  }, 0);

  return `
    <div class="form-settings">
      <div class="form-row">
        <label>Required</label>
        <input type="checkbox" class="checkbox-input" ${data.required ? 'checked' : ''} />
      </div>

      <div class="form-row">
        <label>Label</label>
        <input type="text" value="${data.label || ''}" />
      </div>

      <div class="form-row">
        <label>Help Text</label>
        <input type="text" value="${data.helpText || ''}" />
      </div>

      <div class="form-row">
        <label>Placeholder</label>
        <input type="text" value="${data.placeholder || ''}" />
      </div>

      <div class="form-row">
        <label>Class</label>
        <input type="text" value="${data.className || 'form-control'}" />
      </div>

      <div class="form-row">
        <label>Name</label>
        <input type="text" value="${data.name || ''}" />
      </div>

      <div class="form-row">
        <label>Access</label>
        <input type="checkbox" class="checkbox-input" ${data.access ? 'checked' : ''} />
      </div>

      <div class="form-row">
        <label></label>
        <h4>Limit access to specific roles</h4>
      </div>

      <div class="form-row">
        <label>Options</label>
        <div class="options-wrapper" id="${id}">
          ${optionsHTML}
        </div>
      </div>

      <div class="form-row">
        <label></label>
        <button type="button" class="add-option" id="${id}-btn">Add Option +</button>
      </div>
    </div>
  `;
}



