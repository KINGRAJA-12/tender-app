'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { axiosInstance } from '@/axiosInstance';
import { ClipLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RegisterPage: React.FC = () => {
  const router = useRouter();

  const [preview, setPreview] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (
        !username ||
        !email ||
        !password ||
        !companyName ||
        !number ||
        !address ||
        !description ||
        !preview
      ) {
        toast.error('All fields including logo are required!');
        return;
      }
      const res = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
        companyName,
        number,
        address,
        description,
        logo: preview,
      });

      if (res.status === 201) {
        toast.success('Registered successfully!');
        // Clear form
        setUsername('');
        setEmail('');
        setPassword('');
        setCompanyName('');
        setNumber('');
        setAddress('');
        setDescription('');
        setPreview(null);

        // Redirect to login after short delay
        setTimeout(() => router.push('/login'), 1500);
      }
    } catch (err: any) {
      console.log(err?.message)
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-blue-900 text-white items-center justify-center p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4">Create Your Free Account</h1>
          <p className="text-lg">
            Manage tenders, collaborate with vendors, and close deals faster with TenderPro.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <form
          className="bg-white shadow-lg shadow-blue-100 rounded-xl p-8 w-full max-w-xl space-y-4"
          onSubmit={handleRegister}
        >
          <h2 className="text-3xl font-bold text-center text-blue-800">
            Join TenderPro
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="input px-2"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="input px-2"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input px-2"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="input px-2"
              placeholder="Phone Number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <input
              className="input px-2"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              className="input px-2"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <textarea
            placeholder="Company Description"
            rows={3}
            className="input w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full text-sm"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 mx-auto mt-2 object-contain"
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex justify-center items-center gap-2"
          >
            {isLoading ? <ClipLoader size={20} color="#fff" /> : 'Create Account'}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
