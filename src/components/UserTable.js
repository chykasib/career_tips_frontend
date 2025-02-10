import { FiLoader } from "react-icons/fi"; // Optional: using a loading spinner icon

const UserTable = ({
  users,
  onDelete,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
      {/* Loader */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <FiLoader className="animate-spin text-4xl text-gray-500" />
        </div>
      ) : (
        <>
          <table className="table w-full text-left table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 font-semibold text-sm">Email</th>
                <th className="px-6 py-3 font-semibold text-sm hidden sm:table-cell">
                  Role
                </th>{" "}
                {/* Hide Role column on mobile */}
                <th className="px-6 py-3 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 sm:px-6 sm:py-4">{user.email}</td>{" "}
                  {/* Reduced padding on mobile */}
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        user.role === "admin"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4">
                    <button
                      onClick={() => onDelete(user._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center items-center space-x-4">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  onPageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserTable;
