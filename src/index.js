import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import GetChannel from './components/GetChannels';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import GetMultipleChannels from './components/GetMultipleChannels';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GetChannel />}></Route>
        <Route path="/channel" element={<GetMultipleChannels />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
