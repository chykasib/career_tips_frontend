import Link from "next/link";

const AdminSidebar = () => {
  return (
    <div className="min-h-screen w-64 bg-gray-900 text-white shadow-md">
      <div className="p-6 text-2xl font-semibold border-b border-gray-700">
        Admin Dashboard
      </div>
      <nav className="mt-8">
        <ul className="space-y-4">
          <li>
            <Link href="/admin/tools">
              <p className="flex items-center px-6 py-3 rounded-lg text-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all">
                <span className="mr-3">🛠️</span> Manage Tools
              </p>
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <p className="flex items-center px-6 py-3 rounded-lg text-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all">
                <span className="mr-3">👥</span> Manage Users
              </p>
            </Link>
          </li>
          <li>
            <Link href="/admin/blogs">
              <p className="flex items-center px-6 py-3 rounded-lg text-lg font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all">
                <span className="mr-3">📝</span> Blogs
              </p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
