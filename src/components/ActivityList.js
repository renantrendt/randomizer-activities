import React, { useState } from 'react';

const ActivityList = ({
  activities,
  categories,
  selectedCategory,
  onSelectCategory,
  addActivity,
  handleActivityKeyPress,
  editingActivity,
  editingActivityText,
  setEditingActivityText,
  handleActivityEditKeyPress,
  saveActivityEdit,
  startEditingActivity,
  handleDeleteActivity,
  newActivity,
  setNewActivity,
  isAuthenticated
}) => {
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [error, setError] = useState("");

  return (
    <div>
      {!selectedCategory && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
          Please select a category first before adding activities
        </div>
      )}
      {selectedCategory && (
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold text-gray-700">{selectedCategory.name}</div>
          {isAuthenticated && (
            <button
              onClick={() => setShowAddActivity(!showAddActivity)}
              className="p-1 hover:bg-gray-100 rounded-full"
              aria-label="Add activity"
            >
              <span className="text-2xl text-blue-500 hover:text-blue-600">+</span>
            </button>
          )}
        </div>
      )}
      
      {isAuthenticated && showAddActivity && selectedCategory && (
        <>
          {error && (
            <div className="text-red-500 mb-2">{error}</div>
          )}
          <div className="space-y-2 mb-4">
            <input
              type="text"
              value={newActivity.name}
              onChange={(e) =>
                setNewActivity({ ...newActivity, name: e.target.value })
              }
              onKeyPress={handleActivityKeyPress}
              placeholder="Activity name"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="url"
              value={newActivity.url}
              onChange={(e) =>
                setNewActivity({ ...newActivity, url: e.target.value })
              }
              onKeyPress={handleActivityKeyPress}
              placeholder="Activity URL (optional)"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addActivity}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Activity
            </button>
          </div>
        </>
      )}
      <ul className="space-y-2">
        {activities
          .filter((activity) =>
            selectedCategory
              ? activity.category_id === selectedCategory.id
              : true
          )
          .map((activity) => (
            <li
              key={activity.id}
              className="flex justify-between items-center bg-gray-100 p-3 rounded hover:bg-gray-200 transition-all duration-200 group"
            >
              {editingActivity?.id === activity.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editingActivityText.name}
                    onChange={(e) =>
                      setEditingActivityText({
                        ...editingActivityText,
                        name: e.target.value,
                      })
                    }
                    onKeyPress={handleActivityEditKeyPress}
                    className="w-full border p-1 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    value={editingActivityText.url}
                    onChange={(e) =>
                      setEditingActivityText({
                        ...editingActivityText,
                        url: e.target.value,
                      })
                    }
                    onKeyPress={handleActivityEditKeyPress}
                    className="w-full border p-1 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={saveActivityEdit}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    {activity.url ? (
                      <a
                        href={activity.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600"
                      >
                        {activity.name}
                      </a>
                    ) : (
                      <span className="text-gray-700">{activity.name}</span>
                    )}
                  </div>
                  {isAuthenticated && (
                    <div className="hidden group-hover:flex gap-2 ml-2">
                      <button
                        onClick={() => startEditingActivity(activity)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(activity)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ActivityList;
