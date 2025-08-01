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
  FiUser,
  FiDollarSign as FiRupee
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
            <span className="mr-1 font-bold">₹</span> Refunded
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

// 'use client'

// import { useState, useEffect } from 'react'
// import { 
//   FiDollarSign, 
//   FiFilter, 
//   FiDownload, 
//   FiSearch,
//   FiCreditCard,
//   FiPhone,
//   FiCheckCircle,
//   FiXCircle,
//   FiClock,
//   FiUser,
//   FiDollarSign as FiRupee,
//   FiLoader,
//   FiAlertCircle
// } from 'react-icons/fi'
// import { FaGooglePay } from 'react-icons/fa'
// import { SiPaytm, SiRazorpay } from 'react-icons/si'

// export default function PaymentRecords() {
//   // State management
//   const [paymentRecords, setPaymentRecords] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [searchQuery, setSearchQuery] = useState('')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [pagination, setPagination] = useState({
//     totalPages: 1,
//     totalRecords: 0,
//     hasNext: false,
//     hasPrev: false
//   })
//   const [exporting, setExporting] = useState(false)

//   const recordsPerPage = 10

//   // Base API URL - adjust according to your setup
//   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1'

//   // Fetch payment records
//   const fetchPaymentRecords = async () => {
//     try {
//       setLoading(true)
//       const queryParams = new URLSearchParams({
//         page: currentPage.toString(),
//         limit: recordsPerPage.toString(),
//         ...(searchQuery && { search: searchQuery }),
//         ...(statusFilter !== 'all' && { status: statusFilter }),
//         ...(paymentMethodFilter !== 'all' && { method: paymentMethodFilter }),
//         sortBy: 'createdAt',
//         sortOrder: 'desc'
//       })

//       const response = await fetch(`${API_BASE_URL}/payments?${queryParams}`)
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }
      
//       const data = await response.json()
      
//       if (data.success) {
//         setPaymentRecords(data.data.records)
//         setPagination(data.data.pagination)
//       } else {
//         throw new Error(data.message || 'Failed to fetch payment records')
//       }
//     } catch (err) {
//       console.error('Error fetching payment records:', err)
//       setError(err.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Export payment records
//   const handleExport = async () => {
//     try {
//       setExporting(true)
//       const queryParams = new URLSearchParams({
//         ...(statusFilter !== 'all' && { status: statusFilter }),
//         ...(paymentMethodFilter !== 'all' && { method: paymentMethodFilter })
//       })

//       const response = await fetch(`${API_BASE_URL}/payments/export?${queryParams}`)
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }
      
//       const data = await response.json()
      
//       if (data.success) {
//         // Convert JSON to CSV and download
//         const csvContent = convertToCSV(data.data)
//         downloadCSV(csvContent, data.filename || 'payment-records.csv')
//       } else {
//         throw new Error(data.message || 'Failed to export records')
//       }
//     } catch (err) {
//       console.error('Error exporting records:', err)
//       alert('Failed to export records: ' + err.message)
//     } finally {
//       setExporting(false)
//     }
//   }

//   // Helper function to convert JSON to CSV
//   const convertToCSV = (data) => {
//     if (!data.length) return ''
    
//     const headers = Object.keys(data[0]).join(',')
//     const rows = data.map(row => 
//       Object.values(row).map(value => 
//         typeof value === 'string' && value.includes(',') 
//           ? `"${value}"` 
//           : value
//       ).join(',')
//     )
    
//     return [headers, ...rows].join('\n')
//   }

//   // Helper function to download CSV
//   const downloadCSV = (csvContent, filename) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
//     const link = document.createElement('a')
//     const url = URL.createObjectURL(blob)
//     link.setAttribute('href', url)
//     link.setAttribute('download', filename)
//     link.style.visibility = 'hidden'
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   // Effect to fetch data when filters change
//   useEffect(() => {
//     const debounceTimer = setTimeout(() => {
//       setCurrentPage(1) // Reset to first page when filters change
//       fetchPaymentRecords()
//     }, 500) // Debounce search input

//     return () => clearTimeout(debounceTimer)
//   }, [searchQuery, statusFilter, paymentMethodFilter])

//   // Effect to fetch data when page changes
//   useEffect(() => {
//     if (currentPage > 1) {
//       fetchPaymentRecords()
//     }
//   }, [currentPage])

//   // Initial data fetch
//   useEffect(() => {
//     fetchPaymentRecords()
//   }, [])

//   // Payment method icons
//   const getPaymentMethodIcon = (method) => {
//     switch(method?.toLowerCase()) {
//       case 'card':
//       case 'credit_card':
//       case 'debit_card':
//         return <FiCreditCard className="text-blue-500" />
//       case 'upi':
//         return <SiRazorpay className="text-indigo-600" />
//       case 'wallet':
//         return <FaGooglePay className="text-teal-500" />
//       case 'netbanking':
//       case 'bank_transfer':
//         return <span className="text-green-500 font-bold text-lg">₹</span>
//       case 'paytm':
//         return <SiPaytm className="text-blue-400" />
//       case 'cash_on_delivery':
//         return <span className="text-orange-500 font-bold">COD</span>
//       default:
//         return <FiDollarSign className="text-gray-500" />
//     }
//   }

