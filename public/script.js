const socket = io();

const editor = document.getElementById('editor');
const textSize = document.getElementById('textSize');
const textColor = document.getElementById('textColor');
const alertContainer = document.getElementById('alert-container');

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

// Handle new user connection
socket.on('user connected', () => {
  showAlert('info', 'New User Joined', 'A new user has joined the server!');
});

// Handle user disconnection
socket.on('user disconnected', () => {
  showAlert('warning', 'User Left', 'A user has left the server!');
});

// Function to show alerts
function showAlert(type, strongText, message) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.role = 'alert';
  alert.innerHTML = `
    <strong>${strongText}</strong> ${message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  `;
  alertContainer.appendChild(alert);

  // Automatically dismiss the alert after 10 seconds
  setTimeout(() => {
    $(alert).alert('close');
  }, 10000);
}
