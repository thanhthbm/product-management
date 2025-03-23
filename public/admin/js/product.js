//change status
const buttonsChangeStatus = document.querySelectorAll('[button-change-status]');
if (buttonsChangeStatus.length > 0){
    const formChangeStatus = document.querySelector('#form-change-status');
    const path = formChangeStatus.getAttribute('data-path');
    buttonsChangeStatus.forEach((button) => {
       button.addEventListener('click', () => {
          const statusCurrent = button.getAttribute('data-status');
          const id = button.getAttribute('data-id');
          const statusChange = statusCurrent === 'active' ? 'inactive' : 'active';
          const action = path + `/${statusChange}/${id}?_method=PATCH`;
          formChangeStatus.action = action;
          formChangeStatus.submit();
       });
    });
}

// delete product
const buttonsDelete = document.querySelectorAll('[button-delete]');
if (buttonsDelete.length > 0){
    const form = document.querySelector('#form-delete-item');
    const path = form.getAttribute('data-path');
    buttonsDelete.forEach(button => {
       button.addEventListener('click', () => {
          const isConfirm = confirm('Are you sure to delete this product?');

          if (isConfirm){
              const id = button.getAttribute('data-id');

              const action = `${path}/${id}?_method=DELETE`;
              form.action = action;
              form.submit();
          }
       });
    });
}

