export function setSelect(id, data) {
  let html = '<option></option>'
  data.forEach(item => html += `
    <option value="${item.id}">${item.nombre}</option>`);
  document.querySelector('#'+id).innerHTML = html;
}

export function setErrorBox(form, messages) {
  const errors = form.querySelector('#error_box');
  errors.innerHTML = '';
  if(messages) {
    errors.classList.remove('nodisplay');
    errors.innerHTML = messages;
  } else {
    errors.classList.add('nodisplay');
  }
}