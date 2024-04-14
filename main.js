const path = require("path");
const globalPath = path.join(__dirname, "global.js");
const MainScreen = require(globalPath);
const JSZip = require("jszip");
const fs=require("fs");

const {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  screen,
  shell,
  Menu,
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

  // const emptyMenu = Menu.buildFromTemplate([]);
  // Menu.setApplicationMenu(emptyMenu);
};

// if (dev) {
//   require("electron-reload")(__dirname, {
//     electron: path.join(__dirname, "node_modules", ".bin", "electron"),
//   });
// }

app.whenReady().then(() => {
  createWindow();
});
ipcMain.on("dragEnable", (event) => {
  mainWindow.setDragWindow();
});
ipcMain.on("dragDisable", (event) => {
  mainWindow.dragDisable();
});

ipcMain.on("onLoad", (event) => {
  autoUpdater.checkForUpdates();
  mainWindow.showMessage(`Checking for updates-${app.getVersion()}`);
});

/* New Update Available */
/*New Update Available*/
autoUpdater.on("update-available", (info) => {
  mainWindow.showMessage(`Update available-${app.getVersion()}`);
  // let pth = autoUpdater.downloadUpdate();
  // mainWindow.showMessage(pth);
});
ipcMain.on("downLoadUpdate", () => {
  autoUpdater.downloadUpdate();
});
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
ipcMain.on("restart_app", () => {
  autoUpdater.quitAndInstall();
});
ipcMain.on("openLink", (event, url) => {
  shell.openExternal(url, "_blank");
});

// // Event to handle window size when maximize
ipcMain.on("increaseSize", (event, innerWidth) => {
  const { bounds } = screen.getPrimaryDisplay();
  // Move the window to the right side of the screen

  const win = BrowserWindow.getFocusedWindow();

  const position = win.getPosition();

  mainWindow.setSize(500, 600);
  // mainWindow.setTitle("Steel Pros");
  if (bounds.width - 500 <= position[0]) {
    mainWindow.setPosition(bounds.width - 500, 100);
  } else {
    mainWindow.setPosition(position[0], 100);
  }
});

// // Event to handle window default size for minimize
ipcMain.on("defaultSize", (event, innerWidth) => {
  event.sender.send("getMessage", app.getVersion());
  const { bounds } = screen.getPrimaryDisplay();
  // mainWindow.setTitle("");
  if (process.platform !== "darwin") {
    mainWindow.setPosition(bounds.width - 180, 100);
  } else {
    mainWindow.setPosition(bounds.width - 180, 100);
  }
  mainWindow.setSize(180, 400);
});

ipcMain.on("increaseOrDecHeight", (event, type) => {
  if (type === "inc") {
    mainWindow.setSize(mainWindow.getSize()[0], 600);
  } else {
    mainWindow.setSize(mainWindow.getSize()[0], 400);
  }
});

ipcMain.on("closeWindow", (event, type) => {
  mainWindow.close();
});
ipcMain.on("minimize", (event, type) => {
  mainWindow.minimize();
});
ipcMain.on("restore", (event, type) => {
  mainWindow.restore();
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
          let str = result.filePaths[0];
          if (!result.filePaths[0].includes(".INI")) {
            str = `${result.filePaths[0]}/MBS.ini`;
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

ipcMain.on("xlsfileOpner", async (event, link) => {
 
  readXlsxFile(`${link}/quote.xlsx`, {
    encoding: "utf-8",
  })
    .then((text) => {
      
      shell.openPath(`${link}/quote.xlsx`);
      // event.sender.send("selected-file", config.JOBLIST);
    })
    .catch((error) => {
      readXlsxFile(`${link}/quote.xls`, {
        encoding: "utf-8",
      })
        .then((text) => {
          // const config = parse(text);
          shell.openPath(`${link}/quote.xls`);
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
ipcMain.on("shipperfileOpner", (event, link) => {
  readXlsxFile(`${link}/Xshipper.xlsx`, {
    encoding: "utf-8",
  })
    .then((text) => {
      // const config = parse(text);
      shell.openPath(`${link}/Xshipper.xlsx`);
      // event.sender.send("selected-file", config.JOBLIST);
    })
    .catch((error) => {
      readXlsxFile(`${link}/Xshipper.xls`, {
        encoding: "utf-8",
      })
        .then((text) => {
          // const config = parse(text);
          shell.openPath(`${link}/Xshipper.xls`);
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

//this codes help to create zip
ipcMain.on("makeZip", (event, link) => {
  const directoryPath = link; // Replace with your directory path
  var zip = new JSZip();
  let tempArray = [];
  let fileWithdxf = [];
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      event.sender.send("errorXls", "No DXF FOUND IN SELECTED JOB.");
      return;
    }
    if (files.length === 0) {
      event.sender.send("errorXls", "No DXF FOUND IN SELECTED JOB.");
      return;
    }
    files.forEach((file) => {
      if (file.endsWith(".dxf")) {
        fileWithdxf.push(file);
      }
    });
    fileWithdxf.forEach((itm, index) => {
      const filePath = path.join(directoryPath, itm);

      fs.readFile(filePath, function (err, data) {
        if (err) {
          console.error("Error reading file:", err);
          return;
        }
        const fileName = path.basename(filePath);
        zip.file(fileName, data);
        if (fileWithdxf.length === index + 1) {
          zip
            .generateAsync({ type: "nodebuffer" }) // Generate buffer instead of blob
            .then(function (content) {
              console.log(content);
              dialog
                .showSaveDialog({
                  title: "Save your file",
                  defaultPath:
                    "C:\\Users\\sharm\\OneDrive\\Desktop\\TGEST\\dxf.zip",
                  buttonLabel: "Save",
                  filters: [{ name: "ZIP Archives", extensions: ["zip"] }],
                })
                .then((result) => {
                  console.log(result);
                  if (!result.canceled) {
                    const savePath = result.filePath;
                    fs.writeFileSync(savePath, content); // Now content is a buffer
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            });
        }
      });
    });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
