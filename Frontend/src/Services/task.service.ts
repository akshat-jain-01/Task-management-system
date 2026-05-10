import API from "../api/axios";


// GET USER TASKS
export const getTasks = async () => {

  const response =
    await API.get("/tasks");

  return response.data;
};


// GET ALL TASKS (ADMIN)
export const getAllTasks = async () => {

  const response =
    await API.get("/tasks/all");

  return response.data;
};


// CREATE TASK
export const createTask = async (
  data: {
    title: string;
    description: string;
  }
) => {

  const response =
    await API.post(
      "/tasks",
      data
    );

  return response.data;
};


// UPDATE TASK
export const updateTask = async (
  id: number,
  data: {
    title?: string;
    description?: string;
    completed?: boolean;
  }
) => {

  const response =
    await API.put(
      `/tasks/${id}`,
      data
    );

  return response.data;
};


// DELETE TASK
export const deleteTask = async (
  id: number
) => {

  const response =
    await API.delete(
      `/tasks/${id}`
    );

  return response.data;
};