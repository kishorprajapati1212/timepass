import { Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col p-5">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <Link
          to="/register"
          className="py-2 px-3 rounded hover:bg-blue-700 text-left"
        >
          Add Student
        </Link>
        <Link
          to="/register"
          className="py-2 px-3 rounded hover:bg-blue-700 text-left"
        >
          Add Faculty
        </Link>
        <Link
          to="/register"
          className="py-2 px-3 rounded hover:bg-blue-700 text-left"
        >
          Add Admin
        </Link>
        <Link
          to="/create-subject"
          className="py-2 px-3 rounded hover:bg-blue-700 text-left"
        >
          Create Subject
        </Link>
        <Link className="py-2 px-3 rounded hover:bg-blue-700 text-left">
          View Attendance
        </Link>
        <Link
          to="/assign-faculty"
          className="py-2 px-3 rounded hover:bg-blue-700 text-left"
        >
          Assign Faculty
        </Link>
        
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the admin dashboard. Manage students, faculty, subjects,
          and attendance easily.
        </p>

        {/* Example cards */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Students</h3>
            <p className="text-2xl font-bold">120</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Faculty</h3>
            <p className="text-2xl font-bold">15</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Subjects</h3>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Attendance</h3>
            <p className="text-2xl font-bold">85%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
