import Link from "next/link";

const UserSidebar = () => {
  return (
    <div className="h-screen w-60 bg-gray-800 text-white">
      <div className="p-4 font-bold text-xl">User Dashboard</div>
      <nav className="mt-6">
        <ul className="space-y-4">
          <li>
            <Link href="/user/blogs">
              <p className="block px-4 py-2 hover:bg-gray-700">Blogs</p>
            </Link>
          </li>
          <li>
            <Link href="/user/resume-builder">
              <p className="block px-4 py-2 hover:bg-gray-700">ResumeBuilder</p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default UserSidebar;
