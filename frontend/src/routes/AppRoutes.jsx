import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/authPages/Login.jsx'
import Register from '../pages/authPages/Register.jsx'
import Workspace from '../pages/Workspace.jsx'

const AppRoutes = () => {
  return ( 
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/workspace"
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        }
      />

      {/* Fallback redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
