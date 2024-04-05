const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");

class MainScreen {
  window;

  position = {
    width: 120,
    height: 350,
    maximized: false,
  };

  constructor() {
    this.window = new BrowserWindow({
      width: this.position.width,
      height: this.position.height,
      y:100,
      title: "This is a test application",
      resizable:false,
     
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

    let wc = this.window.webContents;
    // wc.openDevTools({ mode: "undocked" });

    this.window.loadFile("index.html");
  }

  showMessage(message) {
    console.log(message);

    this.window.webContents.send("updateMessage", message);
  }

  close() {
    this.window.close();
    ipcMain.removeAllListeners();
  }

  hide() {
    this.window.hide();
  }

  handleMessages() {
    //Ipc functions go here.
  }
  setTitle(title){
    this.window.setTitle(title);
  }
  setPosition(x,y){
    this.window.setPosition(x,y);
  }
  setSize(width,height){
  
    this.window.setSize(width,height);
  }
}

module.exports = MainScreen;
