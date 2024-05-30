import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { HashRouter, Route, Routes, Link } from "react-router-dom";
import App from './pages/App.jsx';
import Resume from './pages/Resume.jsx';
import './index.css';

import "@fontsource/outfit";
import "@fontsource/roboto";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "resume",
    element: <Resume/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router}  />
  </React.StrictMode>,
);

//   <RouterProvider router={router}  />
