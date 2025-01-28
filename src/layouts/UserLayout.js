import UserSidebar from "@/components/UserSidebar";

const UserLayout = ({ children }) => {
  return (
    <div className="flex">
      <UserSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default UserLayout;
