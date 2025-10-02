import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  name: yup.string().required().min(2),
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
}).required();

export default function Register(){
  const { register, handleSubmit, formState:{errors}} = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await API.post('/auth/register', data);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) { alert(err?.response?.data?.message || 'Registration failed'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-6 border rounded">
        <h2 className="text-2xl mb-4">Register</h2>
        <input {...register('name')} placeholder="Name" className="input" />
        <p className="text-red-500">{errors.name?.message}</p>
        <input {...register('email')} placeholder="Email" className="input" />
        <p className="text-red-500">{errors.email?.message}</p>
        <input {...register('password')} type="password" placeholder="Password" className="input" />
        <p className="text-red-500">{errors.password?.message}</p>
        <button type="submit" className="btn mt-4">Register</button>
      </form>
    </div>
  );
}
