// Local Storage helper functions
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (err) {
      console.error(`Error getting ${key} from localStorage:`, err);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`Error setting ${key} in localStorage:`, err);
      return false;
    }
  }
};

export default storage;
