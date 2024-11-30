let fontSize = 16;
const fontSizeDisplay = document.getElementById('font-size-display');
const fontSelector = document.getElementById('font-selector');
const editor = document.getElementById('editor');
let undoStack = [];
let redoStack = [];

document.getElementById('add-text').addEventListener('click', () => {
  const textBox = createTextBox("New Text");
  editor.appendChild(textBox);
});

function createTextBox(content = "Text") {
  const textBox = document.createElement('div');
  textBox.classList.add('text-box');
  textBox.contentEditable = true;
  textBox.textContent = content;
  textBox.style.top = "50px";
  textBox.style.left = "50px";
  textBox.style.fontSize = `${fontSize}px`;
  textBox.style.fontFamily = fontSelector.value;

  enableDragging(textBox);

  textBox.addEventListener('input', () => {
    undoStack.push(editor.innerHTML);
    redoStack = [];
  });

  return textBox;
}

function enableDragging(element) {
  let isDragging = false; 
  let offsetX, offsetY; 

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  function onMouseMove(e) {
    if (!isDragging) return;

    const editorRect = editor.getBoundingClientRect();
    const textRect = element.getBoundingClientRect();

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (newLeft + textRect.width > editorRect.width)
      newLeft = editorRect.width - textRect.width;
    if (newTop + textRect.height > editorRect.height)
      newTop = editorRect.height - textRect.height;

    element.style.left = `${newLeft}px`;
    element.style.top = `${newTop}px`;
  }

  function onMouseUp() {
    isDragging = false; 
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  element.ondragstart = () => false; 
}

document.getElementById('undo').addEventListener('click', () => {
  if (undoStack.length > 0) {
    redoStack.push(editor.innerHTML);
    editor.innerHTML = undoStack.pop();
    attachDraggingToExistingTextBoxes();
  }
});

document.getElementById('redo').addEventListener('click', () => {
  if (redoStack.length > 0) {
    undoStack.push(editor.innerHTML);
    editor.innerHTML = redoStack.pop();
    attachDraggingToExistingTextBoxes();
  }
});

function updateFontSizeDisplay() {
  fontSizeDisplay.textContent = `${fontSize}px`;
}

document.getElementById('increase-font').addEventListener('click', () => {
  if (fontSize < 48) {
    fontSize++;
    updateFontSizeDisplay();
    updateAllTextBoxes();
  }
});

document.getElementById('decrease-font').addEventListener('click', () => {
  if (fontSize > 8) {
    fontSize--;
    updateFontSizeDisplay();
    updateAllTextBoxes();
  }
});

function updateAllTextBoxes() {
  document.querySelectorAll('.text-box').forEach((box) => {
    box.style.fontSize = `${fontSize}px`;
  });
}

document.getElementById('bold').addEventListener('click', () => {
  document.querySelectorAll('.text-box').forEach((box) => {
    box.style.fontWeight = box.style.fontWeight === 'bold' ? 'normal' : 'bold';
  });
});

document.getElementById('italic').addEventListener('click', () => {
  document.querySelectorAll('.text-box').forEach((box) => {
    box.style.fontStyle = box.style.fontStyle === 'italic' ? 'normal' : 'italic';
  });
});

document.getElementById('underline').addEventListener('click', () => {
  document.querySelectorAll('.text-box').forEach((box) => {
    box.style.textDecoration =
      box.style.textDecoration === 'underline' ? 'none' : 'underline';
  });
});

fontSelector.addEventListener('change', () => {
  const selectedFont = fontSelector.value;
  document.querySelectorAll('.text-box').forEach((box) => {
    box.style.fontFamily = selectedFont;
  });
});

function attachDraggingToExistingTextBoxes() {
  document.querySelectorAll('.text-box').forEach(enableDragging);
}
