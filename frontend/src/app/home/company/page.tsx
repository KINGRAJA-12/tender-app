'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { axiosInstance } from '@/axiosInstance';
import { ClipLoader } from 'react-spinners';

interface Company {
  id: number;
  companyName: string;
  description: string;
  logo: string;
}

const CompanyList = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/company/get-all-company');
        setCompanies(res.data);
      } catch (err) {
        console.error('Error fetching companies', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <ClipLoader size={50} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f3f2ef] p-6 md:p-10 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Companies</h1>

      <div className="space-y-4">
        {companies && companies.length > 0 ? (
          companies.map((company) => (
            <div
              key={company.id}
              className="bg-white p-4 md:p-6 rounded-xl shadow hover:shadow-md transition border border-gray-200 flex items-center gap-4 justify-between"
            >
              {/* Left section: logo + info */}
              <div className="flex items-center gap-4">
                <img
                  src={company?.logo}
                  alt={`${company.companyName} Logo`}
                  className="w-12 h-12 rounded-full border"
                />
                <div>
                  <h2 className="text-lg font-semibold text-blue-800">
                    {company?.companyName}
                  </h2>
                  <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                    {company?.description}
                  </p>
                </div>
              </div>

              {/* Right section: link */}
              <div>
                <Link
                  href={`/home/company-profile/${company.id}`}
                  className="text-blue-600 text-sm hover:underline font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div>No company information is found</div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
