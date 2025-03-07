// HomePage.jsx
import React, { useState, useEffect } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/userSlice';
import { useNavigate } from 'react-router';
import axios from 'axios';
const HomePage = () => {
    const navigate = useNavigate();
    const userData = useSelector((state)=> state.user.userData);
    
console.log(userData);
    const dispatch = useDispatch();
    // Mock user data (replace with actual user data from your backend/state management)
    const [user, setUser] = useState(userData.user);

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState(user);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        if (!user) {
         
          navigate("/login");
        }
      }, [user, navigate]);
    // Update editedUser when user data changes
    useEffect(() => {
        async function fetchUser(){
        try {
            const response = await axios.get("http://localhost:8000/api/v1/users/profile", {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`
                }
            });
               console.log("response",response.data);
            if(!response){
                alert("Error Fetching User");
            } else {
                setUser(response.data.data);
            }
                
        }
        catch (error) {
            console.error("error",error.response);
        }
        
    }
    fetchUser();
}, [user,editedUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        

        // Name validation
        if (!editedUser.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (editedUser.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Age validation
        if (!editedUser.age) {
            newErrors.age = 'Age is required';
        } else if (isNaN(editedUser.age) || editedUser.age < 0 || editedUser.age > 120) {
            newErrors.age = 'Please enter a valid age between 0 and 120';
        }

        // Date of Birth validation
        if (!editedUser.dateOfBirth) {
            newErrors.dateOfBirth = 'Date of Birth is required';
        }

    
        // Gender validation
        if (!editedUser.gender) {
            newErrors.gender = 'Please select a gender';
        }

        // About validation (optional field)
        if (editedUser.about && editedUser.about.length > 500) {
            newErrors.about = 'About must not exceed 500 characters';
        }

        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        try {

       
            const response = await axios.put('http://localhost:8000/api/v1/users/update',editedUser,{
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`
                }
            })
            console.log("update",response.data.data);
            if (!response) {
                throw new Error('Profile Updation failed!');
            }
            else{
                setIsEditing(false);
                
                alert('Profile updated successfully!');
            }
            
            // Show success message
        } catch (error) {
            console.error('Error updating profile:', error.response);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

        try {
            const response = await axios.delete('http://localhost:8000/api/v1/users/profile', {
                headers: {
                    Authorization: `Bearer ${userData.accessToken}`
                }
            });

            if (!response) {
                throw new Error('User deletion failed!');
            } else {
                alert('User deleted successfully!');
                dispatch(logoutUser());
            }
        } catch (error) {
            console.error('Error deleting user:', error.response);
            alert('Failed to delete user. Please try again.');
        }
    };

    const handleCancel = () => {
        setEditedUser(user);
        setIsEditing(false);
        setErrors({});
    };

    return (
        <div className="min-h-screen w-screen bg-gray-50 py-8">
            <div className="max-w-4xl text-black mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white shadow rounded-lg mb-6">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                User Profile
                            </h1>
                            <button
                                    onClick={() => handleDelete()}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    Delete User
                                </button>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <PencilIcon className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                            isSaving 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-green-600 hover:bg-green-700'
                                        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                                    >
                                        {isSaving ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <CheckIcon className="h-4 w-4 mr-2" />
                                                Save
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-2" />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* User Details Form */}
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                {isEditing ? (
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="name"
                                            value={editedUser.name}
                                            onChange={handleInputChange}
                                            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.name ? 'border-red-300' : ''
                                            }`}
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Age
                                </label>
                                {isEditing ? (
                                    <div className="mt-1">
                                        <input
                                            type="number"
                                            name="age"
                                            value={editedUser.age}
                                            onChange={handleInputChange}
                                            className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                                                errors.age ? 'border-red-300' : ''
                                            }`}
                                        />
                                        {errors.age && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.age}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="mt-1 text-sm text-gray-900">{user.age}</p>
                                )}
                            </div>

                            

                            {/* Department */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Gender
                                </label>
                                {isEditing ? (
                                    <select
                                    id="gender"
                                    name="gender"
                                    required
                                    value={editedUser.gender}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border ${
                                        errors.gender ? 'border-red-300' : 'border-gray-300'
                                    } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                               
                                ) : (
                                    <p className="mt-1 text-sm text-gray-900">{user.gender}</p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    About
                                </label>
                                {isEditing ? (
                                    <div className="mt-1">
                                         <textarea
                            id="about"
                            name="about"
                            rows="4"
                            value={editedUser.about}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border ${
                                errors.about ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="Tell us about yourself..."
                        />
                                        {errors.about && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.about}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="mt-1 text-sm text-gray-900">{user.about}</p>
                                )}
                            </div>

                            {/* Join Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Date of Birth
                                </label>
                                {isEditing ? (
                                     <input
                                     id="dateOfBirth"
                                     name="dateOfBirth"
                                     type="date"
                                     required
                                     value={editedUser.dateOfBirth}
                                     onChange={handleInputChange}
                                     className={`w-full px-3 py-2 sm:py-2.5 text-sm sm:text-base border ${
                                         errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                                     } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                                 />
                                ) : (
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(user.dateOfBirth).toLocaleDateString()}
                                    </p>
                                )}
                            </div>

                            

                        
                          
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;