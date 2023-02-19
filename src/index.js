import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import './assets/styles/reset.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Login from './components/login/Login';
import Main from './layout/Main';
import GenerateCode from './components/page/GenerateCode';
import Page404 from './components/page/page404';
import UserManage from './components/page/UserManage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<GenerateCode />} />
        <Route path="/user-manager" element={<UserManage />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </>
);

reportWebVitals();
