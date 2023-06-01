import React from "react";
import ReactDOM from 'react-dom';
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { BrowserRouter } from "react-router-dom";
/** 잠재적 문제 파악 도구 _ 활성화/비활성화 **/
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {AuthProvider} from "./pages/login/context/AuthProvider";

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    //<StrictMode>
    <AuthProvider>
        <DarkModeContextProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </DarkModeContextProvider>
    </AuthProvider>
    //</StrictMode>
)