const information = document.getElementById('info')
information.innerText = `Esta aplicación está usando Chrome (v${versions.chrome()}), 
Node.js (v${versions.node()}), 
and Electron (v${versions.electron()})`


const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // prints out 'pong'
  }
  
  func()

  const { ipcRenderer } = require('electron');

// Escuchar el evento desde el proceso principal
ipcRenderer.on('update-not-available', (event, info) => {
  // Mostrar una alerta en tu ventana HTML
  alert(`La actualización se ha descargado. Reinicia la aplicación para aplicar la actualización.`);
});