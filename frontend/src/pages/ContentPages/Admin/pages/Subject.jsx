import React from "react";
import { useForm } from "react-hook-form";
import axios from "../../../../utils/AxiosInstance";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Subject = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
         const res = await axios.post("/subject/create", data);
        console.log(res);
        
      toast.success(res.data.message);
      reset();
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-2xl">
        
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create Subject
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Subject Name */}
          <input
            type="text"
            placeholder="Subject Name"
            {...register("subjectName", {
              required: "Subject name is required",
            })}
            className="input"
          />
          {errors.subjectName && (
            <p className="error">{errors.subjectName.message}</p>
          )}

          {/* Subject Code */}
          <input
            type="text"
            placeholder="Subject Code"
            {...register("subjectCode", {
              required: "Subject code is required",
            })}
            className="input uppercase"
          />
          {errors.subjectCode && (
            <p className="error">{errors.subjectCode.message}</p>
          )}

          {/* Semester */}
          <select
            {...register("semester", {
              required: "Semester is required",
            })}
            className="input"
          >
            <option value="">Select Semester</option>
            {[1,2,3,4,5,6,7,8].map((sem) => (
              <option key={sem} value={sem}>
                Sem - {sem}
              </option>
            ))}
          </select>
          {errors.semester && (
            <p className="error">{errors.semester.message}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90"
          >
            {isSubmitting ? "Creating..." : "Create Subject"}
          </button>

          {/* Back */}
          <p className="text-sm text-center">
            Back To Dashboard?{" "}
            <Link to="/admin" className="text-blue-500 hover:underline">
              Go to Dashboard
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Subject;