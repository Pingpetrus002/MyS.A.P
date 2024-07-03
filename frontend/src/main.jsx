import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CustomAdapterDateFns from './utils/CustomAdapterDateFns';
import './index.css';
import "@fontsource/inter";

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <React.StrictMode>
        <LocalizationProvider dateAdapter={CustomAdapterDateFns}>
            <App />
        </LocalizationProvider>
    </React.StrictMode>,
);
