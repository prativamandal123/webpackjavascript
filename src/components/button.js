export function Button(data = {}) {
  const {
    label = 'Button',
    type = 'button',
    className = 'btn-default btn',
    name = `button-${Date.now()}`,
    value = '',
    access = true
  } = data;

  // Disabled attribute when access is false
  const disabledAttr = access ? '' : 'disabled';

  return `
    <button 
      type="${type}" 
      class="${className}" 
      name="${name}" 
      value="${value}" 
      ${disabledAttr}
    >
      ${label}
    </button>
  `;
}

export function ButtonSettings(data = {}) {
  return `
    <div class="form-settings">
      <label>Label</label>
      <input type="text" value="${data.label || 'Button'}" />

      <label>Type</label>
      <select>
        <option value="button" ${data.type === 'button' ? 'selected' : ''}>Button</option>
        <option value="submit" ${data.type === 'submit' ? 'selected' : ''}>Submit</option>
        <option value="reset" ${data.type === 'reset' ? 'selected' : ''}>Reset</option>
      </select>

      <label>Class</label>
      <input type="text" value="${data.className || 'btn-default btn'}" />

      <label>Name</label>
      <input type="text" value="${data.name || ''}" />

      <label>Value</label>
      <input type="text" value="${data.value || ''}" />

      <label>Access</label>
      <input type="checkbox" ${data.access !== false ? 'checked' : ''} /> Enable
    </div>
  `;
}
