import React from 'react';
import { supabase } from '../utils/supabase';

function AuthButton({ isAuthenticated, setIsAuthenticated }) {
  const createUserProfile = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .insert([{ id: userId }])
        .single();

      if (error && error.code !== '23505') { // Ignora erro de duplicação
        throw error;
      }
    } catch (err) {
      console.error('Error creating user profile:', err);
    }
  };

  const handleLogin = async () => {
    try {
      console.log('Starting GitHub login...');
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

      console.log('Login response:', data);

      // Verificar se o login foi bem-sucedido
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session after login:', session);
      if (session) {
        // Criar perfil de usuário se ainda não existir
        await createUserProfile(session.user.id);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Error during login:', err);
      alert('Error logging in. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      console.log('Starting logout...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
        alert('Error logging out. Please try again.');
        return;
      }
      console.log('Logout successful');
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Error during logout:', err);
      alert('Error logging out. Please try again.');
    }
  };

  console.log('Current auth state:', isAuthenticated);

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
