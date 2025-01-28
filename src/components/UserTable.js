const UserTable = ({ users, onDelete }) => {
  return (
    <table className="table w-full">
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>
              <button
                onClick={() => onDelete(user._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
