import React, { useState, useEffect } from "react";

import { VscChromeRestore, VscChromeMinimize, VscClose } from "react-icons/vsc";

import { FaTicketSimple } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { MdFileOpen, MdFormatQuote, MdBrowserUpdated,MdFolderZip } from "react-icons/md";

import ShowPath from "./components/ShowPath";
import ErrorModule from "./components/ErrorModule";
import UpdateModule from "./components/UpdateModule";
const App = () => {
  const [path, setPath] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedPathActive, setSelectedPathActive] = useState(0);
  const [showBtnTxt, setShowBtnTxt] = useState("");
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [openUpdateMenu, setOpenUpdateMenu] = useState(false);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [okDownload, setOkDownload] = useState(false);
  const [checkUpdate, setCheckUpdate] = useState(true);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  window.bridge.updateMessage((event, message) => {
    if (message.includes("Checking for updates")) {
      setShowUpdateBtn(false);
      setOkDownload(false);
      setCheckUpdate(true);
    } else if (message.includes("Update downloaded")) {
      setShowUpdateBtn(true);
      setOkDownload(false);
      setCheckUpdate(false);
    } else if (message.includes("Update available")) {
      setShowUpdateBtn(false);
      setOkDownload(true);
      setCheckUpdate(false);
    } else {
      setShowUpdateBtn(false);
      setOkDownload(false);
      setCheckUpdate(false);
    }
    setMessage(message);
  });

  useEffect(() => {
    window.bridge.trigerMain();
    window.bridge.trigerSelectedFile((event, data) => {
      setPath(data);
    });
    window.bridge.trigerError((event, data) => {
      setErrorMsg(data);
    });
  }, []);
  useEffect(() => {
    if (path) {
      window.bridge.increaseSize(window.innerWidth);
      // ipcRenderer.send("increaseSize",window.innerWidth);
    } else {
      window.bridge.defaultSize(window.innerWidth);
    }
  }, [path]);

  useEffect(() => {
    if (windowSize?.width >= 300) {
      window.bridge.increaseOrDecHeight("inc");
      // ipcRenderer.send("increaseSize",window.innerWidth);
    } else {
      window.bridge.increaseOrDecHeight("desc");
    }
  }, [windowSize?.width]);

  const openLink = () => {
    window.bridge.openLink(
      "https://tables.area120.google.com/authform/aHsK5pQFNINbx-oKgZEO8U/t/8aCNGUdkp0w9VHyt-dXkmSaiLFNm1ldwt5zEb2E-Zk1NbUuCPBJZ2QK1_tycc604kI"
    );
  };

  const loadFile = () => {
    window.bridge.fileOpener();
  };
  const handlePathSelection = (data) => {
    setSelectedPath(data);
  };
  const handleQSSubmit = (fileType) => {
    if (selectedPath) {
      window.bridge.xlsfileOpner(fileType, selectedPath);
    }
  };

  const showText = (type) => {
    setShowBtnTxt(type);
  };

  const restartAppToUpdate = () => {
    setCheckUpdate(true);
    window.bridge.restartApp("restart_app");
  };
  const downLoadUpdate = () => {
    setCheckUpdate(true);
    setShowUpdateBtn(false);
    window.bridge.downLoadUpdate();
  };

  const handleUpdateModule = () => {
    setOpenUpdateMenu(!openUpdateMenu);
  };

  // Function to update window size state
  const updateWindowSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Effect to update window size state when window is resized
  useEffect(() => {
    window.addEventListener("resize", updateWindowSize);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener("resize", updateWindowSize);
    };
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  const handleCloseClick = () => {
    window.bridge.closeWindow();
  };

  const handleMinimizeClick = () => {
    window.bridge.minimize();
  };
  const handleRestoreClick = () => {
    window.bridge.restore();
  };

  const clearPath = () => {
    setPath("");
    window.bridge.defaultSize();
  };
  const makeZip = () => {
    if (selectedPath) {
      window.bridge.makeZip(selectedPath);
    }
  };

  return (
    <div className="main-container">
      <div className="custom-frame">
        <span className="buttonForRestore" onClick={handleRestoreClick}>
          <VscChromeRestore />
        </span>
        <span className="buttonForMinimize" onClick={handleMinimizeClick}>
          <VscChromeMinimize />
        </span>
        <span className="buttonForClose" onClick={handleCloseClick}>
          <VscClose />
        </span>
      </div>
      {openUpdateMenu && (
        <UpdateModule
          restartAppToUpdate={restartAppToUpdate}
          downLoadUpdate={downLoadUpdate}
          showUpdateBtn={showUpdateBtn}
          checkUpdate={checkUpdate}
          okDownload={okDownload}
          updateMsg={message}
          handleUpdateModule={handleUpdateModule}
        />
      )}
      {errorMsg && (
        <ErrorModule errorMsg={errorMsg} setErrorMsg={setErrorMsg} />
      )}
      <h1 className="main-container-header">Steel Pros</h1>
      {path && (
        <div className="showpath-container-clearbtn-cotainer">
          <button className="showpath-container-clearbtn" onClick={clearPath}>
            clear
          </button>
        </div>
      )}
      {/* <button onClick={restartAppToUpdate}>restart</button> */}
      {(path || windowSize.width >= 300) && (
        <ShowPath
          setSelectedPathActive={setSelectedPathActive}
          selectedPathActive={selectedPathActive}
          selectedPath={selectedPath}
          path={path}
          handlePathSelection={handlePathSelection}
        />
      )}
      <div
        className={`btn-lists ${
          path || windowSize.width >= 300 ? "flex-row" : ""
        }`}
      >
        <div className="btn-upper">
          <div
            className="btn-list-container"
            onMouseEnter={() => showText("job")}
            onMouseLeave={() => showText("")}
            onClick={loadFile}
          >
            <div className="btn-list">
              <MdFileOpen className="btn-list-icon" />
            </div>
            {showBtnTxt === "job" && (
              <span className="btn-hover-text">SELECT JOB</span>
            )}
            <span className="btn-list-text">SELECT JOB</span>
          </div>
          <div
            className="btn-list-container"
            onMouseEnter={() => showText("quote")}
            onMouseLeave={() => showText("")}
            onClick={() => handleQSSubmit("xlsfileOpner")}
          >
            <div className="btn-list">
              <MdFormatQuote className="btn-list-icon" />
            </div>
            {showBtnTxt === "quote" && (
              <span className="btn-hover-text">QUOTE</span>
            )}
            <span className="btn-list-text">QUOTE</span>
          </div>
          <div
            className="btn-list-container"
            onClick={() => handleQSSubmit("shipperfileOpner")}
            onMouseEnter={() => showText("shipper")}
            onMouseLeave={() => showText("")}
          >
            <div className="btn-list">
              <MdFormatQuote className="btn-list-icon" />
            </div>
            {showBtnTxt === "shipper" && (
              <span className="btn-hover-text">SHIPPER</span>
            )}
            <span className="btn-list-text">SHIPPER</span>
          </div>
        </div>
        <div className="btn-middle">
          <div
            className="btn-list-container"
            onClick={() => makeZip()}
            onMouseEnter={() => showText("zip")}
            onMouseLeave={() => showText("")}
          >
            <div className="btn-list">
              <MdFolderZip className="btn-list-icon" />
            </div>
            {showBtnTxt === "zip" && (
              <span className="btn-hover-text">MakeZip</span>
            )}
            <span className="btn-list-text">MakeZip</span>
          </div>
          <div
            className="btn-list-container"
            onClick={openLink}
            onMouseEnter={() => showText("ticket")}
            onMouseLeave={() => showText("")}
          >
            <div className="btn-list">
              <FaTicketSimple className="btn-list-icon" />
            </div>
            {showBtnTxt === "ticket" && (
              <span className="btn-hover-text">SUPPORT TICKET</span>
            )}
            <span className="btn-list-text">SUPPORT TICKET</span>
          </div>
          <div
            className="btn-list-container"
            onClick={() => {}}
            onMouseEnter={() => showText("viewupdate")}
            onMouseLeave={() => showText("")}
          >
            <div className="btn-list">
              <FaFileAlt className="btn-list-icon" />
            </div>
            {showBtnTxt === "viewupdate" && (
              <span className="btn-hover-text">VIEW UPDATE LOG</span>
            )}
            <span className="btn-list-text">VIEW UPDATE LOG</span>
          </div>
        </div>
        <div className="btn-lower">
          <div
            className="btn-list-container"
            onClick={handleUpdateModule}
            onMouseEnter={() => showText("updatedropbox")}
            onMouseLeave={() => showText("")}
          >
            <div className="btn-list">
              <MdBrowserUpdated className="btn-list-icon" />
            </div>
            {showBtnTxt === "updatedropbox" && (
              <span className="btn-hover-text">UPDATE</span>
            )}
            <span className="btn-list-text">UPDATE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
