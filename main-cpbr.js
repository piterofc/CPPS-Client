const {app, BrowserWindow, dialog, Menu, MenuItem} = require('electron');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const config = require("./config.json"); //define config
const path = require('path');

let pluginName
switch (process.platform) {
  case 'win32':
    pluginName = 'flash/pepflashplayer32_32_0_0_303.dll'
    break
  case 'darwin':
    pluginName = 'flash/PepperFlashPlayer.plugin'
    break
  case 'linux':
    pluginName = 'flash/libpepflashplayer.so'
    break
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));

let mainWindow;
let fsmenu;

function makeMenu() {
  fsmenu = new Menu();

//Home
  fsmenu.append(new MenuItem({
    label: 'Início',
	accelerator: 'Ctrl+I',
    click: () => {
	  clearCache;
      mainWindow.loadURL('file://' + __dirname + '/pages/main-page.html');
	  clearCache;
    }
  }));

// Jogos
  fsmenu.append(new MenuItem({
    label: 'CPPS 1',
    click: () => {
	  clearCache;
      mainWindow.loadURL(`${config.cpps1}`);
	  clearCache
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'CPPS 2',
    click: () => {
	  clearCache;
      mainWindow.loadURL(`${config.cpps2}`);
	  clearCache
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'CPPS 3',
    click: () => {
	  clearCache;
      mainWindow.loadURL(`${config.cpps3}`);
	  clearCache
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'CPPS 4',
    click: () => {
	  clearCache;
      mainWindow.loadURL(`${config.cpps4}`);
	  clearCache
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'CPPS 5',
    click: () => {
	  clearCache;
      mainWindow.loadURL(`${config.cpps5}`);
	  clearCache
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'CPPS 6',
    click: () => {
	  clearCache;
      mainWindow.loadURL(`${config.cpps6}`);
	  clearCache
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'CPPS 7',
    click: () => {
	  clearCache;
      mainWindow.loadURL(`${config.cpps7}`);
	  clearCache
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'CPPS 8',
    click: () => {
	  clearCache;
      mainWindow.loadURL(`${config.cpps8}`);
	  clearCache
    }
  }));

// Demais funções
  fsmenu.append(new MenuItem({
    label: 'Sobre',
    click: () => { 
      dialog.showMessageBox({
        type: "info",
        buttons: ["Ok"],
        title: "Sobre o Desktop Client",
        message: "CP Client\nDesenvolvido por Piter com base no projeto do Club Penguin Brasil\n\nApoio: Noodles Picante - www.noodlespicante.site\nDiscord server: discord.gg/P9dhMJQ"
      });
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'Atalhos',
    click: () => { 
      dialog.showMessageBox({
        type: "info",
        buttons: ["Entendi"],
        title: "Atalhos do cliente desktop",
        message: "Atalhos do Desktop Client\n\nAtalhos normais:\nInício = Ctrl+I\nF11 = Tela cheia\nCtrl+M = (Des)Mutar Áudio\nF5 = Recarregar\n\nZooms:\nAmpliar = Ctrl++\nReduzir = Ctrl+-"
      });
    }
  }));
    fsmenu.append(new MenuItem({
    label: 'Tela Cheia',
    accelerator: 'F11',
    click: () => { 
      let fsbool = (mainWindow.isFullScreen() ? false : true);
      mainWindow.setFullScreen(fsbool);
    }
  }));
  fsmenu.append(new MenuItem({
    label: '(Des)Mutar Áudio',
	accelerator: 'Ctrl+M',
    click: () => { 
      let ambool = (mainWindow.webContents.audioMuted ? false : true);
      mainWindow.webContents.audioMuted = ambool;
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'Recarregar',
	accelerator: 'F5',
    click: () => {
	  clearCache;
      mainWindow.reload();
	  clearCache;
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'Fechar',
    click: () => {
	  clearCache;
      mainWindow.close();
	  clearCache;
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'Zoom +',
	accelerator: 'Ctrl++',
    click: () => { 
	//let zoomp = (mainWindow.webContents.setZoomFactor ? 1.0 : 1.5);
	  mainWindow.webContents.setZoomFactor(1.3);
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'Normal',
	accelerator: 'Ctrl+0',
    click: () => { 
	//let zoomm = (mainWindow.webContents.setZoomFactor ? 1.0 : 0.5);
	  mainWindow.webContents.setZoomFactor(1.0);
    }
  }));
  fsmenu.append(new MenuItem({
    label: 'Zoom -',
	accelerator: 'Ctrl+-',
    click: () => { 
	//let zoomm = (mainWindow.webContents.setZoomFactor ? 1.0 : 0.5);
	  mainWindow.webContents.setZoomFactor(0.7);
    }
  }));
}

function clearCache() {
  if (mainWindow !== null) {mainWindow.webContents.session.clearCache();}
}

function createWindow () {
  mainWindow = new BrowserWindow({
	//show: false,
    width: 1280,
    height: 720,
	title: 'Carregando...',
    icon: __dirname + '/favicon.ico',
    webPreferences: {
      //preload: path.join(__dirname, 'preload.js'),
      plugins: true,
	  sandbox: true
    }
  });
  mainWindow.maximize();

/*
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
*/

  mainWindow.setMenu(null);
  clearCache();
  //mainWindow.loadURL(`${config.home}`);
  mainWindow.loadURL('file://' + __dirname + '/pages/main-page.html');

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', function () {
  createWindow();
  makeMenu();
  Menu.setApplicationMenu(fsmenu);
  dialog.showMessageBox({
        type: "info",
        buttons: ["Ok"],
        title: "Aviso de desenvolvedor!",
        message: "Esse cliente desktop foi originalmente criado pelo Club Penguin Brasil, e foi modificado para ter suporte a outros CPPSs (de sua escolha). Caso ocorra algum bug, reinicie o cliente!\n\nApoio: Noodles Picante - www.noodlespicante.site"
      });
});

app.setAsDefaultProtocolClient('cpclient');

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});


setInterval(clearCache, 1000*60*2); //Limpar o cache de 2 em 2 minutos