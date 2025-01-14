import React, { useState } from 'react';

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
  isAuthenticated
}) {
  const [showAddCategory, setShowAddCategory] = useState(false);

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
      <div className="mb-4">
        {isAuthenticated && (
          <button
            onClick={() => setShowAddCategory(true)}
            className="flex items-center justify-center w-full p-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex justify-between items-center bg-white shadow-sm border border-gray-200 p-3 rounded-lg hover:shadow-md transition-all duration-200 group cursor-pointer relative"
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
            {isAuthenticated && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute right-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(category);
                  }}
                  className="text-gray-500 hover:text-blue-600 transition-colors"
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
                  className="text-gray-500 hover:text-red-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
