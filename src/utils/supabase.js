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
    try {
      const user = await supabase.auth.getUser();
      
      console.log('Fetching categories...');
      const query = supabase
        .from('categories')
        .select('*')
        .order('name');

      // Se usuário estiver logado, filtrar por user_id
      if (user.data?.user) {
        query.or(`user_id.is.null,user_id.eq.${user.data.user.id}`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }
      
      console.log('Categories fetched successfully:', data);
      return data;
    } catch (err) {
      console.error('Error in getCategories:', err);
      throw err;
    }
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
        .or(`user_id.is.null,user_id.eq.${user.data?.user?.id}`)
        .select()
        .single();
      
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
        .or(`user_id.is.null,user_id.eq.${user.data?.user?.id}`);
      
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
    try {
      const user = await supabase.auth.getUser();
      
      console.log('Fetching activities...');
      const query = supabase
        .from('activities')
        .select('*')
        .order('name');

      // Se usuário estiver logado, filtrar por user_id
      if (user.data?.user) {
        query.or(`user_id.is.null,user_id.eq.${user.data.user.id}`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }
      
      console.log('Activities fetched successfully:', data);
      return data;
    } catch (err) {
      console.error('Error in getActivities:', err);
      throw err;
    }
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
          name, 
          url: url || '' 
        })
        .eq('id', id)
        .or(`user_id.is.null,user_id.eq.${user.data?.user?.id}`)
        .select()
        .single();
      
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
        .or(`user_id.is.null,user_id.eq.${user.data?.user?.id}`);
      
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
