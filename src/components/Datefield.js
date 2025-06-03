// Rendered Date Input UI (shown on the form canvas)
export function DateField(data = {}) {
  const name = data.name || `datefield-${Date.now()}`;
  const label = data.label || 'Date Field';

  return `
    <div class="${data.className || ''}">
      <label style="font-weight: bold; color: black; display: block; margin-bottom: 5px;">${label}</label>
      <input type="date" name="${name}" class="form-control" />
    </div>
  `;
}

// Extended Settings Panel
export function DateFieldSettings(data = {}) {
  return `
    <div class="form-settings">
      <label>Label</label>
      <input type="text" value="${data.label || ''}" />

      <label>Class</label>
      <input type="text" placeholder="space separated classes" value="${data.className || ''}" />

      <label>Name</label>
      <input type="text" value="${data.name || `datefield-${Date.now()}`}" />
    </div>
  `;
}
