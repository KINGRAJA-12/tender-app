'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CiClock1 } from 'react-icons/ci';
import { axiosInstance } from '@/axiosInstance';
import { ClipLoader } from 'react-spinners';

const RejectedPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRejectedApplications = async () => {
    try {
      const res = await axiosInstance.get('/apply/get-rejected-application');
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching rejected applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRejectedApplications();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <ClipLoader size={50} />
      </div>
    );
  }

  return (
    <div className="w-2/3 flex flex-col justify-start items-center gap-4 mx-auto py-6">
      <div className="w-full h-20 rounded-xl shadow bg-white flex justify-center items-center">
        <h1 className="uppercase font-bold text-blue-600">Rejected Applications</h1>
      </div>

      {applications&&applications.length === 0 ? (
        <div className="text-center text-gray-500 mt-4">No rejected applications found.</div>
      ) : (
        applications.map((app:any) => (
          <div
            key={app.id}
            className="w-full rounded-xl shadow-md bg-white p-6 flex flex-col gap-4 hover:shadow-lg transition"
          >
            <div>
              <h2 className="text-lg font-semibold text-blue-800">{app.tender.postedCompany.companyName || 'Company Name'}</h2>
              <p className="text-sm text-gray-600">{app.role || 'Tender Role'}</p>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              <strong>Your Proposal</strong>
              <p className="mt-1">{app.tender.title}</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CiClock1 className="text-lg" />
                <span>
                  Applied on: <span className="font-medium text-gray-700">{new Date(app.createdAt).toLocaleDateString()}</span>
                </span>
              </div>
              <div>
                Status: <span className="font-semibold text-red-600 capitalize">{app.status}</span>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <Link
                href={`/home/view-tender/${app.tenderId}`}
                className="inline-block text-blue-600 hover:underline text-sm font-medium"
              >
                View Tender →
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RejectedPage;
