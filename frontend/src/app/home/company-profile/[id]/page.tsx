'use client';

import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { HiOutlineMail } from 'react-icons/hi';
import { BsTelephone } from 'react-icons/bs';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { ClipLoader } from 'react-spinners';
import { axiosInstance } from '@/axiosInstance';

const CompanyProfilePage = () => {
  const {id:companyId} = useParams();

  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axiosInstance.get(`/company/view-company/${companyId}`);
        setCompany(res.data.company);
        setUser(res.data.user);
        setServices(res.data.service);
        console.log(res?.data)
      } catch (err) {
        console.error('Error fetching company:', err);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchCompany();
  }, [companyId]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <ClipLoader size={50} />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-400 font-semibold">
        Company not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-10 px-4 md:px-10 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-6">
        <img
          src={company.logo || 'https://via.placeholder.com/80x80?text=Logo'}
          alt="Logo"
          className="w-20 h-20 rounded-full border"
        />
        <div className="space-y-1 text-center md:text-left">
          <h1 className="text-2xl font-bold text-gray-800">{company.companyName}</h1>
          <p className="text-sm text-gray-600">{company.address}</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-gray-500" /> {company.address}</span>
            <span className="flex items-center gap-1"><HiOutlineMail className="text-gray-500" /> {user?.email}</span>
            <span className="flex items-center gap-1"><BsTelephone className="text-gray-500" /> {user?.number}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          {company.description}
        </p>
      </div>

      {/* Services */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Services</h2>
        </div>

        {services.length === 0 ? (
          <p className="text-sm text-gray-500">No services listed.</p>
        ) : (
          <ul className="space-y-2">
            {services.map((service: any) => (
              <li
                key={service.id}
                className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md"
              >
                <span className="text-sm text-gray-700">{service.serviceName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CompanyProfilePage;
