import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const db = {
  // Categories
  async getCategories() {
    const user = await supabase.auth.getUser();
    console.log('Current user:', user);
    
    console.log('Fetching categories...');
    const query = supabase
      .from('categories')
      .select('*');

    // Se usuário estiver logado, filtrar por user_id e is_public
    if (user.data?.user) {
      console.log('User is logged in, adding OR conditions');
      query.or([
        { is_public: { eq: true } },
        { user_id: { eq: user.data.user.id } }
      ]);
    } else {
      console.log('User is not logged in, only fetching public items');
      query.eq('is_public', true);
    }
    
    query.order('name');
    
    const { data, error } = await query;
    console.log('Categories query result:', { data, error });
    
    if (error) throw error;

    // Se usuário estiver logado, busca também os itens dele
    let userData = [];
    if (user.data?.user) {
      const { data: userItems, error: userError } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (userError) throw userError;
      userData = userItems;
    }

    // Combina os resultados e ordena
    const allData = [...data, ...userData].sort((a, b) => 
      a.name.localeCompare(b.name)
    );

    return allData;
  },

  async createCategory(name) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        throw userError;
      }

      if (!user) {
        console.error('No user found');
        throw new Error('User not authenticated');
      }

      console.log('Creating category for user:', user.id);
      
      // Primeiro, verificar se o usuário existe na tabela users
      const { data: userData, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (userCheckError) {
        console.error('Error checking user:', userCheckError);
        throw userCheckError;
      }

      // Se o usuário não existir, criar
      if (!userData) {
        console.log('Creating user profile...');
        const { error: createUserError } = await supabase
          .from('users')
          .insert([{ 
            id: user.id,
            email: user.email,
            created_at: new Date().toISOString()
          }]);

        if (createUserError) {
          console.error('Error creating user profile:', createUserError);
          throw createUserError;
        }
        
        // Verificar se o usuário foi criado
        const { data: checkData, error: checkError } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();
          
        if (checkError || !checkData) {
          console.error('User was not created successfully');
          throw new Error('Failed to create user profile');
        }
      }

      // Agora criar a categoria
      console.log('Creating category...');
      const { data, error } = await supabase
        .from('categories')
        .insert([{ 
          name,
          user_id: user.id
        }])
        .select();
      
      if (error) {
        console.error('Error creating category:', error);
        throw error;
      }
      
      console.log('Category created successfully:', data);
      return data[0];
    } catch (err) {
      console.error('Error in createCategory:', err);
      throw err;
    }
  },

  async updateCategory(id, name) {
    try {
      const user = await supabase.auth.getUser();
      
      console.log('Updating category...');
      const { data, error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .filter('is_public', 'eq', true)
        .filter('user_id', 'eq', user.data?.user?.id);
      
      if (error) {
        console.error('Error updating category:', error);
        throw error;
      }
      
      console.log('Category updated successfully:', data);
      return data;
    } catch (err) {
      console.error('Error in updateCategory:', err);
      throw err;
    }
  },

  async deleteCategory(id) {
    try {
      const user = await supabase.auth.getUser();
      
      console.log('Deleting category...');
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .filter('is_public', 'eq', true)
        .filter('user_id', 'eq', user.data?.user?.id);
      
      if (error) {
        console.error('Error deleting category:', error);
        throw error;
      }
      
      console.log('Category deleted successfully');
    } catch (err) {
      console.error('Error in deleteCategory:', err);
      throw err;
    }
  },

  // Activities
  async getActivities() {
    const user = await supabase.auth.getUser();
    console.log('Current user:', user);
    
    console.log('Fetching activities...');
    const query = supabase
      .from('activities')
      .select('*');

    // Se usuário estiver logado, filtrar por user_id e is_public
    if (user.data?.user) {
      console.log('User is logged in, adding OR conditions');
      query.or([
        { is_public: { eq: true } },
        { user_id: { eq: user.data.user.id } }
      ]);
    } else {
      console.log('User is not logged in, only fetching public items');
      query.eq('is_public', true);
    }
    
    query.order('name');
    
    const { data, error } = await query;
    console.log('Activities query result:', { data, error });
    
    if (error) throw error;

    // Se usuário estiver logado, busca também os itens dele
    let userData = [];
    if (user.data?.user) {
      const { data: userItems, error: userError } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.data.user.id);
      
      if (userError) throw userError;
      userData = userItems;
    }

    // Combina os resultados e ordena
    const allData = [...data, ...userData].sort((a, b) => 
      a.name.localeCompare(b.name)
    );

    return allData;
  },

  async createActivity({ name, url, category_id }) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        throw userError;
      }

      if (!user) {
        console.error('No user found');
        throw new Error('User not authenticated');
      }

      console.log('Creating activity for user:', user.id);
      
      // Primeiro, verificar se o usuário existe na tabela users
      const { data: userData, error: userCheckError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (userCheckError) {
        console.error('Error checking user:', userCheckError);
        throw userCheckError;
      }

      if (!userData) {
        console.log('Creating user profile...');
        const { error: createUserError } = await supabase
          .from('users')
          .insert([{ id: user.id }]);

        if (createUserError && createUserError.code !== '23505') {
          console.error('Error creating user profile:', createUserError);
          throw createUserError;
        }
      }

      // Agora criar a atividade
      console.log('Creating activity...');
      const { data, error } = await supabase
        .from('activities')
        .insert([{ 
          name,
          url,
          category_id,
          user_id: user.id
        }])
        .select();
      
      if (error) {
        console.error('Error creating activity:', error);
        throw error;
      }
      
      console.log('Activity created successfully:', data);
      return data[0]; // Retorna o primeiro item do array
    } catch (err) {
      console.error('Error in createActivity:', err);
      throw err;
    }
  },

  async updateActivity({ id, name, url }) {
    try {
      const user = await supabase.auth.getUser();
      
      console.log('Updating activity...');
      const { data, error } = await supabase
        .from('activities')
        .update({ 
          name: name || '', 
          url: url || '' 
        })
        .eq('id', id)
        .or([
          { is_public: { eq: true } },
          { user_id: { eq: user.data?.user?.id } }
        ]);
      
      if (error) {
        console.error('Error updating activity:', error);
        throw error;
      }
      
      console.log('Activity updated successfully:', data);
      return data;
    } catch (err) {
      console.error('Error in updateActivity:', err);
      throw err;
    }
  },

  async deleteActivity(id) {
    try {
      const user = await supabase.auth.getUser();
      
      console.log('Deleting activity...');
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id)
        .or([
          { is_public: { eq: true } },
          { user_id: { eq: user.data?.user?.id } }
        ]);
      
      if (error) {
        console.error('Error deleting activity:', error);
        throw error;
      }
      
      console.log('Activity deleted successfully');
    } catch (err) {
      console.error('Error in deleteActivity:', err);
      throw err;
    }
  }
};
