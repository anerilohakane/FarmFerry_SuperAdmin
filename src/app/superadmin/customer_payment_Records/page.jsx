'use client'

import { useState, useEffect } from 'react'
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
  FiUser,
  FiDollarSign as FiRupee
} from 'react-icons/fi'
import { FaGooglePay } from 'react-icons/fa'
import { SiPaytm, SiRazorpay } from 'react-icons/si'

export default function PaymentRecords() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000'}/api/v1`

  const getAuthHeaders = () => {
    const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  const fetchPaymentRecords = async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.append('search', searchQuery.trim())
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (paymentMethodFilter !== 'all') params.append('method', paymentMethodFilter)
      const res = await fetch(`${API_BASE_URL}/payments?${params.toString()}`, { headers: getAuthHeaders() })
      if (!res.ok) throw new Error('Failed to fetch payment records')
      const data = await res.json()
      const list = Array.isArray(data?.data?.records)
        ? data.data.records
        : Array.isArray(data?.records)
          ? data.records
          : Array.isArray(data)
            ? data
            : []
      setRecords(list)
    } catch (e) {
      setError(e.message || 'Failed to load payment records')
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentRecords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchPaymentRecords(), 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, paymentMethodFilter])

  const getDisplayId = (r) => r.paymentId || r.id || r.transactionId || ''
  const getDisplayCustomer = (r) => {
    if (r.customer && typeof r.customer === 'object') {
      // First try to get name from customer.addresses[0].name
      if (r.customer.addresses?.[0]?.name) {
        return r.customer.addresses?.[0]?.name
      }
      // Fallback to customer.name if addresses name is not available
      if (r.customer.name) {
        return r.customer.name
      }
      // Try combining first and last name
      const full = `${r.customer.firstName || ''} ${r.customer.lastName || ''}`.trim()
      if (full) return full
    }
    return r.customerName || r.customer || 'Customer'
  }
  const getDisplayAmount = (r) => r.amount || r.totalAmount || 0
  const getDisplayMethod = (r) => r.method || r.paymentMethod || (r.payment && r.payment.method) || 'Unknown'
  const getDisplayDate = (r) => r.date || r.createdAt || ''
  const getDisplayStatus = (r) => r.status || r.paymentStatus || 'unknown'

  const filteredRecords = records.filter((r) => {
    const id = getDisplayId(r).toString().toLowerCase()
    const name = getDisplayCustomer(r).toString().toLowerCase()
    const matchesSearch =
      id.includes(searchQuery.toLowerCase()) ||
      name.includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || getDisplayStatus(r) === statusFilter
    const matchesMethod = paymentMethodFilter === 'all' || getDisplayMethod(r) === paymentMethodFilter
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
        return <span className="text-green-500 font-bold text-lg">₹</span>
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
      case 'paid': // Handle both 'completed' and 'paid' status
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" /> {status === 'paid' ? 'Paid' : 'Completed'}
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
            <span className="mr-1 font-bold">₹</span> Refunded
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status || 'Unknown'}
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
              <option value="paid">Paid</option>
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
              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-red-500">{error}</td>
                </tr>
              )}
              {!loading && !error && filteredRecords.map((record, idx) => (
                <tr key={getDisplayId(record) || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getDisplayId(record)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiUser className="flex-shrink-0 mr-2 text-gray-400" />
                      {getDisplayCustomer(record)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{getDisplayAmount(record).toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {getPaymentMethodIcon(getDisplayMethod(record))}
                      <span className="ml-2">{getDisplayMethod(record)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getDisplayDate(record)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(getDisplayStatus(record))}
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

