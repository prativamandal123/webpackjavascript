// In Autocomplete function, return only input and datalist (no label)
export function Autocomplete(data = {}) {
  const id = `autocomplete-list-${Date.now()}`;
  const options = (data.values || [])
    .map(opt => `<option value="${opt.label}">`)
    .join('');

  return `
    <input type="text" name="${data.name || 'autocomplete'}" placeholder="Start typing..." list="${id}" />
    <datalist id="${id}">
      ${options}
    </datalist>
  `;
}




export function AutocompleteSettings(data = {}) {
  const values = data.values || [];
  const id = `options-${Date.now()}`;

  // Initial options HTML
  const optionsHTML = values.map((v) => `
    <div class="option-item">
      <input type="text" placeholder="Label" value="${v.label}" />
      <input type="text" placeholder="Value" value="${v.value}" />
    </div>
  `).join('');

  // Return HTML with unique wrapper ID
  setTimeout(() => {
    const addBtn = document.querySelector(`#${id}-btn`);
    const wrapper = document.querySelector(`#${id}`);
    if (addBtn && wrapper) {
      addBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'option-item';
        div.innerHTML = `
          <input type="text" placeholder="" />
          <input type="text" placeholder="" />
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

      <label>Placeholder</label>
      <input type="text" value="${data.placeholder || ''}" />

      <label>Class</label>
      <input type="text" value="${data.className || 'form-control'}" />

      <label>Name</label>
      <input type="text" value="${data.name || ''}" />

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


