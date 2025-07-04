'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { CiClock1 } from 'react-icons/ci';
import { MdDelete, MdEdit } from 'react-icons/md';
import { ClipLoader } from 'react-spinners';
import { axiosInstance } from '@/axiosInstance';
import { toast } from 'react-hot-toast';

const PendingPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get('/apply/get-pending-application');
      console.log(res.data)
      setApplications(res.data);
    } catch (err) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/apply/delete-application/${id}`);
      toast.success('Application deleted');
      setApplications(applications.filter((a) => a.id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete application');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (id) => {
    try {
      setIsUpdating(true);
      await axiosInstance.post(`/apply/update-application/${id}`, {
        message: editedText,
      });
      toast.success('Application updated');
      setEditingId(null);
      fetchApplications();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update application');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <ClipLoader size={50} />
      </div>
    );
  }

  return (
    <div className="w-full md:w-2/3 p-4 flex flex-col items-center gap-6 mx-auto">
      <div className="w-full h-20 rounded-xl shadow bg-white flex items-center justify-center px-4">
        <h1 className="uppercase font-bold text-blue-600 text-xl tracking-wider">
          Pending Applications
        </h1>
      </div>

      {applications.length === 0 ? (
        <div className="text-gray-500">No pending applications found.</div>
      ) : (
        applications.map((app) => (
          <div
            key={app.id}
            className="w-full rounded-xl shadow-md bg-white p-6 flex flex-col gap-4 hover:shadow-lg transition"
          >
            <div>
              <h2 className="text-lg font-semibold text-blue-800">{app.tender.postedCompany.companyName || 'Company Name'}</h2>
              <p className="text-sm text-gray-600">{app.tender.title || 'Web Developer'}</p>
            </div>

            {editingId !== app.id ? (
              <div className="text-sm text-gray-700 leading-relaxed">
                <strong>Your Proposal</strong>
                <p className="mt-1">{app.message}</p>
              </div>
            ) : (
              <div>
                <textarea
                  className="w-full h-24 border border-gray-300 rounded-lg p-2 resize-none text-sm"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleSave(app.id)}
                    className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-200 text-sm px-3 py-1 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
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
                <span className="font-semibold text-yellow-600 capitalize">{app.status}</span>
              </div>
            </div>

            <div className="flex flex-row gap-4 items-center">
              <Link
                href={`/home/view-tender/${app.tenderId}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                View Tender →
              </Link>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(app.id)}
                disabled={isDeleting}
              >
                <MdDelete size={17} />
              </button>
              <button
                className="text-yellow-500 hover:text-yellow-700"
                onClick={() => {
                  setEditingId(app.id);
                  setEditedText(app.message);
                }}
              >
                <MdEdit size={17} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingPage;
