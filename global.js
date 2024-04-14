const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");

class MainScreen {
  window;

  position = {
    width: 120,
    height: 400,
    maximized: false,
  };

  constructor() {
    this.window = new BrowserWindow({
      width: this.position.width,
      height: this.position.height,
      y: 100,
      show: true,
      resizable: true,
      frame: false,

      webPreferences: {
        contextIsolation: true,
        preload: path.join(__dirname, "mainPreload.js"),
      },
    });

    this.window.once("ready-to-show", () => {
      this.window.show();

      if (this.position.maximized) {
        this.window.maximize();
      }
    });

    this.handleMessages();

    this.window.loadFile("index.html");
    this.window.webContents.on("did-finish-load", () => {
      this.window.webContents.insertCSS(`
        html, body {
          -webkit-app-region: drag;
        }
        .showpath-container,.update-message,.btn-list-container,.buttonForClose,.buttonForRestore,.buttonForMinimize,.showpath-container-clearbtn-cotainer{
          -webkit-app-region: no-drag;
        }
      `);
    });
  }
  setDragWindow() {
    this.window.webContents.insertCSS(`
        html, body {
          -webkit-app-region: drag;
        }
      `);
  }
  dragDisable() {
    this.window.webContents.insertCSS(`
    html, body {
      -webkit-app-region: none;
    }
  `);
  }
  showMessage(message) {
    this.window.webContents.send("updateMessage", message);
  }

  close() {
    this.window.close();
    ipcMain.removeAllListeners();
  }
  minimize() {
    this.window.minimize();
  }
  restore() {
    if (this.window.isMaximized()) {
      this.window.restore();
    } else {
      this.window.maximize();
    }
  }
  hide() {
    this.window.hide();
  }

  handleMessages() {
    //Ipc functions go here.
  }
  setTitle(title) {
    this.window.setTitle(title);
  }
  setPosition(x, y) {
    this.window.setPosition(x, y);
  }
  setSize(width, height) {
    this.window.setSize(width, height);
  }
  getSize() {
    return this.window.getSize();
  }
}

module.exports = MainScreen;
