import React, { Children } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignInPage from './auth/sign-in/index.jsx';
import Home from './home'
import Dashboard from './dashboard'
import { ClerkProvider } from '@clerk/clerk-react'
import EditResume from './dashboard/resume/[resumeId]/edit'
import ViewResume from './my-resume/[resumeId]/view'
import RequireAuth from './auth/RequireAuth'
import { ThemeProvider } from './components/theme-provider'
import InterviewPage from './interview'
import InterviewDashboard from './interviews'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
// 1. Give path="/" to the parent route that uses <App />
// 2. Use an index route for <Home />
// 3. Child route for /dashboard, /dashboard/resume/:id/edit, etc.

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "dashboard",
        element: (
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        ),
      },
      {
        path: "dashboard/resume/:resumeId/edit",
        element: (
          <RequireAuth>
            <EditResume />
          </RequireAuth>
        ),
      },
      {
        path: "interviews",
        element: (
          <RequireAuth>
            <InterviewDashboard />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/auth/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/my-resume/:resumeId/view",
    element: <ViewResume />,
  },
  {
    path: "/my-resume/:resumeId/interview",
    element: (
      <RequireAuth>
        <InterviewPage />
      </RequireAuth>
    ),
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={router}/>
      </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>,
)
