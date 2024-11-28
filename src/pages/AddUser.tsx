import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import imageCompression from 'browser-image-compression';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, UserFormData } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

// Validation schema using yup
const schema = yup
  .object({
    name: yup
      .string()
      .matches(/^[a-zA-Z\s]+$/, 'Name must only contain letters and spaces')
      .required('Name is required'),
    email: yup
      .string()
      .email('Invalid email address')
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Email must include a dot in the domain part (e.g., example@domain.com)'
      )
      .required('Email is required'),
    role: yup.string().required('Role is required'),
    status: yup.boolean().required('Status is required'),
    profilePhoto: yup.string().required('Profile Photo is required'),
  })
  .required();

const AddUserPage = () => {
  // State for loading, error, and user list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(false);
  const [profilePhotoBase64, setProfilePhotoBase64] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const navigate = useNavigate();
  // Initialize React Hook Form with validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    // clear form after submission if needed
    reset,
  } = useForm<UserFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      // Default status to false
      status: false,
    },
  });

  // Function to handle form submission and send POST request
  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);
      const userData: User = {
        ...data,
        id: uuidv4(),
        profilePhoto: profilePhotoBase64,
      };
      const response = await axios.post(
        'http://localhost:7000/users',
        userData
      );
      console.log('User added:', response.data);
      setLoading(false);
      toast.success('User added successfully!');
      //  Clear the form after submission
      reset();
      // Clear the profile photo preview
      setProfilePhotoBase64('');
      setFileName('');
      // Clear profile photo value
      setValue('profilePhoto', '');
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Error submitting data');
      setLoading(false);
      toast.error('Failed to add user. Please try again.');
    }
  };

  // Update form status value when local status changes
  useEffect(() => {
    setValue('status', status);
  }, [status, setValue]);

  // Handle file upload and convert image to base64
  const handleProfilePhotoChange = async (
    // eslint-disable-next-line no-undef
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const validImageTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/gif',
      ];
      if (!validImageTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, JPG, GIF).');
        // Clear the file input
        event.target.value = '';
        return;
      }
      setFileName(file.name);
      try {
        const options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 300,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);

        // eslint-disable-next-line no-undef
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const rawBase64 = base64String.replace(
            /^data:image\/[a-zA-Z]+;base64,/,
            ''
          );
          // Store only the raw base64 string
          setProfilePhotoBase64(rawBase64);
          setValue('profilePhoto', rawBase64);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error compressing the image:', error);
      }
    } else {
      // Clear the preview if no file is chosen
      setProfilePhotoBase64('');
      setValue('profilePhoto', '');
      setFileName('');
    }
  };

  return (
    <div className="mx-auto p-6 bg-[#f4f7fa] shadow-md rounded-lg md:mt-8 mt-2 max-w-lg">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <h2 className="text-2xl font-semibold mb-6">Add User</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Input */}
        <div className="flex flex-col">
          <label htmlFor="name" className="font-medium text-gray-700">
            Name
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className={`w-full p-3 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="flex flex-col">
          <label htmlFor="email" className="font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className={`w-full p-3 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Role Input */}
        <div className="flex flex-col">
          <label htmlFor="role" className="font-medium text-gray-700">
            Role
          </label>
          <select
            {...register('role')}
            id="role"
            className={`w-full p-3 border rounded-md ${errors.role ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        {/* Status Toggle */}
        <div className="flex flex-col">
          <label htmlFor="status" className="font-medium text-gray-700">
            Status
          </label>
          <div className="flex items-center space-x-2">
            <Toggle
              id="status"
              checked={status}
              onChange={() => setStatus(!status)}
            />
            <span className="text-gray-700">
              {status ? 'Active' : 'Inactive'}
            </span>
          </div>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
          )}
        </div>

        {/* Profile Photo Upload */}
        <div className="flex flex-col">
          <label htmlFor="profilePhoto" className="font-medium text-gray-700">
            Profile Photo
          </label>
          <input
            {...register('profilePhoto')}
            type="file"
            id="profilePhoto"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hidden"
          />
          <label
            htmlFor="profilePhoto"
            className="w-full p-3 mt-2 bg-blue-500 text-white rounded-md font-medium cursor-pointer hover:bg-blue-600"
          >
            {fileName ? fileName : 'Please select a file'}
          </label>
          {errors.profilePhoto && (
            <p className="text-red-500 text-sm mt-1">
              {errors.profilePhoto.message}
            </p>
          )}
          {/* Show the selected image */}
          {profilePhotoBase64 && (
            <div className="mt-4">
              <img
                src={`data:image/jpeg;base64,${profilePhotoBase64}`}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add User'}
        </button>
      </form>
    </div>
  );
};

export default AddUserPage;
