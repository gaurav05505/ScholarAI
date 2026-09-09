import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import PageTransition from '../components/PageTransition.jsx'
import Home from '../pages/Home.jsx'
import About from '../pages/About.jsx'
import Login from '../pages/authPages/Login.jsx'
import Register from '../pages/authPages/Register.jsx'
import Workspace from '../pages/Workspace.jsx'

const AppRoutes = () => {
  return ( 
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PageTransition><Home /></PageTransition>} />
      <Route path="/about" element={<PageTransition><About /></PageTransition>} />
      <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
      <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

      {/* Protected Routes */}
      <Route
        path="/workspace"
        element={
          <ProtectedRoute>
            <PageTransition>
              <Workspace />
            </PageTransition>
          </ProtectedRoute>
        }
      />

      {/* Fallback redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>

    
  )
}

export default AppRoutes
