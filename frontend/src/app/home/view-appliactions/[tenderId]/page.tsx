"use client";

import React, { useState, useEffect } from 'react';
import {
  MdDone,
  MdCancel,
  MdSearch,
  MdArrowBack,
  MdBusiness,
  MdInfoOutline,
  MdAttachMoney,
  MdEvent,
  MdTitle,
  MdDescription,
  MdLocationOn,
  MdOutlineDescription
} from 'react-icons/md';
import { ClipLoader } from 'react-spinners';
import { axiosInstance } from '@/axiosInstance';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Application {
  id: number;
  message: string;
  status: string;
  companyId: number;
  tenderId: number;
  participant: {
    companyName: string;
    logo: string;
    address: string;
    description: string;
  };
  tender: {
    title: string;
    description: string;
    deadline: string;
    budget: number;
    allocatedTo: number | null;
    status: string;
  };
}

const ApplicationManager: React.FC = () => {
  const { tenderId } = useParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading,setLoad]=useState(false);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get(`/tender/get-all-application-to-tender/${tenderId}`);
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tenderId) fetchApplications();
  }, [tenderId]);

  const handleStatusChange = async (id: number, status: 'accept' | 'reject') => {
    try {
      const endpoint =
        status === 'accept'
          ? `/apply/accept-application/${id}`
          : `/apply/reject-application/${id}`;
        setLoad(true)
      await axiosInstance.get(endpoint);
      toast.success(`Application ${status === 'accept' ? 'accepted' : 'rejected'} successfully`);
      fetchApplications();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || `Failed to ${status === 'accept' ? 'accept' : 'reject'} application`
      );
    }finally{
      setLoad(false);
    }
  };

  const filteredApps = applications.filter(app =>
    app.participant?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/home/tender" className="text-gray-600 hover:text-black flex items-center gap-1">
          <MdArrowBack /> Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-800 ml-4">Applications for Tenders</h1>
      </div>

      <div className="flex items-center gap-2 bg-white rounded px-3 py-2 shadow w-full md:w-1/2">
        <MdSearch className="text-gray-400" />
        <input
          type="text"
          placeholder="Search by company name"
          className="w-full outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <ClipLoader size={40} color="#2563eb" />
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center text-gray-500 text-lg font-medium pt-10">
          No applications found.
        </div>
      ) : (
        filteredApps.map((app) => (
          <div key={app.id} className="bg-white rounded shadow p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MdBusiness /> {app.participant?.companyName || `Company ${app.companyId}`}
              </p>
              <div className="flex items-center gap-2">
                {app.tender.status === "open" && app.status === "pending" ? (
                loading?<ClipLoader/>:<>
                    <button
                      onClick={() => handleStatusChange(app.id, 'accept')}
                      className="text-green-600 hover:text-green-800"
                      title="Allocate Tender"
                    >
                      <MdDone size={24} />
                    </button>
                    <button
                      onClick={() => handleStatusChange(app.id, 'reject')}
                      className="text-red-600 hover:text-red-800"
                      title="Decline Tender"
                    >
                      <MdCancel size={24} />
                    </button>
                  </>
                ) : (
                  <span
                    className={`font-medium px-2 py-1 rounded ${
                      app.status === 'accept'
                        ? 'text-green-700 bg-green-100'
                        : 'text-red-700 bg-red-100'
                    }`}
                  >
                    {app.status === 'accept' ? 'ACCEPTED' : 'REJECTED'}
                  </span>
                )}
                <button className="text-blue-600 hover:text-blue-800" title="View Organization">
                  <MdInfoOutline size={24} />
                </button>
              </div>
            </div>

            <p className="text-gray-700 mt-1">{app.message}</p>

            <div className="border-t pt-2 mt-2 space-y-1">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MdTitle className="text-gray-500" /> <span className="font-semibold">Tender:</span> {app.tender?.title || '-'}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MdDescription className="text-gray-500" /> {app.tender?.description || '-'}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MdEvent className="text-gray-500" /> Deadline: {app.tender?.deadline?.split('T')[0] || '-'}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MdAttachMoney className="text-gray-500" /> Budget: ₹{app.tender?.budget || '-'}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MdLocationOn className="text-gray-500" /> {app.participant?.address || '-'}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MdOutlineDescription className="text-gray-500" /> {app.participant?.description || '-'}
              </p>
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium uppercase">{app.status}</span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ApplicationManager;
