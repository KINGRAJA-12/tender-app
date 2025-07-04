'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaWpforms,
  FaBuilding,
  FaBars,
  FaTimes,
  FaHome,
  FaCompactDisc,
  FaUser
} from 'react-icons/fa';
import { BiLogOut } from 'react-icons/bi';
import { axiosInstance } from '@/axiosInstance';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const navItems = [
    { icon: <FaHome />, label: 'Home', href: '/home' },
    { icon: <FaCompactDisc />, label: 'Tenders', href: '/home/tender' },
    { icon: <FaWpforms />, label: 'Applications', href: '/home/applications' },
    { icon: <FaBuilding />, label: 'Company', href: '/home/company' },
    { icon: <FaUser />, label: 'Profile', href: '/home/profile' }
  ];

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.get('/auth/logout');
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="w-full bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-700">
          B2B TenderPro
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex flex-col items-center text-black hover:text-blue-600 transition"
              title={item.label}
            >
              <div className="text-xl">{item.icon}</div>
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-black hover:text-red-600 transition"
            disabled={isLoading}
          >
            <div className="text-xl">
              {isLoading ? <ClipLoader size={18} color="#dc2626" /> : <BiLogOut />}
            </div>
            <span className="text-xs">Logout</span>
          </button>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-2xl">
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden px-4 py-3 bg-white border-t shadow-sm space-y-2">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="flex items-center gap-3 py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-3 py-2 text-gray-700 hover:text-red-600 w-full"
            disabled={isLoading}
          >
            <span className="text-lg">
              {isLoading ? <ClipLoader size={18} color="#dc2626" /> : <BiLogOut />}
            </span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
