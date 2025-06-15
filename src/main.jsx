import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import { HashRouter, Route, Routes, Link } from "react-router-dom";
import App from './pages/App.jsx';
import Resume from './pages/Resume.jsx';
import Lazy from './pages/Lazy.jsx';
import AIchess from './pages/AIchess.jsx';
import Matrix from './pages/Matrix.jsx';
import Crossword from './pages/Crossword.jsx';
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
  {
    path: "lazychess",
    element: <Lazy/>,
  },
  {
    path: "aichess",
    element: <AIchess/>,
  },
  {
    path: "matrix",
    element: <Matrix/>,
  },
  {
    path: "crossword",
    element: <Crossword/>,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router}  />
  </React.StrictMode>,
);

//   <RouterProvider router={router}  />
