window.bootstrapShow = (id) => {
    const el = document.querySelector(id);
    const modal = new bootstrap.Modal(el);
    modal.show();
};

window.bootstrapHide = (id) => {
    const el = document.querySelector(id);
    const modal = bootstrap.Modal.getInstance(el);
    modal.hide();
};
