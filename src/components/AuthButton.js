import React from 'react';
import { supabase } from '../utils/supabase';

function AuthButton({ isAuthenticated, setIsAuthenticated }) {
  const handleLogin = async () => {
    try {
      console.log('Starting GitHub login...'); // Debug
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('Error logging in:', error.message);
        alert('Error logging in. Please try again.');
        return;
      }

      console.log('Login response:', data); // Debug

      // Verificar se o login foi bem-sucedido
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session after login:', session); // Debug
      if (session) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error during login:', err);
      alert('Error logging in. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Starting logout...'); // Debug
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
        alert('Error logging out. Please try again.');
        return;
      }
      console.log('Logout successful'); // Debug
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Error during logout:', err);
      alert('Error logging out. Please try again.');
    }
  };

  console.log('Current auth state:', isAuthenticated); // Debug

  return (
    <button
      onClick={isAuthenticated ? handleLogout : handleLogin}
      className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
    >
      {isAuthenticated ? 'Logout' : 'Login with GitHub'}
    </button>
  );
}

export default AuthButton;
