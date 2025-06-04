// Rendered File Upload Input (shown on the form canvas)
export function UploadFile(data = {}) {
  const name = data.name || `upload-${Date.now()}`;
  const label = data.label || 'Upload File';
  const className = data.className || '';

  return `
    <div class="${className}">
      <label style="font-weight: bold; color: black; display: block; margin-bottom: 5px;">${label}</label>
      <input type="file" name="${name}" class="form-control" />
    </div>
  `;
}

// Extended Settings Panel for File Upload
export function UploadFileSettings(data = {}) {
  return `
    <div class="form-settings">
      <label>Required</label>
      <input type="checkbox" ${data.required ? 'checked' : ''} />

      <label>Label</label>
      <input type="text" value="${data.label || ''}" />

      <label>Help Text</label>
      <input type="text" value="${data.helpText || ''}" />

      <label>Class</label>
      <input type="text" placeholder="space separated classes" value="${data.className || ''}" />

      <label>Name</label>
      <input type="text" value="${data.name || ''}" />

      <label>Access Limit</label>
      <input type="checkbox" ${data.access ? 'checked' : ''} /> Limit access to specific roles
    </div>
  `;
}
