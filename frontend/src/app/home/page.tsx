"use client";

import React, { useState, useEffect } from 'react';
import { axiosInstance } from '@/axiosInstance';
import { ClipLoader } from 'react-spinners';
import TenderCard from '@/companents/TenderCard';
import { MdSearch } from 'react-icons/md';

const TenderPage = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [tenders, setTenders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/tender/get-home-tenders');
        setTenders(res.data);
        console.log(res?.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTenders = tenders.filter(tender =>
    tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tender.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <ClipLoader size={50} />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-10 px-4 md:px-10">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Available Tenders</h1>

      <div className="flex items-center gap-2 w-full md:w-1/2 mb-6 p-2 border border-gray-300 rounded shadow-sm bg-white">
        <MdSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by title, description, or company"
          className="w-full outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredTenders.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">No tenders found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredTenders.map((tender, idx) => (
            <TenderCard
              key={idx}
              id={tender?.id}
              title={tender.title}
              description={tender.description}
              deadline={tender.deadline}
              tenderDate={tender.tenderDate}
              budget={tender.budget}
              status={tender.status}
              company={tender.companyName || 'Unknown Company'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TenderPage;
