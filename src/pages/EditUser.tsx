import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import imageCompression from 'browser-image-compression';
import { User, UserFormData } from '../types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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

const EditUserPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profilePhotoBase64, setProfilePhotoBase64] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [status, setStatus] = useState(false);

  // Initialize React Hook Form with validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      // Default status to false
      status: false,
    },
  });
  // Fetch the user data by ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/users/${userId}`
        );
        const userData = response.data;

        setValue('name', userData.name);
        setValue('email', userData.email);
        setValue('role', userData.role);
        setValue('status', userData.status);
        setProfilePhotoBase64(userData.profilePhoto);
        setFileName(userData.profilePhoto);
        setStatus(userData.status);
      } catch (error) {
        console.log(error);
        toast.error('Error fetching user data');
      }
    };

    fetchUser();
  }, [userId, setValue]);

  // Handle the form submission for updating user data
  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);
      const updatedUser: User = {
        ...data,
        id: userId || '',
        profilePhoto: profilePhotoBase64,
        status: status,
      };

      await axios.put(`http://localhost:7000/users/${userId}`, updatedUser);
      toast.success('User updated successfully');
      // eslint-disable-next-line no-undef
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error('Error updating user');
    } finally {
      setLoading(false);
    }
  };

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
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <h2 className="text-2xl font-semibold mb-6">Edit User</h2>
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
            className="p-3 border rounded-md"
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
            className="p-3 border rounded-md"
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
            className="p-3 border rounded-md"
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
            className="p-3 mt-2 bg-blue-500 text-white rounded-md font-medium cursor-pointer hover:bg-blue-600"
          >
            {fileName ? 'Update User Profile Picture' : 'Please select a file'}
          </label>
          {errors.profilePhoto && (
            <p className="text-red-500 text-sm mt-1">
              {errors.profilePhoto.message}
            </p>
          )}
          {/* Show the selected image */}
          <div className="mt-4">
            <img
              src={
                profilePhotoBase64
                  ? `data:image/png;base64,${profilePhotoBase64}`
                  : '/avatar.png'
              }
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update User'}
        </button>
      </form>
    </div>
  );
};

export default EditUserPage;
