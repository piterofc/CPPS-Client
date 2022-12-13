const {app, BrowserWindow, dialog, Menu, MenuItem, ipcMain, Tray} = require('electron');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const DiscordRPC = require('discord-rpc');
const fs = require('fs');
//const config = require("./config.json"); //define config
const config = require("./config.js"); //define config
const path = require('path');

var updateAvailable = false;

let pluginName
/*
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
*/
switch (process.platform) {
  case 'win32':
    switch (process.arch) {
      case 'ia32':
        pluginName = 'flash/pepflashplayer32_32_0_0_303.dll';
        break;
      case 'x32':
        pluginName = 'flash/pepflashplayer32_32_0_0_303.dll';
        break;
      case 'x64':
        pluginName = 'flash/pepflashplayer64_32_0_0_303.dll';
        break;
    }
    break;
  case 'darwin':
    pluginName = 'flash/PepperFlashPlayer.plugin';
    break;
  case 'linux':
    app.commandLine.appendSwitch('no-sandbox');
    pluginName = 'flash/libpepflashplayer.so';
    break;
};

app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginName));

autoUpdater.checkForUpdatesAndNotify();
//autoUpdater.setFeedURL(`https://github.com/piterofc/CPPS-Client`);
//autoUpdater.checkForUpdates();
let mainWindow;
let fsmenu;
var asker;

function askURL() {
  //Check if window is already open
  if (asker) {
    asker.focus();
    asker.center();
    return;
  }

// https://github.com/electron/electron/pull/4156

  asker = new BrowserWindow({
    title: "CPPS URL",
    //frame: false,
    webPreferences: {
      nodeIntegration: true
    },
    width: 440,
    height: 210,
    //useContentSize : true,
    //autoHideMenuBar : true,
    resizable: false,
    maximizable: false,
    movable: false,
    minimizable: false,
    //closable: true,
  });

  asker.setMenu(null);
  asker.setMenuBarVisibility(false);
  //asker.loadFile('pages/goToURL.html');
  asker.loadURL('https://cpclient.noodlespicante.site/goToURL');
/*
  asker.setResizable(false);
  asker.setMaximizable(false);
  asker.setMovable(false);
  asker.setMinimizable(false);
  //asker.setClosable(true);
*/
  asker.center();

/*
  asker.on('will-resize', (e) => {
    //ao invés de usar "setResizable(false)"...
        e.preventDefault();
    });
*/

  asker.on('closed', () => {
    asker = null;
  });
}

