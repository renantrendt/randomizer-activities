import React from 'react';
import { supabase } from '../utils/supabase';

function AuthButton({ isAuthenticated, setIsAuthenticated }) {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
    });
    if (error) console.error('Error logging in:', error.message);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
    setIsAuthenticated(false);
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
