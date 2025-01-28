import { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { fetchUsers, deleteUser } from "../../utils/api";
import UserTable from "../../components/UserTable";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };
    getUsers();
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user._id !== id));
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <UserTable users={users} onDelete={handleDelete} />
    </AdminLayout>
  );
};

export default ManageUsers;
