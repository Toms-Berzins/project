import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Blog from './components/blog/Blog';
import BlogPost from './components/blog/BlogPost';
import QuoteCalculator from './components/QuoteCalculator';
import PrivacyPolicy from './components/legal/PrivacyPolicy';
import TermsOfService from './components/legal/TermsOfService';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <App.HomePage />
      },
      {
        path: 'quote',
        element: <QuoteCalculator />
      },
      {
        path: 'blog',
        element: <Blog />
      },
      {
        path: 'blog/:slug',
        element: <BlogPost />
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />
      },
      {
        path: 'terms-of-service',
        element: <TermsOfService />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
