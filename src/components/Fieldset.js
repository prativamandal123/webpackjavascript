// Fieldset.js
export function fieldset(data) {
 const label = data.label || 'Fieldset';
  return `
    <fieldset class="fieldset-block" style="border: 2px solid #ccc; padding: 10px; margin: 10px 0;">
      <legend contenteditable="false">${label}</legend>
      <div class="fieldset-content" data-mode="input" style="min-height: 50px; padding: 5px;">
        <!-- Nested blocks go here -->
      </div>
    </fieldset>
  `;
}

export function fieldsetSettings(data) {
  return `
    <label>Label: <input type="text" value="${data.label || ''}" /></label>
  `;
}
