import React from 'react';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await API.post('/auth/login', data);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) { alert(err?.response?.data?.message || 'Login failed'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-6 border rounded">
        <h2 className="text-2xl mb-4">Login</h2>
        <input {...register('email')} placeholder="Email" className="input" />
        <input {...register('password')} type="password" placeholder="Password" className="input" />
        <button type="submit" className="btn mt-4">Login</button>
      </form>
    </div>
  );
}
