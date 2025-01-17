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
      
      let query = supabase
        .from('categories')
        .select(`
          *,
          hidden_categories!inner (
            category_id
          )
        `);

      if (user.data?.user) {
        // Se o usuário está logado, mostra:
        // 1. Categorias públicas que não estão escondidas
        // 2. Categorias do próprio usuário
        query = query
          .or(`is_public.eq.true,user_id.eq.${user.data.user.id}`)
          .is('hidden_categories.category_id', null);
      } else {
        // Se não está logado, mostra apenas categorias públicas
        query = query
          .eq('is_public', true)
          .is('hidden_categories.category_id', null);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      return data || [];
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
      
      if (!user.data?.user) {
        throw new Error('User not authenticated');
      }

      console.log('Updating category...');
      const { data, error } = await supabase
        .from('categories')
        .update({ 
          name,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.data.user.id)
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
      
      if (!user.data?.user) {
        throw new Error('User not authenticated');
      }

      // Primeiro verifica se a categoria é do usuário
      const { data: category } = await supabase
        .from('categories')
        .select('user_id, is_public')
        .eq('id', id)
        .single();

      if (!category) {
        throw new Error('Category not found');
      }

      console.log('Deleting category...');
      
      if (category.user_id === user.data.user.id) {
        // Se a categoria é do usuário, deleta ela
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id)
          .eq('user_id', user.data.user.id);
          
        if (error) {
          console.error('Error deleting category:', error);
          throw error;
        }
      } else if (category.is_public) {
        // Se a categoria é pública, apenas esconde ela para o usuário
        const { error } = await supabase
          .from('hidden_categories')
          .insert({ 
            category_id: id, 
            user_id: user.data.user.id 
          });
          
        if (error) {
          console.error('Error hiding category:', error);
          throw error;
        }
      } else {
        throw new Error('Cannot delete this category');
      }
      
      console.log('Category handled successfully');
    } catch (err) {
      console.error('Error in deleteCategory:', err);
      throw err;
    }
  },

  // Activities
  async getActivities() {
    try {
      const user = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      console.log('Fetching activities...');
      let query = supabase
        .from('activities')
        .select();

      // Se não há usuário, busca apenas públicos
      if (!user.data?.user) {
        query = query.eq('is_public', true);
      } else {
        // Se há usuário, busca públicos ou do usuário
        query = query.or(`is_public.eq.true,user_id.eq.${user.data.user.id}`);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }

      console.log('Activities fetched successfully:', data);
      return data || [];
    } catch (error) {
      console.error('Error in getActivities:', error);
      throw error;
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
      
      if (!user.data?.user) {
        throw new Error('User not authenticated');
      }
      
      console.log('Updating activity...');
      const { data, error } = await supabase
        .from('activities')
        .update({ 
          name: name || '', 
          url: url || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.data.user.id)
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
