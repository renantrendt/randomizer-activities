import React from 'react';

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
  showCategoryActivities
}) {
  return (
    <div>
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
      <ul className="space-y-2">
        {categories.map((category) => (
          <li
            key={category.id}
            className="flex justify-between items-center bg-white shadow-sm border border-gray-200 p-3 rounded-lg hover:shadow-md transition-all duration-200 group cursor-pointer"
            onClick={() => showCategoryActivities(category)}
          >
            {editingCategory?.id === category.id ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyPress={handleEditKeyPress}
                onBlur={saveEdit}
                className="flex-1 border p-1 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <div className="flex items-center justify-between flex-1">
                <span className="text-gray-700">{category.name}</span>
                <div
                  className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(category);
                    }}
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category);
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
