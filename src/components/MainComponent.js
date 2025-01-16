import React, { useState, useEffect } from 'react';
import { db, supabase } from '../utils/supabase';
import CategoryList from './CategoryList';
import ActivityList from './ActivityList';
import AuthButton from './AuthButton';

function MainComponent() {
  const [activeTab, setActiveTab] = useState("categories");
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [randomCategory, setRandomCategory] = useState(null);
  const [lastRandomCategory, setLastRandomCategory] = useState(null);
  const [randomActivity, setRandomActivity] = useState(null);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editingActivityText, setEditingActivityText] = useState({
    name: "",
    url: "",
  });
  const [newActivity, setNewActivity] = useState({
    name: "",
    url: "",
  });
  const [categories, setCategories] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check initial auth state
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session);
        
        if (session?.user) {
          console.log('User is authenticated:', session.user);
          // Criar perfil de usuário se ainda não existir
          try {
            const { error } = await supabase
              .from('users')
              .insert([{ id: session.user.id }])
              .single();

            if (error && error.code !== '23505') { // Ignora erro de duplicação
              console.error('Error creating user profile:', error);
            }
          } catch (err) {
            console.error('Error creating user profile:', err);
          }
          
          setIsAuthenticated(true);
        } else {
          console.log('No session found');
          setIsAuthenticated(false);
        }

        // Setup auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
          console.log('Auth state changed:', { event: _event, session });
          if (session?.user) {
            console.log('User is now authenticated:', session.user);
            // Criar perfil de usuário se ainda não existir
            try {
              const { error } = await supabase
                .from('users')
                .insert([{ id: session.user.id }])
                .single();

              if (error && error.code !== '23505') { // Ignora erro de duplicação
                console.error('Error creating user profile:', error);
              }
            } catch (err) {
              console.error('Error creating user profile:', err);
            }
            
            setIsAuthenticated(true);
          } else {
            console.log('User is now unauthenticated');
            setIsAuthenticated(false);
          }
        });

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('Error checking auth state:', err);
      }
    };
    
    checkAuth();
  }, []);

  // Load initial data when component mounts or auth state changes
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Loading initial data...");
        const categoriesData = await db.getCategories();
        const activitiesData = await db.getActivities();
        console.log("Loaded categories:", categoriesData);
        console.log("Loaded activities:", activitiesData);
        setCategories(categoriesData);
        setActivities(activitiesData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated]);

  const createCategory = async (data) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Creating category:", data);
      const newCategory = await db.createCategory(data.name);
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      return newCategory;
    } catch (err) {
      console.error("Error creating category:", err);
      setError("Failed to create category. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (data) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Updating category:", data);
      const updatedCategory = await db.updateCategory(data.id, data.name);
      const updatedCategories = categories.map((cat) =>
        cat.id === data.id ? updatedCategory : cat
      );
      console.log("Category updated");
      setCategories(updatedCategories);
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (data) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Deleting category:", data);
      await db.deleteCategory(data.id);
      const updatedCategories = categories.filter((cat) => cat.id !== data.id);
      const updatedActivities = activities.filter(
        (act) => act.category_id !== data.id
      );
      console.log("Category and related activities deleted");
      setCategories(updatedCategories);
      setActivities(updatedActivities);
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (data) => {
    setLoading(true);
    setError(null);
    try {
      if (!data.category_id) {
        throw new Error('Category ID is required');
      }
      
      const activityData = {
        name: data.name,
        url: data.url,
        category_id: data.category_id
      };
      
      console.log("Creating activity:", activityData);
      const newActivity = await db.createActivity(activityData);
      const updatedActivities = [...activities, newActivity];
      console.log("Activity created:", newActivity);
      setActivities(updatedActivities);
      return newActivity;
    } catch (err) {
      console.error("Error creating activity:", err);
      setError("Failed to create activity. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (data) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Updating activity:", data);
      const updatedActivity = await db.updateActivity({
        id: data.id,
        name: data.name,
        url: data.url
      });
      const updatedActivities = activities.map((act) =>
        act.id === data.id ? updatedActivity : act
      );
      console.log("Activity updated");
      setActivities(updatedActivities);
    } catch (err) {
      console.error("Error updating activity:", err);
      setError("Failed to update activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (data) => {
    setLoading(true);
    setError(null);
    try {
      console.log("Deleting activity:", data);
      await db.deleteActivity(data.id);
      const updatedActivities = activities.filter((act) => act.id !== data.id);
      console.log("Activity deleted");
      setActivities(updatedActivities);
    } catch (err) {
      console.error("Error deleting activity:", err);
      setError("Failed to delete activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category);
    setEditingText(category.name);
  };

  const saveEdit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (editingText.trim()) {
      try {
        const updatedCategory = await db.updateCategory(editingCategory.id, editingText.trim());
        
        // Atualiza o estado local das categorias
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? updatedCategory : cat
        ));
        
        setEditingCategory(null);
      } catch (error) {
        console.error('Error updating category:', error);
        setError('Failed to update category. Please try again.');
      }
    }
  };

  const handleEditKeyPress = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    }
  };

  const handleCategoryKeyPress = (e) => {
    if (e.key === "Enter" && newCategory.trim()) {
      addCategory();
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log("Creating category:", { name: newCategory });
      const createdCategory = await db.createCategory(newCategory);
      console.log("Category created:", createdCategory);
      
      if (createdCategory) {
        setCategories([...categories, createdCategory]);
        setNewCategory("");
      }
    } catch (err) {
      console.error("Error creating category:", err);
      let errorMessage = "Failed to create category. ";
      
      if (err.message === "User not authenticated") {
        errorMessage += "Please make sure you are logged in.";
      } else if (err.code === "23503") {
        errorMessage += "Please try logging out and logging in again.";
      } else {
        errorMessage += "Please try again.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryToDelete) => {
    await deleteCategory({ id: categoryToDelete.id });
  };

  const handleActivityKeyPress = (e) => {
    if (e.key === "Enter") {
      if (newActivity.name.trim() && selectedCategory) {
        addActivity();
      }
    }
  };

  const handleActivityEditKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previne o comportamento padrão do Enter
      saveActivityEdit();
    }
  };

  const addActivity = async () => {
    if (!selectedCategory) {
      setError("Please select a category first");
      return;
    }
    
    if (newActivity.name.trim()) {
      try {
        const activityData = {
          name: newActivity.name.trim(),
          url: newActivity.url ? newActivity.url.trim() : "",
          category_id: selectedCategory.id
        };
        
        console.log('Adding activity:', activityData);
        
        const result = await createActivity(activityData);
        
        if (result) {
          setNewActivity({ name: "", url: "" });
          setError(null);
          console.log('Activity added successfully:', result);
        }
      } catch (error) {
        console.error('Failed to add activity:', error);
        setError(error.message || "Failed to add activity. Please try again.");
      }
    }
  };

  const handleDeleteActivity = async (activityToDelete) => {
    await deleteActivity({ id: activityToDelete.id });
  };

  const getRandomCategory = () => {
    if (categories.length > 1) {
      let availableCategories = categories.filter(
        (cat) => cat.id !== lastRandomCategory?.id
      );
      const randomIndex = Math.floor(
        Math.random() * availableCategories.length
      );
      const newRandomCategory = availableCategories[randomIndex];
      setRandomCategory(newRandomCategory);
      setLastRandomCategory(newRandomCategory);
      setSelectedCategory(newRandomCategory);

      const categoryActivities = activities.filter(
        (a) => a.category_id === newRandomCategory.id
      );
      if (categoryActivities.length > 0) {
        const randomActivityIndex = Math.floor(
          Math.random() * categoryActivities.length
        );
        setRandomActivity(categoryActivities[randomActivityIndex]);
      } else {
        setRandomActivity(null);
      }

      setActiveTab("activities");
    } else if (categories.length === 1) {
      const onlyCategory = categories[0];
      setRandomCategory(onlyCategory);
      setLastRandomCategory(onlyCategory);
      setSelectedCategory(onlyCategory);

      const categoryActivities = activities.filter(
        (a) => a.category_id === onlyCategory.id
      );
      if (categoryActivities.length > 0) {
        const randomActivityIndex = Math.floor(
          Math.random() * categoryActivities.length
        );
        setRandomActivity(categoryActivities[randomActivityIndex]);
      } else {
        setRandomActivity(null);
      }

      setActiveTab("activities");
    }
  };

  const startEditingActivity = (activity) => {
    setEditingActivity(activity);
    setEditingActivityText({ name: activity.name, url: activity.url });
  };

  const saveActivityEdit = async () => {
    if (editingActivityText.name.trim()) {
      try {
        await updateActivity({
          id: editingActivity.id,
          name: editingActivityText.name.trim(),
          url: editingActivityText.url ? editingActivityText.url.trim() : ''
        });
        setEditingActivity(null);
        setEditingActivityText({ name: "", url: "" });
      } catch (error) {
        console.error('Error saving activity edit:', error);
        setError('Failed to save activity changes. Please try again.');
      }
    }
  };

  const showCategoryActivities = (category) => {
    setSelectedCategory(category);
    setActiveTab("activities");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Randomizer Activities</h1>
        <AuthButton 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated} 
        />
      </div>
      <div>
        <div className="p-4 max-w-4xl mx-auto">
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          <div className="mb-8">
            <button
              onClick={getRandomCategory}
              className="w-full bg-pink-500 text-black py-3 px-6 rounded-lg mb-4 hover:bg-yellow-400"
              disabled={loading}
            >
              Give me the next activity
            </button>
            {randomActivity && (
              <div className="text-center text-lg font-semibold text-gray-700 bg-gray-100 p-3 rounded-lg">
                <a
                  href={randomActivity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {randomActivity.name}
                </a>
              </div>
            )}
          </div>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab("categories")}
              className={`flex-1 py-2 px-4 rounded ${
                activeTab === "categories" ? "bg-gray-200" : "bg-gray-100"
              }`}
              disabled={loading}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab("activities")}
              className={`flex-1 py-2 px-4 rounded ${
                activeTab === "activities" ? "bg-gray-200" : "bg-gray-100"
              }`}
              disabled={loading}
            >
              Activities
            </button>
          </div>

          {activeTab === "categories" && (
            <CategoryList
              categories={categories}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              addCategory={addCategory}
              handleCategoryKeyPress={handleCategoryKeyPress}
              editingCategory={editingCategory}
              editingText={editingText}
              setEditingText={setEditingText}
              handleEditKeyPress={handleEditKeyPress}
              saveEdit={saveEdit}
              startEditing={startEditing}
              handleDeleteCategory={handleDeleteCategory}
              showCategoryActivities={showCategoryActivities}
              isAuthenticated={isAuthenticated}
            />
          )}

          {activeTab === "activities" && (
            <ActivityList
              activities={activities}
              categories={categories}
              selectedCategory={selectedCategory}
              addActivity={addActivity}
              handleActivityKeyPress={handleActivityKeyPress}
              editingActivity={editingActivity}
              editingActivityText={editingActivityText}
              setEditingActivityText={setEditingActivityText}
              handleActivityEditKeyPress={handleActivityEditKeyPress}
              saveActivityEdit={saveActivityEdit}
              startEditingActivity={startEditingActivity}
              handleDeleteActivity={handleDeleteActivity}
              newActivity={newActivity}
              setNewActivity={setNewActivity}
              isAuthenticated={isAuthenticated}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
