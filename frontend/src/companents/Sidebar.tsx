import Link from 'next/link';
import React from 'react';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { MdListAlt, MdPending } from 'react-icons/md';

const Sidebar: React.FC = () => {
  const statusTabs = [
    { label: 'All', icon: <MdListAlt />, href: '/home/applications' },
    { label: 'Accepted', icon: <AiOutlineCheckCircle />, href: '/home/applications/accepted' },
    { label: 'Rejected', icon: <AiOutlineCloseCircle />, href: '/home/applications/rejected' },
    { label: 'Pending', icon: <MdPending />, href: '/home/applications/pending' },
  ];

  return (
    <div className="md:w-1/3 w-full md:min-h-[300px] h-20 rounded-xl shadow-lg shadow-salt-100 bg-white border-r border-gray-300 flex flex-wrap md:flex-col gap-3 p-4">
      {statusTabs.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className="flex items-center gap-1 text-black hover:text-blue-600 transition"
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-sm">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
