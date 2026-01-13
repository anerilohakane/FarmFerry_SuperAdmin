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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [recordsPerPage, setRecordsPerPage] = useState(10)

  const API_BASE_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api/v1'
    : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://farm-ferry-backend-new.vercel.app/api/v1')

  const getAuthHeaders = () => {
    const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  const fetchPaymentRecords = async (page = currentPage) => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.append('search', searchQuery.trim())
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (paymentMethodFilter !== 'all') params.append('method', paymentMethodFilter)
      
      // Add pagination parameters
      params.append('page', page.toString())
      params.append('limit', recordsPerPage.toString())
      
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
      
      // Update pagination info
      if (data?.data?.pagination) {
        setTotalPages(data.data.pagination.totalPages || 1)
        setTotalRecords(data.data.pagination.totalRecords || list.length)
      } else {
        setTotalPages(1)
        setTotalRecords(list.length)
      }
      
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
    const t = setTimeout(() => {
      setCurrentPage(1) // Reset to first page when filters change
      fetchPaymentRecords(1)
    }, 400)
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
  const getDisplayStatus = (r) => {
    // If order status is returned but payment was made, show as "Paid (Returned)"
    if (r.status === 'returned' && r.paymentStatus === 'paid') {
      return 'paid_returned'
    }
    return r.status || r.paymentStatus || 'unknown'
  }

  // Pagination functions
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    fetchPaymentRecords(newPage)
  }

  const handleRecordsPerPageChange = (newLimit) => {
    setRecordsPerPage(newLimit)
    setCurrentPage(1)
    fetchPaymentRecords(1)
  }

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
      case 'returned':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <FiXCircle className="mr-1" /> Returned
          </span>
        )
      case 'paid_returned':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <FiCheckCircle className="mr-1" /> Paid (Returned)
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
          <p className="text-gray-500">
            View and manage all payment transactions
            {totalRecords > 0 && (
              <span className="ml-2 text-green-600 font-medium">
                ({totalRecords} total records)
              </span>
            )}
          </p>
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
              <option value="returned">Returned</option>
              <option value="paid_returned">Paid (Returned)</option>
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

      {/* Pagination Controls */}
      {!loading && !error && totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">{(currentPage - 1) * recordsPerPage + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * recordsPerPage, totalRecords)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{totalRecords}</span>
                {' '}results
              </p>
              <select
                value={recordsPerPage}
                onChange={(e) => handleRecordsPerPageChange(parseInt(e.target.value))}
                className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
                <option value={1000}>Show All</option>
              </select>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'z-10 bg-green-50 border-green-500 text-green-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

