import React from 'react';
import { FaPen, FaTrashAlt, FaFilePdf, FaLock } from 'react-icons/fa';
import { MdAddCircleOutline } from 'react-icons/md';
import Sidebar from "../components/Sidebar";  
const ProfilePage = () => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Profile Information */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="https://via.placeholder.com/80"
                alt="Profile"
                className="rounded-full w-20 h-20 mr-4"
              />
              <div>
                <h2 className="text-xl font-bold">Diane Smith</h2>
                <p className="text-gray-600">Executive Assistant</p>
                <p className="text-gray-600">Law Firm: Great Law Firm</p>
                <p className="text-gray-600">Email: diane@glf.com</p>
                <p className="text-gray-600">Phone Number: (678) 205-3421</p>
                <p className="text-gray-600 flex items-center">
                  Member ID: BX34529 <FaLock className="ml-2" />
                </p>
              </div>
            </div>
            <button className="text-blue-500 flex items-center">
              <FaPen className="mr-2" />
              Edit
            </button>
          </div>
        </div>

        {/* Billing Information */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Oliver Liam</h2>
              <p className="text-gray-600">Company Name: Great Law Firm</p>
              <p className="text-gray-600">Email Address: oliver@glf.com</p>
              <p className="text-gray-600">Billing Address: 1245 W Elm Street Tampa FL 82124</p>
            </div>
            <div className="flex items-center">
              <button className="text-red-500 flex items-center mr-4">
                <FaTrashAlt className="mr-2" />
                Delete
              </button>
              <button className="text-blue-500 flex items-center">
                <FaPen className="mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src="https://via.placeholder.com/40"
                alt="Card"
                className="w-10 h-10 mr-4"
              />
              <div>
                <p className="text-gray-600">**** **** **** 7852</p>
              </div>
            </div>
            <div className="flex items-center">
              <button className="text-blue-500 flex items-center mr-4">
                <FaPen className="mr-2" />
                Edit
              </button>
              <button className="text-blue-500 flex items-center">
                <MdAddCircleOutline className="mr-2" />
                Add New Card
              </button>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Transactions</h2>
            <button className="text-pink-500">View All</button>
          </div>
          <ul>
            {[
              { date: 'March, 01 2020', id: 'MS-415646', amount: '$180' },
              { date: 'February, 10 2021', id: 'RV-126749', amount: '$250' },
              { date: 'April, 05 2020', id: 'FB-212562', amount: '$560' },
              { date: 'June, 25 2019', id: 'QW-103578', amount: '$120' },
              { date: 'March, 01 2020', id: 'AR-803481', amount: '$300' },
            ].map((transaction, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <div>
                  <p className="text-gray-600">{transaction.date}</p>
                  <p className="text-gray-400">{transaction.id}</p>
                </div>
                <div className="flex items-center">
                  <p className="text-gray-600 mr-4">{transaction.amount}</p>
                  <button className="text-gray-500 flex items-center">
                    <FaFilePdf className="mr-2" />
                    PDF
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
