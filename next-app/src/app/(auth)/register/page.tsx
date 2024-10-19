'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
    username: string;
    password: string;
    displayName: string;
    sex: string;
    email: string;
    profilePic: File | null;
    age: string;
  }
  
  interface FormErrors {
    [key: string]: string;
  }

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    displayName: '',
    sex: '',
    email: '',
    profilePic: null,
    age: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'file' ? (e.target as HTMLInputElement).files?.[0] || null : value
    }));
    // Clear the error for this field when it's changed
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const formDataToSend = new FormData();
    
    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
        const value = formData[key];
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });
  

    try {
      const response = await fetch('api/auth/register', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        router.push('/login');
      } else {
        const errorData = await response.json();
        if (errorData.msg && errorData.msg.issues) {
          const serverErrors : FormErrors = {};
          errorData.msg.issues.forEach((issue: { path: string[], message: string }) => {
            serverErrors[issue.path[0]] = issue.message;
          });
          setErrors(serverErrors);
        } else {
          setErrors({ general: 'Registration failed. Please try again.' });
        }
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (formData.username.length < 4) {
        newErrors.username = 'Username must contain at least 4 characters';
      }
    if (formData.password.length < 8) {
      newErrors.password = 'Password must contain at least 8 characters';
    }
    if (!formData.displayName) {
      newErrors.displayName = 'Display name is required';
    }
    if (formData.sex !== 'm' && formData.sex !== 'f') {
      newErrors.sex = "Sex must be either 'm' or 'f'";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-4 text-center">Register</h2>
        {errors.general && <p className="text-red-500 text-xs italic mb-4">{errors.general}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="displayName">
            Display Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="displayName"
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            required
          />
          {errors.displayName && <p className="text-red-500 text-xs italic">{errors.displayName}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sex">
            Sex
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="sex"
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="m">Male</option>
            <option value="f">Female</option>
          </select>
          {errors.sex && <p className="text-red-500 text-xs italic">{errors.sex}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="profilepic">
            Profile Picture
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="profilepic"
            type="file"
            name="profilepic"
            onChange={handleChange}
            accept="image/*"
          />
          {errors.profilePic && <p className="text-red-500 text-xs italic">{errors.profilepic}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
            Age
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="age"
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
          {errors.age && <p className="text-red-500 text-xs italic">{errors.age}</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;