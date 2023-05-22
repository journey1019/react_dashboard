import React from "react";
import ReactDOM from 'react-dom';
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { BrowserRouter } from "react-router-dom";
/** 잠재적 문제 파악 도구 _ 활성화/비활성화 **/
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

/*ReactDOM.render(
  <React.StrictMode>
    <DarkModeContextProvider>
        <BrowserRouter>
        <App />
        </BrowserRouter>
    </DarkModeContextProvider>
  </React.StrictMode>,
document.getElementById('root')
);*/
/*root.render(<DarkModeContextProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
</DarkModeContextProvider>);*/


root.render(
    //<StrictMode>
        <DarkModeContextProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </DarkModeContextProvider>
    //</StrictMode>
)