const path = require("path");

const globalPath=path.join(__dirname,'global.js');
console.log(globalPath);
const MainScreen = require(globalPath);

const {
  app,
BrowserWindow,
  ipcMain,
  dialog,
  screen,
  shell,
  Menu 
} = require("electron");
const { autoUpdater } = require("electron-updater");
const readXlsxFile = require("read-excel-file/node");
autoUpdater.autoDownload = false;

const os = require("os");
const { writeFile, readFile } = require("fs/promises"); // Change node:fs/promises to fs/promises
const { stringify, parse } = require("ini");
const dev = !app.isPackaged;
let mainWindow;

const createWindow = () => {
  mainWindow = new MainScreen();

  const emptyMenu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(emptyMenu);
  // dev && mainWindow.webContents.openDevTools();
};

if (dev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

app.whenReady().then(() => {
  createWindow();
  
  
  
});


ipcMain.on("onLoad", (event) => {
  autoUpdater.checkForUpdates();
  mainWindow.showMessage(`Checking for updates-${app.getVersion()}`);});

/* New Update Available */
/*New Update Available*/
autoUpdater.on("update-available", (info) => {
  mainWindow.showMessage(`Update available-${app.getVersion()}`);
  // let pth = autoUpdater.downloadUpdate();
  // mainWindow.showMessage(pth);
});
ipcMain.on("downLoadUpdate",()=>{
  autoUpdater.downloadUpdate();
})
autoUpdater.on("update-not-available", (info) => {
  mainWindow.showMessage(`No update available-${app.getVersion()}`);
});

/*Download Completion Message*/
autoUpdater.on("update-downloaded", (info) => {
  mainWindow.showMessage(`Update downloaded-${app.getVersion()}`);
});

autoUpdater.on("error", (info) => {
  mainWindow.showMessage(info);
});
ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});




// // Event to handle window size when maximize
ipcMain.on("increaseSize", (event, innerWidth) => {
  const {bounds} = screen.getPrimaryDisplay();
  
  // Move the window to the right side of the screen


  const win = BrowserWindow.getFocusedWindow();

  const position = win.getPosition();

  mainWindow.setSize(500, 600);
  // mainWindow.setTitle("Steel Pros");
  if (bounds.width-500<=position[0]) {
    mainWindow.setPosition(bounds.width  - 500, 100);
  } else {
    mainWindow.setPosition(position[0], 100);
  }
});

// // Event to handle window default size for minimize
ipcMain.on("defaultSize", (event, innerWidth) => {
  event.sender.send("getMessage",app.getVersion())
  const { bounds } = screen.getPrimaryDisplay();
  // mainWindow.setTitle("");
  if (process.platform !== 'darwin') {
    mainWindow.setPosition(bounds.width-180,100)
  }
  else{
    mainWindow.setPosition(bounds.width-180,100)
  }
  mainWindow.setSize(180,  350);
});
//event to handle file opner for linux darwin or ios and window 
ipcMain.on("fileOpener", (event) => {
  if (os.platform() === "linux" || os.platform() === "win32") {
    dialog
      .showOpenDialog({
        properties: ["openFile"],
      })
      .then((result) => {
        if (!result.canceled) {
          readFile(result.filePaths[0], {
            encoding: "utf-8",
          }).then((text) => {
            const config = parse(text);

            event.sender.send("selected-file", config.JOBLIST);
          });
        }
      });
  } else {
    dialog
      .showOpenDialog({
        properties: ["openFile", "openDirectory"],
      })
      .then((result) => {
        
        if (!result.canceled) {
          let str=result.filePaths[0]
          if(!result.filePaths[0].includes('.INI')){
            str=`${result.filePaths[0]}/MBS.ini`
          }
          readFile(`${str}`, {
            encoding: "utf-8",
          }).then((text) => {
            const config = parse(text);

            event.sender.send("selected-file", config.JOBLIST);
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

ipcMain.on("xlsfileOpner", async (event, path) => {

  readXlsxFile(`${path}/QUOTE.xlsx`, {
    encoding: "utf-8",
  })
    .then((text) => {
      shell.openPath(`${path}/QUOTE.xlsx`)
      // event.sender.send("selected-file", config.JOBLIST);
    })
    .catch((error) => {
      readXlsxFile(`${path}/QUOTE.xls`, {
        encoding: "utf-8",
      })
        .then((text) => {
          // const config = parse(text);
          shell.openPath(`${path}/QUOTE.xls`)
          // event.sender.send("selected-file", config.JOBLIST);
        })
        .catch((error) => {
          event.sender.send(
            "errorXls",
            "File QUOTE.XLS NOT FOUND IN SELECTED JOB."
          );
        });
    });
});
ipcMain.on("shipperfileOpner", (event, path) => {
  readXlsxFile(`${path}/XSHIPPER.xlsx`, {
    encoding: "utf-8",
  })
    .then((text) => {
      // const config = parse(text);
      shell.openPath(`${path}/XSHIPPER.xlsx`)
      // event.sender.send("selected-file", config.JOBLIST);
    })
    .catch((error) => {
      readXlsxFile(`${path}/XSHIPPER.xls`, {
        encoding: "utf-8",
      })
        .then((text) => {
          // const config = parse(text);
          shell.openPath(`${path}/XSHIPPER.xls`)
          // event.sender.send("selected-file", config.JOBLIST);
        })
        .catch((error) => {
          event.sender.send(
            "errorXls",
            "File XSHIPPER.XLS NOT FOUND IN SELECTED JOB."
          );
        });
    });
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});