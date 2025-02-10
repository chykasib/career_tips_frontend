import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { fetchUsers, deleteUser } from "../../utils/api";
import UserTable from "../../components/UserTable";
import Spinner from "../../components/ui/spinner"; // Assuming you have a Spinner component

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true); // Set loading to true before fetching
      const data = await fetchUsers();
      setUsers(data);
      setLoading(false); // Set loading to false after data is fetched
    };
    getUsers();
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user._id !== id));
  };

  return (
    <AdminLayout>
      <div className="px-6 py-4 sm:px-8 md:px-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center sm:text-left">
          Manage Users
        </h1>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <UserTable users={users} onDelete={handleDelete} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
