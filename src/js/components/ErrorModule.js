import React from "react";
import { IoMdCloseCircle } from "react-icons/io";
const ErrorModule = ({ errorMsg, setErrorMsg }) => {
  const onErrorMsgOpner = () => {
    setErrorMsg(!errorMsg);
  };
  return (
    <div className="errorModule" onClick={onErrorMsgOpner}>
  
      <div className="error-message">
      <span className="errorModuleCloseBtn" onClick={onErrorMsgOpner}>
        <IoMdCloseCircle />
      </span>
        <p>{errorMsg}</p>
      </div>
    </div>
  );
};

export default ErrorModule;
