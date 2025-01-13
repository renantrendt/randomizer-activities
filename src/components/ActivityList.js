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
  setNewActivity
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
          <div className="font-semibold text-gray-700">
            {selectedCategory.name}
          </div>
          <button
            onClick={() => setShowAddActivity(!showAddActivity)}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Add activity"
          >
            <span className="text-2xl text-blue-500 hover:text-blue-600">+</span>
          </button>
        </div>
      )}
      
      {showAddActivity && selectedCategory && (
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
                <div className="flex justify-between items-center w-full">
                  <div>
                    <div className="font-bold">
                      {
                        categories.find((c) => c.id === activity.category_id)
                          ?.name
                      }
                    </div>
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
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => startEditingActivity(activity)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity)}
                      className="text-gray-500 hover:text-gray-700"
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

export default ActivityList;
