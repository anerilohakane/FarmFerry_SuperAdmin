'use client'

import { useState } from 'react'
import { 
  FiDollarSign, 
  FiFilter, 
  FiDownload, 
  FiSearch,
  FiCreditCard,
  FiPhone,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser
} from 'react-icons/fi'
import { FaGooglePay } from 'react-icons/fa'
import { SiPaytm, SiRazorpay } from 'react-icons/si'

export default function PaymentRecords() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')

  // Payment records data
  const paymentRecords = [
    {
      id: 'PYM-1001',
      customer: 'Rahul Sharma',
      orderId: 'ORD-2056',
      amount: 1250,
      date: '2023-06-15 10:30',
      status: 'completed',
      method: 'card',
      transactionId: 'txn_789456123'
    },
    {
      id: 'PYM-1002',
      customer: 'Priya Patel',
      orderId: 'ORD-2057',
      amount: 850,
      date: '2023-06-15 11:45',
      status: 'failed',
      method: 'upi',
      transactionId: 'txn_321654987'
    },
    {
      id: 'PYM-1003',
      customer: 'Amit Singh',
      orderId: 'ORD-2058',
      amount: 420,
      date: '2023-06-14 09:15',
      status: 'pending',
      method: 'wallet',
      transactionId: 'txn_654987321'
    },
    {
      id: 'PYM-1004',
      customer: 'Neha Gupta',
      orderId: 'ORD-2059',
      amount: 1560,
      date: '2023-06-14 14:20',
      status: 'completed',
      method: 'netbanking',
      transactionId: 'txn_987321654'
    },
    {
      id: 'PYM-1005',
      customer: 'Vikram Joshi',
      orderId: 'ORD-2060',
      amount: 920,
      date: '2023-06-13 16:50',
      status: 'refunded',
      method: 'upi',
      transactionId: 'txn_147258369'
    }
  ]

  // Filter payment records
  const filteredRecords = paymentRecords.filter(record => {
    const matchesSearch = 
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.orderId.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || record.status === statusFilter
    
    const matchesMethod = 
      paymentMethodFilter === 'all' || record.method === paymentMethodFilter
    
    return matchesSearch && matchesStatus && matchesMethod
  })

  // Payment method icons
  const getPaymentMethodIcon = (method) => {
    switch(method) {
      case 'card':
        return <FiCreditCard className="text-blue-500" />
      case 'upi':
        return <SiRazorpay className="text-indigo-600" />
      case 'wallet':
        return <FaGooglePay className="text-teal-500" />
      case 'netbanking':
        return <FiDollarSign className="text-green-500" />
      case 'paytm':
        return <SiPaytm className="text-blue-400" />
      default:
        return <FiDollarSign className="text-gray-500" />
    }
  }

  // Status badges
  const getStatusBadge = (status) => {
    switch(status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" /> Completed
          </span>
        )
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <FiXCircle className="mr-1" /> Failed
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FiClock className="mr-1" /> Pending
          </span>
        )
      case 'refunded':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <FiDollarSign className="mr-1" /> Refunded
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customer Payment Records</h1>
          <p className="text-gray-500">View and manage all payment transactions</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-4 md:mt-0">
          <FiDownload className="mr-2" /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md"
                placeholder="Search payments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter with border */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Payment Method Filter with border */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="wallet">Wallet</option>
              <option value="netbanking">Net Banking</option>
              <option value="paytm">Paytm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Records Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiUser className="flex-shrink-0 mr-2 text-gray-400" />
                      {record.customer}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{record.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(record.method)}
                      <span className="ml-2 capitalize">{record.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}