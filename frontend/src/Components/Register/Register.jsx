import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/userSlice";
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    gender: "",
    about: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prevState) => ({
        ...prevState,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

   
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

   
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(formData.age) || formData.age < 0 || formData.age > 120) {
      newErrors.age = "Please enter a valid age between 0 and 120";
    }


    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required";
    }

  
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 10) {
      newErrors.password = "Password must be at least 10 characters";
    }

    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Please select a gender";
    }

    // About validation (optional field)
    if (formData.about && formData.about.length > 500) {
      newErrors.about = "About must not exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/v1/users/register`,
        dataToSend
      );
      console.log(response.data.data);
      if (!response) {
        throw new Error("Register failed");
      } else {
        dispatch(loginUser(response.data.data));
        navigate("/");
      }

      alert("Register successful!");
    } catch (error) {
      console.error("Registeration error:", error.response);
      setErrors((prevState) => ({
        ...prevState,
        submit: "Failed to create account. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-[95%] text-black w-full sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto space-y-6 bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="name"
              className="block text-sm sm:text-base font-medium text-gray-700"
            >
              Full Name
            </label>
            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border ${
                  errors.name ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Danish Pathan"
              />
              {errors.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {errors.name}
                </p>
              )}
            </div>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="age"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                required
                value={formData.age}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base text-black border ${
                  errors.age ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.age && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {errors.age}
                </p>
              )}
            </div>

        
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="dateOfBirth"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border ${
                  errors.dateOfBirth ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>
          </div>

          
          <div className="space-y-4">
      
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="password"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

   
            <div className="space-y-1 sm:space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm sm:text-base font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

       
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="gender"
              className="block text-sm sm:text-base font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border ${
                errors.gender ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {errors.gender}
              </p>
            )}
          </div>

      
          <div className="space-y-1 sm:space-y-2">
            <label
              htmlFor="about"
              className="block text-sm sm:text-base font-medium text-gray-700"
            >
              About
            </label>
            <textarea
              id="about"
              name="about"
              rows="4"
              value={formData.about}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border ${
                errors.about ? "border-red-300" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Tell us about yourself..."
            />
            <div className="flex justify-between items-center">
              {errors.about && (
                <p className="text-xs sm:text-sm text-red-600">
                  {errors.about}
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-500">
                {formData.about.length}/500 characters
              </p>
            </div>
          </div>

 
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex cursor-pointer justify-center items-center px-4 py-2 sm:py-3 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white ${
                isSubmitting
                  ? "bg-neutral-600 cursor-not-allowed"
                  : "bg-neutral-800 hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

         
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-3 sm:p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-xs sm:text-sm font-medium text-red-800">
                    {errors.submit}
                  </h3>
                </div>
              </div>
            </div>
          )}

          
          <div className="text-center pt-2">
            <p className="text-xs sm:text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
