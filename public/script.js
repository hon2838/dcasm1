const socket = io();

const editor = document.getElementById('editor');
const textSize = document.getElementById('textSize');
const textColor = document.getElementById('textColor');

// Load the initial document content and styles
socket.on('load document', (data) => {
  editor.value = data.content;
  editor.style.fontSize = data.styles.fontSize;
  editor.style.color = data.styles.color;
  textSize.value = data.styles.fontSize;
  textColor.value = data.styles.color;
});

// Handle text changes from other clients
socket.on('text change', (content) => {
  editor.value = content;
});

// Handle style changes from other clients
socket.on('style change', (styles) => {
  editor.style.fontSize = styles.fontSize;
  editor.style.color = styles.color;
  textSize.value = styles.fontSize;
  textColor.value = styles.color;
});

// Notify server of text changes
editor.addEventListener('input', () => {
  socket.emit('text change', editor.value);
});

// Notify server of text size changes
textSize.addEventListener('change', () => {
  const styles = {
    fontSize: textSize.value,
    color: textColor.value
  };
  editor.style.fontSize = styles.fontSize;
  socket.emit('style change', styles);
});

// Notify server of text color changes
textColor.addEventListener('change', () => {
  const styles = {
    fontSize: textSize.value,
    color: textColor.value
  };
  editor.style.color = styles.color;
  socket.emit('style change', styles);
});

