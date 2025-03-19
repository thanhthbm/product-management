// restore product
const restoreButtons = document.querySelectorAll('[button-restore]');
if (restoreButtons.length > 0){
    const restoreForm = document.querySelector('#form-restore-item');
    const dataPath = restoreForm.getAttribute('data-path');
    restoreButtons.forEach(button => {
        button.addEventListener('click', () => {
            const isConfirm = confirm('Are you sure to restore this product?');
            if (isConfirm){
                const id = button.getAttribute('data-id');
                const path = `${dataPath}/${id}?_method=PATCH`;
                restoreForm.action = path;
                restoreForm.submit();
            }
        });
    });
}