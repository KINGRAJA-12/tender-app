'use client';

import Link from 'next/link';
import React from 'react';
import { CiClock1 } from 'react-icons/ci';

interface TenderProps {
  id:number,
  title: string;
  description: string;
  deadline: string;
  budget: number;
  tenderDate: string;
  status: string;
  company: string;
}

const TenderCard: React.FC<TenderProps> = ({
  id,
  title,
  description,
  deadline,
  budget,
  tenderDate,
  status,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all w-full border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <span className="text-xs text-yellow-600 capitalize font-semibold bg-yellow-100 px-2 py-0.5 rounded">
          {status}
        </span>
      </div>

      {/* Description (preview) */}
      <p className="text-sm text-gray-700 mt-3 line-clamp-3">
        {description}
      </p>

      {/* Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 text-sm text-gray-600 gap-y-1">
        <p>
          <strong>Budget:</strong> ₹{budget.toLocaleString()}
        </p>
        <p>
          <strong>Tender Date:</strong> {new Date(tenderDate).toLocaleDateString()}
        </p>
        <p className="flex items-center gap-2 col-span-2 sm:col-span-1">
          <CiClock1 />
          <span>
            <strong>Deadline:</strong> {new Date(deadline).toLocaleDateString()}
          </span>
        </p>
      </div>
      <div className="mt-5">
        <Link
          className="text-blue-600 font-medium text-sm hover:underline transition"
          href={`/home/view-tender/${id}`}
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default TenderCard;
