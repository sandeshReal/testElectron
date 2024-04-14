const { contextBridge, ipcRenderer,shell ,remote } = require("electron");

let bridge = {
    updateMessage: (callback) => {console.log("hashah");return ipcRenderer.on("updateMessage",callback)},
    trigerMain:()=>ipcRenderer.send("onLoad"),
    trigerSelectedFile:(callback)=>ipcRenderer.on("selected-file",callback),
    restartApp:()=>ipcRenderer.send("restart_app"),
    increaseSize:(width)=>ipcRenderer.send("increaseSize",width),
    defaultSize:(width)=>ipcRenderer.send("defaultSize",width),
    fileOpener:()=>ipcRenderer.send("fileOpener"),
    
    openLink:(url)=>ipcRenderer.send("openLink",url),
    xlsfileOpner:(fileType,selectedPath)=>ipcRenderer.send(fileType,selectedPath),
    trigerError:(callback)=> ipcRenderer.on("errorXls",callback),
    downLoadUpdate:()=>ipcRenderer.send('downLoadUpdate'),
    increaseOrDecHeight:(type)=>ipcRenderer.send('increaseOrDecHeight',type),
    dragEnable:()=>ipcRenderer.send("dragEnable"),
    dragDisable:()=>ipcRenderer.send('dragDisable'),
    minimize:()=>ipcRenderer.send('minimize'),
    closeWindow:()=>ipcRenderer.send('closeWindow'),
    restore:()=>ipcRenderer.send('restore'),
    makeZip:(link)=>ipcRenderer.send('makeZip',link)


  };  
  
  contextBridge.exposeInMainWorld("bridge", bridge);
  