import { useEffect } from 'react';
import { supabase } from '../../utils/supabase';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        navigate('/');
        return;
      }

      if (session?.user) {
        // Verificar se o usuário já existe no banco
        const { data: existingUser } = await supabase
          .from('users')
          .select()
          .eq('id', session.user.id)
          .single();

        // Se não existir, criar novo perfil
        if (!existingUser) {
          const { error: profileError } = await supabase
            .from('users')
            .insert([
              {
                id: session.user.id,
                email: session.user.email,
                username: session.user.user_metadata.user_name || session.user.email,
                avatar_url: session.user.user_metadata.avatar_url,
                created_at: new Date().toISOString(),
              }
            ]);

          if (profileError) {
            console.error('Error creating user profile:', profileError);
          }
        }
      }

      navigate('/');
    };

    handleCallback();
  }, [navigate]);

  return <div>Loading...</div>;
}
