export const saveData = (key, data) => {
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
};

export const loadData = (key) => {
  try {
    const jsonData = localStorage.getItem(key);
    return jsonData ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    return null;
  }
};

export const removeData = (key) => {
  localStorage.removeItem(key);
};

