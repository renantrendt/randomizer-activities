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
      console.log('Current user:', user);
      
      console.log('Fetching categories...');
      let query = supabase
        .from('categories')
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
        console.error('Error fetching categories:', error);
        return [];
      }

      console.log('Categories fetched successfully:', data);
      return data || [];
    } catch (error) {
      console.error('Error in getCategories:', error);
      throw error;
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

  async hideCategory(categoryId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Verificar se a categoria existe e é pública
      const { data: category } = await supabase
        .from('categories')
        .select('is_public')
        .eq('id', categoryId)
        .single();

      if (!category?.is_public) {
        throw new Error('Category not found or is not public');
      }

      // Adicionar à tabela hidden_categories
      const { error } = await supabase
        .from('hidden_categories')
        .insert([{
          user_id: user.id,
          category_id: categoryId
        }]);

      if (error) {
        console.error('Error hiding category:', error);
        throw error;
      }
    } catch (err) {
      console.error('Error in hideCategory:', err);
      throw err;
    }
  },

  async unhideCategory(categoryId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Remover da tabela hidden_categories
      const { error } = await supabase
        .from('hidden_categories')
        .delete()
        .match({ user_id: user.id, category_id: categoryId });

      if (error) {
        console.error('Error unhiding category:', error);
        throw error;
      }
    } catch (err) {
      console.error('Error in unhideCategory:', err);
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
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Verificar se a categoria existe e se o usuário tem permissão
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', category_id)
        .single();

      if (categoryError) {
        console.error('Error checking category:', categoryError);
        throw categoryError;
      }

      if (!category) {
        throw new Error('Category not found');
      }

      if (!category.is_public && category.user_id !== user.id) {
        throw new Error('You do not have permission to add activities to this category');
      }

      // Criar a atividade
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
      return data[0];
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
