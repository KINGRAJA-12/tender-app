'use client';

import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { axiosInstance } from '@/axiosInstance';
import toast from 'react-hot-toast';
import Link from 'next/link';

const TenderDetailsPage = () => {
  const [proposal, setProposal] = useState('');
  const [tender, setTender] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [isApply,setIsApply]=useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const tenderRes = await axiosInstance.get(`/tender/view-tender/${id}`);
        const appRes = await axiosInstance.get(`/tender/get-all-application-to-tender/${id}`);
        setTender(tenderRes.data);
        setParticipants(appRes.data);
        console.log(appRes.data)
      } catch (err) {
        toast.error('Failed to load tender or applications');
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!proposal.trim()) return toast.error('Proposal is required');
    try {
      setIsApply(true)
      const res = await axiosInstance.post('/apply/apply-tender', {
        tenderId: id,
        message: proposal,
      });
      toast.success(res?.data?.message || 'Application submitted');
      setProposal('');
    } catch (err: any) {
      console.log(err?.message)
      toast.error(err?.response?.data?.message || 'Failed to apply');
    }finally{
      setIsApply(false)
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <ClipLoader size={50} />
      </div>
    );
  }

  if (!tender) {
    return <div className="text-center text-gray-500 mt-10">Tender not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-10 px-4 md:px-10 flex flex-col gap-6">
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <img
          src={tender.postedCompany?.logo || 'https://via.placeholder.com/50x50?text=Logo'}
          alt="Company Logo"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h1 className="text-xl font-bold text-gray-800">{tender.postedCompany?.companyName || 'Company Name'}</h1>
          <p className="text-sm text-gray-500">Posted by</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-blue-800">{tender.title}</h2>
          <p className="text-sm text-gray-600">Result Date: <strong>{new Date(tender.tenderDate).toLocaleDateString()}</strong></p>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">
          {tender.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
          <p><strong>Budget:</strong> ₹{Number(tender.budget).toLocaleString()}</p>
          <p><strong>Deadline:</strong> {new Date(tender.deadline).toLocaleDateString()}</p>
          <p>
            <strong>Status:</strong>
            <span className={`ml-2 font-semibold ${tender.status === 'close' ? 'text-red-600' : 'text-green-600'}`}>{tender.status}</span>
          </p>
          <p><strong>Tender ID:</strong> #{tender.id}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
        <h3 className="font-semibold text-gray-800">Applied Vendors</h3>
        {participants.length === 0 ? (
          <p className="text-sm text-gray-500">No participants have applied yet.</p>
        ) : (
          <div className="flex gap-4 flex-wrap">
            {participants.map((vendor, idx) => (
              <Link
               href={`/home/company-profile/${vendor?.participant?.id}`}
                key={vendor.id || idx}
                className="flex items-center gap-2 border border-gray-200 p-2 rounded-md bg-gray-50"
              >
                <img
                  src={vendor?.participant?.logo}
                  alt="Vendor Logo"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">{vendor?.participant?.companyName}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Apply Box */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-3">
        <h3 className="font-semibold text-gray-800">Submit Your Proposal</h3>
        <textarea
          value={proposal}
          onChange={(e) => setProposal(e.target.value)}
          className="w-full h-28 border border-gray-300 rounded-lg p-3 text-sm resize-none outline-blue-400"
          placeholder="Write your detailed proposal here..."
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium"
        >
          {isApply?<ClipLoader/>:"Submit Proposal"}
        </button>
      </div>
    </div>
  );
};

export default TenderDetailsPage;
