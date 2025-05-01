// src/App.jsx
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import Dashboard from './pages/dashboard'
import KanbanPage from './pages/kanbanboard';
import DocumentPage from './pages/editor';

import { AuthProvider, useAuth } from './context/authContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kanban/:teamId"
            element={<ProtectedRoute>
                      <KanbanPage />
                    </ProtectedRoute>}
          />

            <Route
            path="/document"
            element={<ProtectedRoute>
                      <DocumentPage  />
                    </ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
