export function Header(data = {}) {
  const level = data.type || 'h2'; 
  const label = data.label || 'Header';

  return `
    <div class="${data.className || ''}">
      <${level} style="color: black; font-weight: bold; margin-bottom: 10px;">${label}</${level}>
    </div>
  `;
}

export function HeaderSettings(data = {}) {
  return `
    <div class="form-settings">
      <label>Label</label>
      <input type="text" value="${data.label || ''}" />

      <label>Header Level</label>
      <select>
        <option value="h1" ${data.headerType === 'h1' ? 'selected' : ''}>h1</option>
        <option value="h2" ${!data.headerType || data.headerType === 'h2' ? 'selected' : ''}>h2</option>
        <option value="h3" ${data.headerType === 'h3' ? 'selected' : ''}>h3</option>
        <option value="h4" ${data.headerType === 'h4' ? 'selected' : ''}>h4</option>
        <option value="h5" ${data.headerType === 'h5' ? 'selected' : ''}>h5</option>
        <option value="h6" ${data.headerType === 'h6' ? 'selected' : ''}>h6</option>
      </select>

      <label>Class</label>
      <input type="text" placeholder="space separated classes" value="${data.className || ''}" />

      <label>Access</label>
      <input type="checkbox" ${data.access ? 'checked' : ''} /> Limit access to one or more of the following roles:
    </div>
  `;
}


