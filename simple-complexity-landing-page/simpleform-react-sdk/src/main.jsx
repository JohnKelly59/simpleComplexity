// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

window.SimpleFormSDK = {
  init: (config = {}) => {
    if (document.getElementById('simpleform-sdk-root')) {
      console.warn('SimpleForm SDK is already initialized.');
      return;
    }

    const rootElement = document.createElement('div');
    rootElement.id = 'simpleform-sdk-root';
    document.body.appendChild(rootElement);

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App config={config} />
      </React.StrictMode>
    );
  },
};