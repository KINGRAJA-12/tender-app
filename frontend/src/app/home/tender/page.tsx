"use client";

import React, { useState, useEffect } from 'react';
import {
  MdEdit,
  MdDelete,
  MdClose,
  MdAdd,
  MdEvent,
  MdAttachMoney,
  MdTitle,
  MdDescription,
} from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import toast from 'react-hot-toast';
import { ClipLoader } from 'react-spinners';
import { axiosInstance } from '@/axiosInstance';
import Link from 'next/link';

interface Tender {
  id: number;
  title: string;
  description: string;
  deadline: string;
  budget: string;
  status: string;
  tenderDate: string;
}

const TenderManager: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tenderDate, setTenderDate] = useState('');
  const [budget, setBudget] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTender, setEditedTender] = useState<Partial<Tender>>({});
  const [isEdiitng,setIsEditing]=useState(false);
  const [isDeleteing,setIsDeleting]=useState(false);
  const [isClosing,setIsClosing]=useState(false);
  const [id,setId]=useState<number|null>(null)

  const fetchTenders = async () => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.get('/tender/get-all-tenders');
      console.log(res?.data)
      setTenders(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch tenders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  const handleCreate = async () => {
    try {
      setIsCreating(true);
      if (!title || !description || !deadline || !tenderDate || !budget) {
        return toast.error('All fields are required');
      }
      let res=await axiosInstance.post('/tender/create-tender', {
        title,
        description,
        deadline,
        budget,
        tenderDate,
      });
      toast.success('Tender created');
      setTitle('');
      setDescription('');
      setDeadline('');
      setTenderDate('');
      setBudget('');
      setIsVisible(false);
      fetchTenders();
    } catch (err:any) {
      console.error(err);
     toast.error(err?.response?.data?.message || 'Failed to create tender');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      setIsEditing(true);
      await axiosInstance.post(`/tender/update-tender/${id}`, editedTender);
      toast.success('Tender updated');
      setEditingId(null);
      setEditedTender({});
      fetchTenders();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update tender');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setId(id)
      setIsDeleting(true);
      await axiosInstance.get(`/tender/delete-tender/${id}`);
      toast.success('Tender deleted');
      fetchTenders();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete tender');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = async (id: number) => {
    try {
      setIsClosing(true);
      await axiosInstance.get(`/tender/close-tender/${id}`);
      toast.success('Tender closed');
      fetchTenders();
    } catch (err) {
      console.error(err);
      toast.error('Failed to close tender');
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] py-8 px-4 md:px-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Tenders</h1>
        <button
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? 'Close' : <><MdAdd /> Create Tender</>}
        </button>
      </div>

      {isVisible && (
        <div className="bg-white p-4 rounded shadow space-y-3 border">
          <div className="flex items-center gap-2">
            <MdTitle className="text-gray-500" />
            <input
              type="text"
              placeholder="Title"
              className="border p-2 w-full rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex items-start gap-2">
            <MdDescription className="text-gray-500 mt-2" />
            <textarea
              placeholder="Description"
              className="border p-2 w-full rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <MdEvent className="text-gray-500" />
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <MdEvent className="text-gray-500" />
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={tenderDate}
              onChange={(e) => setTenderDate(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <MdAttachMoney className="text-gray-500" />
            <input
              type="number"
              placeholder="Budget"
              className="border p-2 w-full rounded"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleCreate}
            disabled={isCreating}
          >
            {isCreating ? <ClipLoader size={20} color="#fff" /> : 'Submit Tender'}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-10">
          <ClipLoader size={40} color="#2563eb" />
        </div>
      ) : tenders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg font-medium pt-10">
          No tenders found.
        </div>
      ) : (
        tenders.map((tender:any) => (
          <div key={tender.id} className="bg-white p-6 rounded-lg shadow-sm space-y-2">
            {editingId === tender.id ? (
              <>
                <input
                  className="border p-2 w-full rounded"
                  value={editedTender.title ?? tender.title}
                  onChange={(e) => setEditedTender({ ...editedTender, title: e.target.value })}
                />
                <textarea
                  className="border p-2 w-full rounded"
                  value={editedTender.description ?? tender.description}
                  onChange={(e) => setEditedTender({ ...editedTender, description: e.target.value })}
                />
                <input
                  type="date"
                  className="border p-2 w-full rounded"
                  value={editedTender.deadline ?? tender.deadline.split('T')[0]}
                  onChange={(e) => setEditedTender({ ...editedTender, deadline: e.target.value })}
                />
                <input
                  type="number"
                  className="border p-2 w-full rounded"
                  value={editedTender.budget ?? tender.budget}
                  onChange={(e) => setEditedTender({ ...editedTender, budget: e.target.value })}
                />
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => handleUpdate(tender.id)}
                    className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700"
                  >
                    {isEdiitng?<ClipLoader/>:"Save"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditedTender({});
                    }}
                    className="bg-gray-400 text-white px-4 py-1.5 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">{tender.title}</h2>
                  <span className={`text-xs font-bold uppercase ${tender.status === 'close' ? 'text-red-500' : 'text-green-600'}`}>
                    {tender.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{tender.description}</p>
                <div className="text-sm text-gray-500">
                  <MdEvent className="inline mr-1" /> Deadline: <span className="font-medium">{tender.deadline.split('T')[0]}</span> |
                  <MdAttachMoney className="inline mx-1" /> Budget: ₹<span className="font-medium">{tender.budget}</span>
                </div>
                <div className="text-sm text-gray-500">
                  <MdEvent className="inline mr-1" /> Tender Date: <span className="font-medium">{tender.tenderDate.split('T')[0]}</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                 {!tender.allocatedTo&&<><button
                    onClick={() => {
                      setEditingId(tender.id);
                      setEditedTender(tender);
                    }}
                    className="text-yellow-600 hover:text-yellow-800 flex items-center gap-1"
                  >
                    <MdEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tender.id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                   {isDeleteing&&id==tender?.id?<ClipLoader/>:<> <MdDelete /> Delete</>}
                  </button></>}
                  <Link href={`/home//view-appliactions/${tender?.id}`} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <FaEye /> View Applications
                  </Link>
                  <Link href={`/home/company-profile/${tender?.company?.id}`} className="text-purple-600 hover:text-purple-800 flex items-center gap-1">
                    <IoMdSend /> {tender?.company?.companyName}
                  </Link>
                  {!tender.allocatedTo&&
                  <button
                    onClick={() => handleClose(tender.id)}
                    className="text-gray-600 hover:text-black flex items-center gap-1"
                  >
                    {isClosing?<ClipLoader/>:<><MdClose /> Close</>}
                  </button>}
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TenderManager;
