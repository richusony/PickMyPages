import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Home from './pages/Home.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import PageNotFound from './pages/PageNotFound.jsx';
import { UserContextProvider } from './context/userContext.jsx';
import MyPdfs from './pages/MyPdfs.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/signin",
    element: <SignIn />
  },
  {
    path: "/signup",
    element: <SignUp />
  },
  {
    path: "/my-pdfs",
    element: <MyPdfs />
  },
  {
    path: "/page-not-found",
    element: <PageNotFound />
  },
  {
    path: "*",
    element: <PageNotFound />
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  </StrictMode>
)
