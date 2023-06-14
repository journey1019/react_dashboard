import React from "react";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <DarkModeContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </DarkModeContextProvider>
)