'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import { CiClock1 } from 'react-icons/ci';
import { MdDelete, MdEdit } from 'react-icons/md';
import { ClipLoader } from 'react-spinners';
import { axiosInstance } from '@/axiosInstance';
import toast from 'react-hot-toast';

const ApplicationPage = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [proposalText, setProposalText] = useState('');
  const [isUpdating,setIsUpdating]=useState(false);
  const [isDeleting,setIsDeleting]=useState(false);
  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get('/apply/get-my-applications');
      setApplications(res.data.applications);
    } catch (err) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleSave = async (id: number) => {
    try {
      setIsUpdating(true)
      await axiosInstance.post(`/apply/update-application/${id}`, {
        message: proposalText
      });
      toast.success('Application updated');
      setEditingId(null);
      fetchApplications();
    } catch(err:any){
      toast.error(err?.response?.data?.message||'Failed to update application');
    }finally{
      setIsUpdating(false)
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true)
      await axiosInstance.delete(`/apply/delete-application/${id}`);
      toast.success('Application deleted');
      setApplications(applications.filter((a) => a.id !== id));
    } catch(err:any){
      toast.error(err?.response?.data?.message||'Failed to delete application');
    }finally{
      setIsDeleting(true)
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <ClipLoader size={50} />
      </div>
    );
  }

  return (
    <div className="w-full md:w-2/3 p-4 flex flex-col items-center gap-6 mx-auto">
      <div className="w-full h-20 rounded-xl shadow bg-white flex items-center px-4 gap-3">
        <input
          type="text"
          placeholder="Search..."
          className="flex-grow border border-gray-300 h-10 p-2 rounded-xl outline-none"
        />
        <button className="text-black">
          <FaSearch size={20} />
        </button>
      </div>

      {applications.map((app) => (
        <div
          key={app.id}
          className="w-full rounded-xl shadow-md bg-white p-6 flex flex-col gap-4 hover:shadow-lg transition"
        >
          <div>
            <h2 className="text-lg font-semibold text-blue-800">{app.tender.postedCompany.companyName || 'Your Company'}</h2>
            <p className="text-sm text-gray-600">{app.tender.title || 'Tender Title'}</p>
          </div>

          {editingId === app.id ? (
            <div className="text-sm">
              <textarea
                className="w-full h-24 border border-gray-300 rounded-lg p-2 resize-none text-sm"
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
              />
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleSave(app.id)}
                  className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                >
                  {isUpdating?<ClipLoader/>:"Save"}
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700 leading-relaxed">
              <strong>Your Proposal</strong>
              <p className="mt-1">{app.message}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <CiClock1 className="text-lg" />
              <span>
                Applied on:{' '}
                <span className="font-medium text-gray-700">{new Date(app.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
            <div>
              Status:{' '}
              <span className="font-semibold text-yellow-600 capitalize">
                {app.status || 'Open'}
              </span>
            </div>
          </div>

          <div className="flex flex-row gap-4">
            <Link
              href={`/home/view-tender/${app.tenderId}`}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              View Tender →
            </Link>
            {!app.tender.allocatedTo&&<>
            <button
              onClick={() => handleDelete(app.id)}
              className="text-red-500 hover:text-red-700"
            >
             {isDeleting?<ClipLoader/>: <MdDelete size={18} />}
            </button>
            <button
              onClick={() => {
                setEditingId(app.id);
                setProposalText(app.message);
              }}
              className="text-yellow-500 hover:text-yellow-700"
            >
              <MdEdit size={18} />
            </button></>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationPage;