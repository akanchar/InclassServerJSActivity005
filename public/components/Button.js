function createButton(id, text, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

window.createButton = createButton;