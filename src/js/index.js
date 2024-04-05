import React from "react";
import "./styles/index.scss";
import { createRoot } from 'react-dom/client';
import App from "./App";

createRoot(document.querySelector("#electronapp")).render(<App/>)