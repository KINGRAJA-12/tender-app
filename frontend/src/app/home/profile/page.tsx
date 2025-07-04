'use client';

import { ClipLoader } from 'react-spinners';
import { axiosInstance } from '@/axiosInstance';
import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete, MdAdd, MdSave } from 'react-icons/md';
import { HiOutlineMail } from 'react-icons/hi';
import { BsTelephone } from 'react-icons/bs';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState('');
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [editedServiceName, setEditedServiceName] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [logo, setLogo] = useState('');
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleting,setIsDeleting]=useState(false);
  const [isEditingServices,setIsEditingServices]=useState(false);
  const [isEdit,setIsEdit]=useState(false);
  const [isServiceAdding,setIsServiceAdding]=useState(false);
  const [id,setId]=useState<number|null>(null)
  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get('/service/get-all-service');
      console.log(res?.data?.services);
      setServices(res.data.services);

      const companyRes = await axiosInstance.get('/auth/getme');
      console.log(companyRes?.data);
      setCompanyName(companyRes?.data?.company?.companyName);
      setAddress(companyRes?.data?.company?.address);
      setDescription(companyRes?.data?.company?.description);
      setEmail(companyRes?.data?.user?.email);
      setPhone(companyRes?.data?.user?.number);
      setLogo(companyRes?.data?.company?.logo);
    } catch (err:any) {
      console.log(err?.message)
      toast.error(err?.response?.data?.message||'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAddService = async () => {
    if (!newService.trim()) return;
    try {
      setIsServiceAdding(true)
      const res = await axiosInstance.post('/service/add-service', { serviceName: newService });
      console.log(res?.data)
      setServices([...services, res.data.service]);
      setNewService('');
      toast.success('Service added');
    } catch(err:any) {
      toast.error(err?.response?.data?.message||'Failed to fetch data');
    }finally{
      setIsServiceAdding(false)
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(true)
      setId(id)
      await axiosInstance.get(`/service/delete-service/${id}`);

      setServices(services.filter((s:any) => s.id !== id));
      toast.success('Service deleted');
    } catch(err:any) {
      toast.error(err?.response?.data?.message||'Failed to delete service');
    }finally{
      setIsDeleting(false)
    }
  };

  const handleEditService = (id: number, name: string) => {
    setEditingServiceId(id);
    setEditedServiceName(name);
  };

  const handleUpdateService = async () => {
    try {
      setIsEditingServices(true)
      await axiosInstance.post(`/service/update-service/${editingServiceId}`, {
        serviceName: editedServiceName
      });
      setServices((prev:any) =>
        prev.map((s:any) => (s.id === editingServiceId ? { ...s, serviceName: editedServiceName } : s))
      );
      toast.success('Service updated');
    } catch(err:any) {
      toast.error(err?.response?.data?.message||'Failed to update service');
    } finally {
      setEditingServiceId(null);
      setEditedServiceName('');
      setIsEditingServices(false)
    }
  };

  const handleCompanySave = async () => {
    try {
      setIsEdit(true)
      await axiosInstance.post('/company/update-profile', {
        companyName,
        address,
        description
      });
      toast.success('Company profile updated');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsEditingCompany(false);
      setIsEdit(false)
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
    <div className="min-h-screen bg-[#f3f2ef] py-10 px-4 md:px-10 space-y-8">
      {/* Company Header */}
      <div className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row gap-6 items-start md:items-center">
        <img
          src={logo || 'https://via.placeholder.com/80x80?text=Logo'}
          alt="Company Logo"
          className="w-20 h-20 rounded-full border"
        />
        <div className="flex-1 space-y-2 w-full">
          {isEditingCompany ? (
            <>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="text-xl font-bold border p-2 rounded w-full"
              />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="text-sm text-gray-600 border p-2 rounded w-full"
              />
              <button
                onClick={handleCompanySave}
                className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
              >
                {isEdit?<ClipLoader/>:<><MdSave className="inline mr-1" /> Save</>}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">{companyName}</h1>
                <button
                  onClick={() => setIsEditingCompany(true)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <MdEdit />
                </button>
              </div>
              <p className="text-sm text-gray-600">{address}</p>
              <div className="flex gap-6 text-sm text-gray-600 flex-wrap">
                <span className="flex items-center gap-1"><HiOutlineMail /> {email}</span>
                <span className="flex items-center gap-1"><BsTelephone /> {phone}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
        {isEditingCompany ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-sm text-gray-700 border p-2 rounded w-full"
            rows={4}
          />
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
        )}
      </div>

      {/* Services */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Services</h2>

        {/* Services List */}
        <div className="space-y-2">
          {services.map((service:any) => (
            <div
              key={service.id}
              className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md"
            >
              {editingServiceId === service.id ? (
                <div className="flex w-full gap-2 items-center">
                  <input
                    className="border p-1 rounded w-full text-sm"
                    value={editedServiceName}
                    onChange={(e) => setEditedServiceName(e.target.value)}
                  />
                  <button
                    onClick={handleUpdateService}
                    className="text-green-600 text-sm"
                  >
                    {isEditingServices?<ClipLoader/>:"Save"}
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-sm text-gray-700">{service.serviceName}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditService(service.id, service.serviceName)}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <MdEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      {isDeleting&&id==service?.id?<ClipLoader/>:<MdDelete />}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add Service */}
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newService}
            onChange={(e) => setNewService(e.target.value)}
            placeholder="New service..."
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <button
            onClick={handleAddService}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
          >
           {isServiceAdding?<ClipLoader/>:<><MdAdd /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