// INÍCIO - TEMPLATE DO MENU
let template = [
  {
    label: 'Início',
    accelerator: 'Ctrl+I',
    click: () => {
      clearCache;
      //mainWindow.loadFile('pages/index.html');
      mainWindow.loadURL('https://cpclient.noodlespicante.site');
      clearCache;
      }
  },
  {
    label: '|',
    //type: 'separator'
  },
  {
    label: 'CPPSs',
    submenu: [
    ]
  },
  {
    label: 'Link para CPPS',
    click: () => {
      askURL();
    }
  },
  {
    label: 'Lista de CPPS',
    click: () => {
      clearCache;
      mainWindow.loadURL('https://cppsworld.fandom.com/wiki/Private_Server_List');
      clearCache;
    }
  },
  {
    label: '|',
    //type: 'separator'
  },
  {
    label: 'Sobre',
    click: () => { 
      dialog.showMessageBox({
        type: "info",
        buttons: ["Ok"],
        title: "Sobre o Desktop Client",
        message: "CPPS Client\nDesenvolvido por Piter com base no projeto do Club Penguin Brasil\n\nApoio: Noodles Picante - www.noodlespicante.site\nDiscord server: discord.gg/P9dhMJQ"
      });
    }
  },
  {
    label: 'Atalhos',
    click: () => { 
      dialog.showMessageBox({
        type: "info",
        buttons: ["Entendi"],
        title: "Atalhos do cliente desktop",
        message: "Atalhos do Desktop Client\n\nAtalhos normais:\nCtrl+I = Início\nCtrl+M = (Des)Mutar Áudio\nF11 = Tela cheia\n\nZooms:\nAmpliar = Ctrl+=\nNormalizar = Ctrl+0\nReduzir = Ctrl+-\n\nF5 = Recarregar\nCtrl+R = Reiniciar cliente\nCtrl+W = Fechar cliente"
      });
    }
  },
  {
    label: '(Des)Mutar Áudio',
    accelerator: 'Ctrl+M',
    click: () => { 
      let ambool = (mainWindow.webContents.audioMuted ? false : true);
      mainWindow.webContents.audioMuted = ambool;
    }
  },
  {
    label: '|',
    //type: 'separator'
  },
  {
    label: 'Recarregar página',
    accelerator: 'F5',
    click: () => {
      clearCache;
      mainWindow.reload();
      clearCache;
    }
  },
  {
    label: 'Reiniciar',
    accelerator: 'Ctrl+R',
    click: () => {
      clearCache;
      dialog.showMessageBox({
        type: "info",
        //buttons: ["Ok"],
        title: "AVISO!",
        message: "Reiniciando cliente... Favor aguardar!"
      });
      setTimeout(function() {
        app.relaunch();
        app.quit();
      }, 1000);
      clearCache;
    }
  },
  {
    label: 'Fechar',
    accelerator: 'Ctrl+W',
    click: () => {
	    clearCache;
      mainWindow.close();
	    clearCache;
    }
  },
  {
    label: '|',
    //type: 'separator'
  },
  {
    label: 'Tela Cheia',
    accelerator: 'F11',
    click: () => { 
      let fsbool = (mainWindow.isFullScreen() ? false : true);
      mainWindow.setFullScreen(fsbool);
    }
  },
  {
    label: 'Zooms',
    submenu: [
      {
        label: 'Zoom + (130%)',
        accelerator: 'Ctrl+=',
        click: () => { 
          //mainWindow.webContents.setZoomFactor(1.3); // ORIGINAL = 1.3
          mainWindow.webContents.setZoomFactor(config.zoom.mais);
        }
      },
      {
        label: 'Normal (100%)',
        accelerator: 'Ctrl+0',
        click: () => { 
          mainWindow.webContents.setZoomFactor(1.0); // ORIGINAL = 1.0
        }
      },
      {
        label: 'Zoom - (70%)',
        accelerator: 'Ctrl+-',
        click: () => { 
          //mainWindow.webContents.setZoomFactor(0.7); // ORIGINAL = 0.7
          mainWindow.webContents.setZoomFactor(config.zoom.menos);
        }
      },
    ]
  },
];

let CPPSs = config.CPPSs;

CPPSs.forEach(cpps => {
  //template[2].submenu.push({
  template.find(i => i.label == "CPPSs").submenu.push({
    label: `${cpps.nome}`,
    click: () => {
    clearCache;
      mainWindow.loadURL(`${cpps.url}`);
    clearCache
    }
  });
});

let Zooms = [
  1.5,
  2.0,
  2.5,
  3.0,
  3.5,
  4.0,
  4.5,
  5.0 //MÁXIMO
]

if (config.modos.youtuber == true) {
  // AGORA COMEÇA OS ZOOMS EXAGERADOS PARA BOA QUALIDADE DE GRAVAÇÃO DE VÍDEO - Noodles Picante

  Zooms.forEach(zoom => {
    //template[12].submenu.push({
    template.find(i => i.label == "Zooms").submenu.push({
      label: `${zoom*100}%`,
      click: () => {
        mainWindow.webContents.setZoomFactor(zoom);
      }
    });
  });

};

if (config.modos.dev == true) {
  template.push(
    {
      label: '|',
      //type: 'separator'
    },
    {
      label: 'Dev Tools',
      accelerator: 'Ctrl+Shift+I',
      click: () => { 
        mainWindow.webContents.openDevTools();
        //mainWindow.webContents.openDevTools({ mode: 'detach' });
      }
    }
  );
};
// FIM - TEMPLATE DO MENU

function makeMenu() {
  fsmenu = Menu.buildFromTemplate(template)
}

function clearCache() {
  if (mainWindow && mainWindow !== null) {mainWindow?.webContents.session.clearCache();}
}

//Taskbar:
// https://www.electronjs.org/pt/docs/latest/tutorial/windows-taskbar