//   // Status badges
//   const getStatusBadge = (status) => {
//     switch(status?.toLowerCase()) {
//       case 'paid':
//       case 'completed':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//             <FiCheckCircle className="mr-1" /> Completed
//           </span>
//         )
//       case 'failed':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//             <FiXCircle className="mr-1" /> Failed
//           </span>
//         )
//       case 'pending':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//             <FiClock className="mr-1" /> Pending
//           </span>
//         )
//       case 'refunded':
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//             <span className="mr-1 font-bold">₹</span> Refunded
//           </span>
//         )
//       default:
//         return (
//           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//             Unknown
//           </span>
//         )
//     }
//   }

//   // Format date
//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     return date.toLocaleString('en-IN', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit'
//     })
//   }

//   // Loading state
//   if (loading && paymentRecords.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="flex items-center space-x-2">
//           <FiLoader className="animate-spin text-green-500" size={24} />
//           <span className="text-gray-600">Loading payment records...</span>
//         </div>
//       </div>
//     )
//   }

//   // Error state
//   if (error && paymentRecords.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <FiAlertCircle className="mx-auto text-red-500 mb-4" size={48} />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Payment Records</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={fetchPaymentRecords}
//             className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Customer Payment Records</h1>
//           <p className="text-gray-500">
//             View and manage all payment transactions ({pagination.totalRecords} total)
//           </p>
//         </div>
//         <button 
//           onClick={handleExport}
//           disabled={exporting}
//           className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mt-4 md:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           {exporting ? (
//             <FiLoader className="mr-2 animate-spin" />
//           ) : (
//             <FiDownload className="mr-2" />
//           )}
//           {exporting ? 'Exporting...' : 'Export'}
//         </button>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-black">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {/* Search */}
//           <div>
//             <div className="relative rounded-md shadow-sm">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md"
//                 placeholder="Search payments..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Status Filter */}
//           <div>
//             <select
//               className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               <option value="all">All Statuses</option>
//               <option value="paid">Completed</option>
//               <option value="pending">Pending</option>
//               <option value="failed">Failed</option>
//               <option value="refunded">Refunded</option>
//             </select>
//           </div>

//           {/* Payment Method Filter */}
//           <div>
//             <select
//               className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
//               value={paymentMethodFilter}
//               onChange={(e) => setPaymentMethodFilter(e.target.value)}
//             >
//               <option value="all">All Methods</option>
//               <option value="credit_card">Credit/Debit Card</option>
//               <option value="upi">UPI</option>
//               <option value="cash_on_delivery">Cash on Delivery</option>
//               <option value="bank_transfer">Net Banking</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Payment Records Table */}
//       <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Payment ID
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Customer
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Method
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {paymentRecords.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
//                     <FiAlertCircle className="mx-auto mb-4" size={48} />
//                     <p className="text-lg">No payment records found</p>
//                     <p className="text-sm">Try adjusting your search or filter criteria</p>
//                   </td>
//                 </tr>
//               ) : (
//                 paymentRecords.map((record) => (
//                   <tr key={record.paymentId} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {record.paymentId}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <div className="flex items-center">
//                         <FiUser className="flex-shrink-0 mr-2 text-gray-400" />
//                         {record.customer?.name || 'Unknown Customer'}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       ₹{record.amount?.toLocaleString('en-IN') || '0'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <div className="flex items-center">
//                         {getPaymentMethodIcon(record.method)}
//                         <span className="ml-2 capitalize">{record.method || 'Unknown'}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(record.date)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {getStatusBadge(record.status)}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//             <div className="flex-1 flex justify-between sm:hidden">
//               <button
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                 disabled={!pagination.hasPrev}
//                 className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
//                 disabled={!pagination.hasNext}
//                 className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Next
//               </button>
//             </div>
//             <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//               <div>
//                 <p className="text-sm text-gray-700">
//                   Showing <span className="font-medium">{(currentPage - 1) * recordsPerPage + 1}</span> to{' '}
//                   <span className="font-medium">
//                     {Math.min(currentPage * recordsPerPage, pagination.totalRecords)}
//                   </span>{' '}
//                   of <span className="font-medium">{pagination.totalRecords}</span> results
//                 </p>
//               </div>
//               <div>
//                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                   <button
//                     onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                     disabled={!pagination.hasPrev}
//                     className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Previous
//                   </button>
                  
//                   {/* Page numbers */}
//                   {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
//                     const pageNum = Math.max(1, currentPage - 2) + i
//                     if (pageNum > pagination.totalPages) return null
                    
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                           pageNum === currentPage
//                             ? 'z-10 bg-green-50 border-green-500 text-green-600'
//                             : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     )
//                   })}

//                   <button
//                     onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
//                     disabled={!pagination.hasNext}
//                     className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Next
//                   </button>
//                 </nav>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Loading overlay for subsequent requests */}
//       {loading && paymentRecords.length > 0 && (
//         <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-3">
//             <FiLoader className="animate-spin text-green-500" size={24} />
//             <span>Loading...</span>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }