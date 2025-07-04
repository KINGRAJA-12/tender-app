'use client';
import React, { useState, FormEvent } from 'react';
import { axiosInstance } from '@/axiosInstance';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  let router = useRouter();
  let [email, setEmail] = useState<string>('');
  let [password, setPassword] = useState<string>('');
  let [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!email || !password) {
        toast.error("Email and password are required");
        return;
      }

      const res = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      if (res.status === 200) {
        toast.success('Login successful!');
       router.push('/home')
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-blue-900 text-white items-center justify-center p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Welcome to TenderPro</h1>
          <p className="text-lg">
            B2B Tender Management made easy — Collaborate, Compete, and Close deals faster.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <form className="bg-white shadow-lg shadow-blue-100 rounded-xl p-8 w-full max-w-md space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-blue-800">Sign In</h2>
          <p className="text-center text-gray-600">to continue to TenderPro</p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-[90%] px-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-[90%] px-2"
            required
          />

          <button
            type="submit"
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex justify-center items-center gap-2"
          >
            {isLoading ? <ClipLoader size={20} color="#fff" /> : 'Sign In'}
          </button>

          <p className="text-center text-sm text-gray-500">
            New to TenderPro?{' '}
            <Link href="/register" className="text-blue-700 font-medium">
              Join now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