// Tray:
// https://patrickpassarella.com/blog/how-to-position-electron-tray
// https://www.electronjs.org/pt/docs/latest/api/tray - DOCS

let trayContextMenu = Menu.buildFromTemplate([
  {
    label: 'Reiniciar',
    click: () => {
      clearCache;
      dialog.showMessageBox({
        type: "info",
        //buttons: ["Ok"],
        title: "AVISO!",
        message: "Reiniciando cliente... Favor aguardar!"
      });
      setTimeout(function() {
        app.relaunch();
        app.quit();
      }, 1000);
      clearCache;
    }
  },
  {
    label: 'Fechar',
    click: () => {
      clearCache;
      mainWindow.close();
      clearCache;
    }
  },
]);

// Criar ícone na tray
const createTray = () => {
  tray = new Tray(path.join(__dirname, 'icon.png'));
  tray.on('click', () => {
    toggleWindow();
  });
  tray.setToolTip('CPPS Client (base: CP Brasil)');
  tray.setTitle(`CPPS Client (base: CP Brasil)`);
  //tray.setTitle(`Opções rápidas - CPPS Client`);
  tray.setContextMenu(trayContextMenu);
};

// Mostrar/ocultar janela
const toggleWindow = () => {
  if (mainWindow.isVisible()) return mainWindow.hide();
  return mainWindow.show();
};

// Início - tela carregando
function createWindow () {

  let splashWindow = new BrowserWindow({
    width: 600,
    height: 320,
    frame: false,
    transparent: true,
    show: false
  });

  splashWindow.setMenu(null);
  splashWindow.setResizable(false);
  //splashWindow.loadFile('pages/images/Carregando.png');
  //splashWindow.loadFile('pages/carregando.html');
  splashWindow.loadURL('https://cpclient.noodlespicante.site/carregando');
  splashWindow.on('closed', () => (splashWindow = null));
  splashWindow.webContents.on('did-finish-load', () => {
    splashWindow.show();
  });

  mainWindow = new BrowserWindow({
	  useContentSize: false,
	  show: false,
    width: 960,
    height: 540,
	  //title: 'Carregando...',
    //icon: __dirname + '/favicon.ico',
    webPreferences: {
      //preload: path.join(__dirname, 'preload.js'),
      plugins: true
    }
  });

  mainWindow.setResizable(true);

  mainWindow.webContents.on('did-finish-load', () => {
    if (splashWindow) {
      splashWindow.close();
    }
    //mainWindow.minimize(); // CHEGA DE ENCHER A
    //mainWindow.maximize(); // PACIÊNCIA, CANSEI
    mainWindow.show();
  });

// Fim - tela carregando

  new Promise(
	resolve => setTimeout(function() {
	  makeMenu();
    mainWindow.setMenu(null); // Remove o menu original da janela
	  //Menu.setApplicationMenu(fsmenu); // Seta o menu do cliente inteiro para o personalizado
    Menu.setApplicationMenu(null); // Remove o menu original do cliente inteiro
    mainWindow.setMenu(fsmenu); // Seta o menu da janela para o personalizado
	  clearCache();
	  //mainWindow.loadURL(`${config.home}`); //IGNORAR
	  //mainWindow.loadFile('pages/index.html');
	  mainWindow.loadURL('https://cpclient.noodlespicante.site');
    title: "",
    createTray();
    //mainWindow.maximize();

// MODO AUTOMÁTICO DE TELA CHEIA - ATIVAR MODO YOUTUBER
// TRUE = ATIVADO | FALSE = DESATIVADO

    // CASO QUEIRA CAPTURAR O JOGO (SEM ELE FICAR CONGELANDO), ATIVE O MODO YOUTUBER NAS CONFIGS!
    // OBS: o modo YouTuber ativa o modo tela cheia no cliente.
    // Para alternar de janela, use "Alt+Tab", "Win" ou o botão no menu do cliente.

    if (config.modos.youtuber == true) {
      mainWindow.setFullScreen(true);
    }

	  //mainWindow.webContents.on('will-navigate', handleRedirect);
	  //mainWindow.webContents.on('new-window', handleRedirect);

	  resolve();
	}, 5000)
  );

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

};

ipcMain.on('cppsURL', (event, url) => {
  if (mainWindow === null) {
    createWindow();
  }
  mainWindow.loadURL(url);
  asker.close();
  asker = null;
});

