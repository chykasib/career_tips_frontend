import TaskManager from "@/components/TaskManager";
import AdminLayout from "../../layouts/AdminLayout";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Welcome to the Admin Dashboard</h1>
      <div className="container mx-auto p-5">
        <TaskManager />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
