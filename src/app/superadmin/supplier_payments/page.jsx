'use client'

import { useState } from 'react'
import { 
  FiDollarSign, 
  FiFilter, 
  FiDownload, 
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiTruck,
  FiCalendar,
  FiCreditCard,
  FiPhone,
  FiPlus,
  FiFileText,
  FiRefreshCw
} from 'react-icons/fi'
import { FaGooglePay } from 'react-icons/fa'
import { SiPaytm, SiRazorpay } from 'react-icons/si'

export default function SupplierPayments() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7days')
  const [isLoading, setIsLoading] = useState(false)
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false)

  // Enhanced supplier payment records with more realistic data
  const [supplierPayments, setSupplierPayments] = useState([
    {
      id: 'SP-1001',
      supplier: { name: 'Fresh Farm Produce', id: 'SUP-001', contact: '9876543210' },
      amount: 12500,
      date: '2023-06-15',
      dueDate: '2023-06-20',
      status: 'completed',
      method: 'bank_transfer',
      invoice: { number: 'INV-789456', date: '2023-06-10' },
      deliveryCount: 24,
      notes: 'Monthly produce delivery'
    },
    {
      id: 'SP-1002',
      supplier: { name: 'Organic Dairy Co.', id: 'SUP-002', contact: '9876543211' },
      amount: 8500,
      date: '2023-06-14',
      dueDate: '2023-06-18',
      status: 'pending',
      method: 'upi',
      invoice: { number: 'INV-321654', date: '2023-06-09' },
      deliveryCount: 18,
      notes: 'Bi-weekly milk supply'
    },
    {
      id: 'SP-1003',
      supplier: { name: 'Grain Distributors', id: 'SUP-003', contact: '9876543212' },
      amount: 18420,
      date: '2023-06-12',
      dueDate: '2023-06-15',
      status: 'completed',
      method: 'cheque',
      invoice: { number: 'INV-654987', date: '2023-06-07' },
      deliveryCount: 32,
      notes: 'Wheat and rice delivery'
    },
    {
      id: 'SP-1004',
      supplier: { name: 'Premium Spices', id: 'SUP-004', contact: '9876543213' },
      amount: 9560,
      date: '2023-06-10',
      dueDate: '2023-06-12',
      status: 'failed',
      method: 'bank_transfer',
      invoice: { number: 'INV-987321', date: '2023-06-05' },
      deliveryCount: 15,
      notes: 'Spices monthly order',
      failureReason: 'Insufficient funds'
    },
    {
      id: 'SP-1005',
      supplier: { name: 'Cold Storage Logistics', id: 'SUP-005', contact: '9876543214' },
      amount: 11200,
      date: '2023-06-08',
      dueDate: '2023-06-10',
      status: 'completed',
      method: 'upi',
      invoice: { number: 'INV-147258', date: '2023-06-03' },
      deliveryCount: 28,
      notes: 'Refrigerated transport'
    }
  ])

  // Enhanced filter function with date range filtering
  const filteredPayments = supplierPayments.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoice.number.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || payment.status === statusFilter
    
    const matchesMethod = 
      paymentMethodFilter === 'all' || payment.method === paymentMethodFilter
    
    // Basic date range filtering (would be enhanced with actual date logic)
    const matchesDateRange = 
      dateRange === '7days' || 
      dateRange === '30days' || 
      dateRange === '90days' // Actual date filtering would be implemented
    
    return matchesSearch && matchesStatus && matchesMethod && matchesDateRange
  })

  // Enhanced payment method display
  const paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer', icon: <FiCreditCard className="text-blue-500" /> },
    { value: 'upi', label: 'UPI Payment', icon: <SiRazorpay className="text-indigo-600" /> },
    { value: 'cheque', label: 'Cheque', icon: <FiFileText className="text-green-500" /> },
    { value: 'card', label: 'Credit Card', icon: <FiCreditCard className="text-blue-500" /> },
    { value: 'cash', label: 'Cash', icon: <FiDollarSign className="text-green-500" /> }
  ]

  // Enhanced status options
  const statusOptions = [
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'failed', label: 'Failed', color: 'red' },
    { value: 'cancelled', label: 'Cancelled', color: 'gray' },
    { value: 'partially_paid', label: 'Partially Paid', color: 'blue' }
  ]

  // Enhanced status badges
  const getStatusBadge = (status) => {
    const option = statusOptions.find(opt => opt.value === status) || 
                  { label: 'Unknown', color: 'gray' }
    
    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      blue: 'bg-blue-100 text-blue-800',
      gray: 'bg-gray-100 text-gray-800'
    }

    const icons = {
      completed: <FiCheckCircle className="mr-1" />,
      pending: <FiClock className="mr-1" />,
      failed: <FiXCircle className="mr-1" />,
      cancelled: <FiXCircle className="mr-1" />,
      partially_paid: <FiDollarSign className="mr-1" />
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[option.color]}`}>
        {icons[status] || null}
        {option.label}
      </span>
    )
  }

  // Enhanced summary statistics with calculations
  const calculateStats = () => {
    const total = supplierPayments.reduce((sum, payment) => sum + payment.amount, 0)
    const completed = supplierPayments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0)
    const pending = supplierPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, payment) => sum + payment.amount, 0)
    const failed = supplierPayments
      .filter(p => p.status === 'failed')
      .reduce((sum, payment) => sum + payment.amount, 0)

    return [
      { 
        title: "Total Payments", 
        value: `₹${total.toLocaleString()}`, 
        change: "+15%", 
        description: `${supplierPayments.length} transactions` 
      },
      { 
        title: "Completed", 
        value: `₹${completed.toLocaleString()}`, 
        change: "+12%", 
        description: `${Math.round((completed/total)*100)}% of total` 
      },
      { 
        title: "Pending", 
        value: `₹${pending.toLocaleString()}`, 
        change: pending > 0 ? "-5%" : "0%", 
        description: `${Math.round((pending/total)*100)}% of total` 
      },
      { 
        title: "Failed", 
        value: `₹${failed.toLocaleString()}`, 
        change: failed > 0 ? "+3%" : "0%", 
        description: `${Math.round((failed/total)*100)}% of total` 
      }
    ]
  }

  const stats = calculateStats()

  // Refresh data function
  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // New payment handler
  const handleNewPayment = () => {
    setShowNewPaymentModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header with improved actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Supplier Payments</h1>
          <p className="text-gray-500">Manage and track all supplier payments and settlements</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button 
            onClick={refreshData}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={handleNewPayment}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FiPlus className="mr-2" />
            New Payment
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards with loading state */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">
                  {isLoading ? '...' : stat.value}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`text-sm ${
                    stat.change.startsWith('+') ? 'text-green-500' : stat.change.startsWith('-') ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">{stat.description}</span>
                </div>
              </div>
              <div className={`p-2 rounded-full ${
                stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 
                stat.change.startsWith('-') ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <FiDollarSign className="text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Filters with more options */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Enhanced Search */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md"
                placeholder="Search suppliers, invoices, or amounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Enhanced Status Filter */}
          <div>
            <label htmlFor="status" className="sr-only">Status</label>
            <select
              id="status"
              name="status"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Enhanced Date Range Filter */}
          <div>
            <label htmlFor="date-range" className="sr-only">Date Range</label>
            <select
              id="date-range"
              name="date-range"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Supplier Payments Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{payment.supplier.name}</div>
                      <div className="text-sm text-gray-500">{payment.supplier.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        {paymentMethods.find(m => m.value === payment.method)?.icon || <FiDollarSign className="text-gray-500" />}
                        <span className="ml-2">
                          {paymentMethods.find(m => m.value === payment.method)?.label || payment.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-sm text-gray-900">{payment.invoice.number}</div>
                      <div className="text-xs text-gray-500">{payment.invoice.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                      {payment.status === 'failed' && payment.failureReason && (
                        <div className="text-xs text-red-500 mt-1">{payment.failureReason}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{payment.date}</div>
                      <div className="text-xs text-gray-400">Due: {payment.dueDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        View
                      </button>
                      {payment.status === 'failed' && (
                        <button className="text-red-600 hover:text-red-900">
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No payments found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Enhanced Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <a
              href="#"
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </a>
            <a
              href="#"
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </a>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of{' '}
                <span className="font-medium">{supplierPayments.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  &larr;
                </a>
                <a
                  href="#"
                  aria-current="page"
                  className="z-10 bg-green-50 border-green-500 text-green-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  1
                </a>
                <a
                  href="#"
                  className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  2
                </a>
                <a
                  href="#"
                  className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                >
                  3
                </a>
                <a
                  href="#"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  &rarr;
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* New Payment Modal (skeleton) */}
      {showNewPaymentModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">New Supplier Payment</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Create a new payment to your supplier
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                  onClick={() => setShowNewPaymentModal(false)}
                >
                  Submit Payment
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setShowNewPaymentModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}