var gotTheLock = null;

if (config.modos.dev == false) {
  gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    app.quit();
  }

};

/*
if (!gotTheLock) {
  //app.quit();
} else {
*/

  // Múltiplas instâncias para modo dev
  if (config.modos.dev == false) {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      dialog.showMessageBox({
        type: "info",
        //buttons: ["Ok"],
        title: "AVISO!",
        message: "Você não pode executar mais de 1 instância do cliente! \n\nPor enquanto esse recurso está sendo testado, mas se você quiser ter acesso a ele, ative o modo dev. \n\nTenha em mente que se utilizado, poderá haver bugs no cliente durante a execução de múltiplas instâncias!"
      });
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      };
    });
  };

	app.on('ready', function () {
	  createWindow();
    //createTray();
	  setTimeout(function() {
		  dialog.showMessageBox({
				type: "info",
				buttons: ["Ok"],
				title: "Aviso de desenvolvedor!",
				message: "Esse cliente desktop foi originalmente criado pelo Club Penguin Brasil, e foi modificado para ter suporte a outros CPPSs (de sua escolha). Caso ocorra algum bug, reinicie o cliente, e caso não resolva, entre em contato com o Piter pelo servidor Discord da Noodles Picante!\n\nApoio: Noodles Picante - www.noodlespicante.site"
			  });
	  }, 1000);
	});

// Docs/forums interessantes:
// https://moinism.medium.com/how-to-keep-an-electron-app-running-in-the-background-f6a7c0e1ee4f
// https://www.electronjs.org/docs/latest/api/app

	app.setAsDefaultProtocolClient('cpps');

// Agora vem o auto updater
var updateVers;

if (config.auto_update == true) {

  autoUpdater.on('update-available', (updateInfo) => {
    switch (process.platform) {
      case 'win32':
          dialog.showMessageBox({
            type: "info",
            buttons: ["Ok"],
            title: "Atualização disponível",
            message: `Há uma nova versão disponível para o cliente (v${updateInfo.version})! \nEla será instalada quando o cliente fechar.`
          });
          break;
      case 'darwin':
          dialog.showMessageBox({
            type: "info",
            buttons: ["Ok"],
            title: "Atualização disponível",
            message: `Há uma nova versão disponível para o cliente (v${updateInfo.version})! \nPor favor, instale a nova versão manualmente no repositório.`
          });
          break;
      case 'linux':
          dialog.showMessageBox({
            type: "info",
            buttons: ["Ok"],
            title: "Atualização disponível",
            message: `Há uma nova versão disponível para o cliente (v${updateInfo.version})! \nO sistema de atualização automática não foi testada neste sistema operacional, então se você receber este aviso da próxima vez que abrir o cliente, instale a nova versão manualmente no repositório.`
          });
          break;
    }
      mainWindow.webContents.send('update_available', updateInfo.version);
  });

  autoUpdater.on('update-downloaded', (updateInfo) => {
      updateAvailable = true;
      updateVers = updateInfo.version;
  });

}
// Fim do auto updater

	app.on('window-all-closed', function () {
    // Quando o cliente for fechado, auto-atualiza e fecha se ativado e se houver atualização disponível
    if (config.auto_update == true) {

      if (updateAvailable) {
        dialog.showMessageBox({
          type: "info",
          buttons: ["Ok"],
          title: "Atualização do cliente",
          message: `Instalando a nova versão (${updateVers}) do cliente...`
        });

        setTimeout(function() {
          tray.destroy();
          autoUpdater.quitAndInstall();
        }, 2000);

      } else if (process.platform !== 'darwin') {
        tray.destroy();
        app.quit();
      };

    } else { // E se não tiver ativado, só ignora e fecha o cliente
      if (process.platform !== 'darwin') {
        tray.destroy();
        app.quit();
      };
    };
	});

	app.on('activate', function () {
	  //if (mainWindow === null) createWindow();
	  if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});

	/*
	app.on('active', function() {
	  if(BrowserWindow.getAllWindows().length === 0) createWindow();
	});
	*/

//};

setInterval(clearCache, 1000*60*2); //Limpar o cache de 2 em 2 minutos