import React from "react";
import { IoMdCloseCircle } from "react-icons/io";
import Loading from "./Loading";
const UpdateModule = ({restartAppToUpdate,checkUpdate,downLoadUpdate,showUpdateBtn, updateMsg, okDownload,handleUpdateModule }) => {
      
  const [msg,version]=updateMsg.split('-');
  const onUpdateMsgOpner = () => {
 
    handleUpdateModule();
  };
  return (
    <div className="updateModule">
    
      <div className="update-message">
      <span className="updateModuleCloseBtn" onClick={onUpdateMsgOpner}>
        <IoMdCloseCircle />
      </span>
        <p className="update-message-body">{msg}</p>
        {okDownload && <button className="download-upload-btn" onClick={downLoadUpdate}>Download Upload</button>}
        {showUpdateBtn && <button className="download-upload-btn" onClick={restartAppToUpdate}>Install Download</button>}
        {checkUpdate && <Loading/>}
        <p className="upsate-version">Current Version: <span>{version}</span></p>
      </div>
    </div>
  );
};

export default UpdateModule;
