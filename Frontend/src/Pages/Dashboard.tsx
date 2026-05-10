import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../Services/task.service";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const Dashboard = () => {

  // TASK STATE
  const [tasks, setTasks] = useState<Task[]>([]);

  // FORM STATE
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // LOADING STATES
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // EDIT STATES
  const [editingTaskId, setEditingTaskId] =
    useState<number | null>(null);

  const [editTitle, setEditTitle] =
    useState("");

  const [editDescription, setEditDescription] =
    useState("");



  // FETCH TASKS
  const fetchTasks = async () => {

    setLoading(true);

    try {

      const data = await getTasks();

      setTasks(data);

    }

    catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Failed to fetch tasks"
      );
    }

    finally {

      setLoading(false);
    }
  };



  // CREATE TASK
  const handleCreateTask = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!title.trim()) {

      return toast.error(
        "Title is required"
      );
    }

    setCreating(true);

    try {

      await createTask({
        title,
        description,
      });

      toast.success(
        "Task created"
      );

      setTitle("");
      setDescription("");

      fetchTasks();

    }

    catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Failed to create task"
      );
    }

    finally {

      setCreating(false);
    }
  };



  // DELETE TASK
  const handleDeleteTask = async (
    id: number
  ) => {

    try {

      await deleteTask(id);

      toast.success(
        "Task deleted"
      );

      fetchTasks();

    }

    catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );
    }
  };



  // TOGGLE COMPLETE
  const handleToggleComplete = async (
    task: Task
  ) => {

    try {

      await updateTask(
        task.id,
        {
          completed: !task.completed,
        }
      );

      toast.success(
        "Task updated"
      );

      fetchTasks();

    }

    catch {

      toast.error(
        "Failed to update task"
      );
    }
  };



  // START EDIT
  const handleStartEdit = (
    task: Task
  ) => {

    setEditingTaskId(task.id);

    setEditTitle(task.title);

    setEditDescription(
      task.description
    );
  };



  // CANCEL EDIT
  const handleCancelEdit = () => {

    setEditingTaskId(null);

    setEditTitle("");

    setEditDescription("");
  };



  // UPDATE TASK
  const handleUpdateTask = async (
    id: number
  ) => {

    if (!editTitle.trim()) {

      return toast.error(
        "Title is required"
      );
    }

    try {

      await updateTask(id, {
        title: editTitle,
        description: editDescription,
      });

      toast.success(
        "Task updated"
      );

      setEditingTaskId(null);

      fetchTasks();

    }

    catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Update failed"
      );
    }
  };



  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem("token");

    toast.success(
      "Logged out"
    );

    window.location.href = "/login";
  };



  useEffect(() => {

    fetchTasks();

  }, []);



  return (

    <div className="p-10 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>



      {/* CREATE TASK FORM */}
      <form
        onSubmit={handleCreateTask}
        className="flex flex-col gap-4 mb-8 border p-5 rounded-lg shadow"
      >

        <input
          type="text"
          placeholder="Task title"
          className="border p-2 rounded"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          placeholder="Task description"
          className="border p-2 rounded"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <button
          type="submit"
          disabled={creating}
          className="bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {
            creating
              ? "Creating..."
              : "Create Task"
          }
        </button>

      </form>



      {/* LOADING */}
      {
        loading && (

          <p className="text-center text-lg">
            Loading tasks...
          </p>
        )
      }



      {/* EMPTY STATE */}
      {
        !loading &&
        tasks.length === 0 && (

          <div className="text-center border rounded-lg p-10">

            <h2 className="text-xl font-semibold">
              No tasks found
            </h2>

            <p className="text-gray-500 mt-2">
              Create your first task
            </p>

          </div>
        )
      }



      {/* TASK LIST */}
      <div className="space-y-4">

        {
          tasks.map((task) => (

            <div
              key={task.id}
              className={`border p-5 rounded-lg shadow transition-all
              ${
                task.completed
                  ? "bg-green-50 border-green-300"
                  : "bg-white"
              }`}
            >

              {
                editingTaskId === task.id ? (

                  <>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) =>
                        setEditTitle(
                          e.target.value
                        )
                      }
                      className="border p-2 rounded w-full mb-3"
                    />

                    <textarea
                      value={editDescription}
                      onChange={(e) =>
                        setEditDescription(
                          e.target.value
                        )
                      }
                      className="border p-2 rounded w-full mb-3"
                    />

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          handleUpdateTask(task.id)
                        }
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-400 text-white px-4 py-2 rounded"
                      >
                        Cancel
                      </button>

                    </div>
                  </>

                ) : (

                  <>
                    <h2 className="text-xl font-semibold">
                      {task.title}
                    </h2>

                    <p className="mt-2 text-gray-700">
                      {task.description}
                    </p>

                    <p className="mt-3 text-sm font-medium">

                      Status:
                      {
                        task.completed
                          ? " Completed"
                          : " Pending"
                      }

                    </p>



                    {/* ACTION BUTTONS */}
                    <div className="flex flex-wrap gap-2 mt-4">

                      <button
                        onClick={() =>
                          handleToggleComplete(task)
                        }
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        {
                          task.completed
                            ? "Mark Pending"
                            : "Mark Complete"
                        }
                      </button>

                      <button
                        onClick={() =>
                          handleStartEdit(task)
                        }
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteTask(task.id)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                    </div>
                  </>
                )
              }

            </div>
          ))
        }

      </div>

    </div>
  );
};

export default Dashboard;