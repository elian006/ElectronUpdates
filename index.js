const { app, BrowserWindow, ipcMain, autoUpdater } = require('electron');



const log = require('electron-log');
const path = require('path');


// Configurar el log para la actualización automática
log.transports.file.level = 'info';
autoUpdater.logger = log;

// Configurar la URL del servidor de actualización (puedes usar GitHub Releases u otro servidor)
autoUpdater.setFeedURL({
  url: 'https://github.com/elian006/ElectronUpdates/releases',
});
// Escuchar eventos de actualización
autoUpdater.on('checking-for-update', () => {
  console.log('Verificando actualizaciones...');
});


  autoUpdater.on('update-available', (info) => {
    console.log('Actualización disponible:', info);
  
    // Muestra una alerta al usuario
    const { dialog } = require('electron');
  
    const options = {
      type: 'info',
      buttons: ['Actualizar ahora', 'Más tarde'],
      defaultId: 0,
      title: 'Nueva versión disponible',
      message: 'Hay una nueva versión disponible. ¿Quieres actualizar ahora?',
    };
  
    dialog.showMessageBox(null, options, (response) => {
      if (response === 0) {
        // El usuario eligió actualizar ahora
        autoUpdater.downloadUpdate();
      }
    });
});

autoUpdater.on('update-not-available', () => {
  console.log('No hay actualizaciones disponibles.');

});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Actualización descargada:', info);
   // Muestra una alerta al usuario
   const { dialog } = require('electron');

   const options = {
     type: 'info',
     buttons: ['Reiniciar ahora', 'Más tarde'],
     defaultId: 0,
     title: 'Actualización descargada',
     message: 'La actualización se ha descargado. ¿Quieres reiniciar ahora para aplicar la actualización?',
   };

   dialog.showMessageBox(null, options, (response) => {
     if (response === 0) {
       // El usuario eligió reiniciar ahora
       autoUpdater.quitAndInstall();
     }
   });
  mainWindow.webContents.send('update-downloaded', info);

});

autoUpdater.on('error', (err) => {
  console.error('Error en la actualización:', err.message);
});

// Verificar actualizaciones automáticamente en intervalos regulares
setInterval(() => {
  autoUpdater.checkForUpdates();
}, 1000 * 60); // Verificar cada hora

// Iniciar la aplicación
app.on('ready', () => {
  // ...configuración de la ventana y otros códigos iniciales...
  autoUpdater.checkForUpdates(); // Verificar actualizaciones al iniciar la aplicación
});



const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
  createWindow()
  autoUpdater.checkForUpdates();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })