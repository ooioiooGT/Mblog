import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BlogList } from './components/BlogList';
import { BlogPost } from './components/BlogPost';
import { AdminPanel } from './components/AdminPanel';
import { About } from './components/About';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<BlogList />} />
              <Route path="/post/:id" element={<BlogPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          <footer className="bg-white border-t border-gray-200 mt-20 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
              <p>© {new Date().getFullYear()} Gilber's Blog. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;