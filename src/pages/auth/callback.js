import { useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Session in callback:', session);
      navigate('/');
    });
  }, [navigate]);

  return <div>Loading...</div>;
}
