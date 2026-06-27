import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../utils/AxiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AssignFaculty = () => {
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const navigate = useNavigate();

  // 🔹 Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facRes, subRes, secRes] = await Promise.all([
          axiosInstance.get("/faculty"),
          axiosInstance.get("/subjects"),
          axiosInstance.get("/sections"),
        ]);

        setFaculties(facRes.data);
        setSubjects(subRes.data);
        setSections(secRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  console.log(faculties);
  

  // 🔹 Assign Faculty
  const handleAssign = async () => {
    if (!selectedFaculty || !selectedSubject || !selectedSection) {
      return alert("❌ All fields required");
    }

    try {
      await axiosInstance.post("/faculty-subject-section", {
        facultyId: selectedFaculty,
        subjectId: selectedSubject,
        sectionId: selectedSection,
      });

      toast.success(" Faculty assigned successfully ✅ ");
         setSelectedFaculty("");
        setSelectedSubject("");
        setSelectedSection("");
         navigate("/admin");

    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Assign Faculty</h2>

      {/* Faculty */}
      <select
        value={selectedFaculty}
        onChange={(e) => setSelectedFaculty(e.target.value)}
        className="border p-2 mr-2"
      >
        <option value="">Select Faculty</option>
        {faculties.map((f) => (
          <option key={f._id} value={f._id}>
            {f.employeeId} - {f.name}
          </option>
        ))}
      </select>

      {/* Subject */}
      <select
        value={selectedSubject}
        onChange={(e) => setSelectedSubject(e.target.value)}
        className="border p-2 mr-2"
      >
        <option value="">Select Subject</option>
        {subjects.map((s) => (
          <option key={s._id} value={s._id}>
            {s.subjectName}
          </option>
        ))}
      </select>

      {/* Section */}
      <select
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        className="border p-2 mr-2"
      >
        <option value="">Select Section</option>
        {sections.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name} (Sem {s.semester})
          </option>
        ))}
      </select>

      <br /><br />

      <button
        onClick={handleAssign}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Assign
      </button>
      
      <p className="text-sm ">
            Back To Dashboard?{" "}
            <Link to="/admin" className="text-blue-500  hover:underline">
              Go to Dashboard
            </Link>
          </p>

    </div>
  );
};

export default AssignFaculty;