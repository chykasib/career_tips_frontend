const BASE_URL = "http://localhost:5000/api"; // Base URL for your API endpoints

// --- Career Tools API ---

export const createTool = async (toolData) => {
  try {
    const response = await fetch(`${BASE_URL}/tools/create-tools`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toolData),
    });
    if (!response.ok) throw new Error("Failed to create tool");
    return await response.json();
  } catch (error) {
    console.error("Error creating tool:", error);
    throw error;
  }
};

export const fetchTools = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tools`);
    if (!response.ok) throw new Error("Failed to fetch tools");
    return await response.json();
  } catch (error) {
    console.error("Error fetching tools:", error);
    throw error;
  }
};

export const fetchToolById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/tools/${id}`);
    if (!response.ok) throw new Error("Failed to fetch tool");
    return await response.json();
  } catch (error) {
    console.error("Error fetching tool:", error);
    throw error;
  }
};

export const updateTool = async (id, toolData) => {
  try {
    const response = await fetch(`${BASE_URL}/tools/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toolData),
    });
    if (!response.ok) throw new Error("Failed to update tool");
    return await response.json();
  } catch (error) {
    console.error("Error updating tool:", error);
    throw error;
  }
};

export const deleteTool = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/tools/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete tool");
  } catch (error) {
    console.error("Error deleting tool:", error);
    throw error;
  }
};

// --- Users API ---
export const fetchUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUserRole = async (id, role) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error("Failed to update user role");
    return await response.json();
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete user");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
