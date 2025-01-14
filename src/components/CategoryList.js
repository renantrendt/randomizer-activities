import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

function CategoryList({ 
  categories, 
  newCategory, 
  setNewCategory, 
  addCategory, 
  handleCategoryKeyPress,
  editingCategory,
  editingText,
  setEditingText,
  handleEditKeyPress,
  saveEdit,
  startEditing,
  handleDeleteCategory,
  showCategoryActivities,
  isAuthenticated,
  onHideCategory // Nova prop para esconder categoria
}) {
  const [showAddCategory, setShowAddCategory] = useState(false);

  // Ícone de olho cortado (privado)
  const PrivateIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-400"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
        clipRule="evenodd"
      />
      <path
        d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
      />
    </svg>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="font-semibold text-gray-700">
          Categories
        </div>
        {isAuthenticated && (
          <button
            onClick={() => setShowAddCategory(!showAddCategory)}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Add category"
          >
            <span className="text-2xl text-blue-500 hover:text-blue-600">+</span>
          </button>
        )}
      </div>

      {isAuthenticated && showAddCategory && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={handleCategoryKeyPress}
            placeholder="Add new category"
            className="flex-1 border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addCategory}
            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </div>
      )}
      
      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex justify-between items-center bg-white shadow-sm border border-gray-200 p-3 rounded-lg hover:shadow-md transition-all duration-200 group cursor-pointer"
          >
            <div 
              className="flex-1" 
              onClick={() => showCategoryActivities(category)}
            >
              {editingCategory?.id === category.id ? (
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyPress={handleEditKeyPress}
                  onBlur={saveEdit}
                  className="w-full border p-1 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span>{category.name}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {/* Mostrar ícone de privado apenas para o criador da categoria */}
              {isAuthenticated && category.user_id === supabase.auth.user()?.id && (
                <PrivateIcon />
              )}
              
              {isAuthenticated && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
                  {/* Mostrar botões de editar/deletar apenas para categorias do usuário */}
                  {category.user_id === supabase.auth.user()?.id ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(category);
                        }}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(category);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    // Para categorias públicas, mostrar opção de esconder
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onHideCategory(category);
                      }}
                      className="text-gray-500 hover:text-gray-600"
                      title="Hide this category"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
