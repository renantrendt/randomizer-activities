import React from 'react';
import { supabase } from '../utils/supabase';

function AuthButton({ isAuthenticated, setIsAuthenticated }) {
  const handleLogin = async () => {
    try {
      console.log('Starting GitHub login...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          skipBrowserRedirect: true,
          redirectTo: 'https://randomizer-activities.vercel.app'
        }
      });
      
      if (error) {
        console.error('Error logging in:', error.message);
        alert('Error logging in. Please try again.');
        return;
      }

      // Redirect manually to ensure correct URL
      if (data?.url) {
        window.location.href = data.url;
      }

      console.log('Login response:', data);
    } catch (err) {
      console.error('Error during login:', err);
      alert('Error logging in. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
        alert('Error logging out. Please try again.');
        return;
      }
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Error during logout:', err);
      alert('Error logging out. Please try again.');
    }
  };

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
