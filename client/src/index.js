import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/reset.css'; // Ant Design CSS
import './index.css';         // Custom CSS if needed
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
