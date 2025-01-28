import Link from "next/link";

const AdminSidebar = () => {
  return (
    <div className="h-screen w-60 bg-gray-800 text-white">
      <div className="p-4 font-bold text-xl">Admin Dashboard</div>
      <nav className="mt-6">
        <ul className="space-y-4">
          <li>
            <Link href="/admin">
              <p className="block px-4 py-2 hover:bg-gray-700">Dashboard</p>
            </Link>
          </li>
          <li>
            <Link href="/admin/tools">
              <p className="block px-4 py-2 hover:bg-gray-700">Manage Tools</p>
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <p className="block px-4 py-2 hover:bg-gray-700">Manage Users</p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
