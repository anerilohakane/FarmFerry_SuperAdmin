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
  FiRefreshCw,
  FiMapPin,
  FiPackage
} from 'react-icons/fi'
import { FaMotorcycle } from 'react-icons/fa'

export default function DeliveryEmployeePayments() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7days')
  const [isLoading, setIsLoading] = useState(false)
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false)

  // Delivery employee payment records
  const [deliveryPayments, setDeliveryPayments] = useState([
    {
      id: 'DEL-1001',
      employee: { 
        name: 'Rahul Kumar', 
        id: 'EMP-001', 
        vehicle: 'Motorcycle', 
        contact: '9876543210',
        zone: 'North District'
      },
      amount: 3250,
      date: '2023-06-15',
      status: 'completed',
      method: 'upi',
      deliveries: 24,
      bonus: 500,
      deductions: 0,
      notes: 'On-time deliveries'
    },
    {
      id: 'DEL-1002',
      employee: { 
        name: 'Priya Sharma', 
        id: 'EMP-002', 
        vehicle: 'Scooter', 
        contact: '9876543211',
        zone: 'Central City'
      },
      amount: 2850,
      date: '2023-06-14',
      status: 'pending',
      method: 'bank_transfer',
      deliveries: 18,
      bonus: 300,
      deductions: 150,
      notes: '2 delayed deliveries'
    },
    {
      id: 'DEL-1003',
      employee: { 
        name: 'Amit Singh', 
        id: 'EMP-003', 
        vehicle: 'Bicycle', 
        contact: '9876543212',
        zone: 'South Suburbs'
      },
      amount: 2420,
      date: '2023-06-12',
      status: 'completed',
      method: 'cash',
      deliveries: 15,
      bonus: 200,
      deductions: 0,
      notes: 'Excellent customer feedback'
    },
    {
      id: 'DEL-1004',
      employee: { 
        name: 'Neha Patel', 
        id: 'EMP-004', 
        vehicle: 'Motorcycle', 
        contact: '9876543213',
        zone: 'East Zone'
      },
      amount: 3560,
      date: '2023-06-10',
      status: 'failed',
      method: 'upi',
      deliveries: 28,
      bonus: 600,
      deductions: 0,
      notes: 'Payment failed - wrong UPI ID',
      failureReason: 'Invalid UPI ID'
    },
    {
      id: 'DEL-1005',
      employee: { 
        name: 'Vikram Joshi', 
        id: 'EMP-005', 
        vehicle: 'Scooter', 
        contact: '9876543214',
        zone: 'West District'
      },
      amount: 2920,
      date: '2023-06-08',
      status: 'completed',
      method: 'upi',
      deliveries: 22,
      bonus: 400,
      deductions: 80,
      notes: '1 customer complaint'
    }
  ])

  // Filter delivery payments
  const filteredPayments = deliveryPayments.filter(payment => {
    const matchesSearch = 
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.employee.id.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = 
      statusFilter === 'all' || payment.status === statusFilter
    
    const matchesMethod = 
      paymentMethodFilter === 'all' || payment.method === paymentMethodFilter
    
    return matchesSearch && matchesStatus && matchesMethod
  })

  // Payment method options with borders
  const paymentMethods = [
    { value: 'upi', label: 'UPI', icon: <FiCreditCard className="text-indigo-500" /> },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: <FiCreditCard className="text-blue-500" /> },
    { value: 'cash', label: 'Cash', icon: <FiDollarSign className="text-green-500" /> },
    { value: 'wallet', label: 'Wallet', icon: <FiDollarSign className="text-yellow-500" /> }
  ]

  // Status options with borders
  const statusOptions = [
    { value: 'all', label: 'All Statuses', border: true },
    { value: 'completed', label: 'Completed', border: true },
    { value: 'pending', label: 'Pending', border: true },
    { value: 'failed', label: 'Failed', border: true },
    { value: 'cancelled', label: 'Cancelled', border: false }
  ]

  // Date range options with borders
  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days', border: true },
    { value: '30days', label: 'Last 30 days', border: true },
    { value: '90days', label: 'Last 90 days', border: true },
    { value: 'custom', label: 'Custom range', border: false }
  ]

  // Status badges
  const getStatusBadge = (status) => {
    const option = statusOptions.find(opt => opt.value === status && opt.value !== 'all') || 
                  { label: 'Unknown', color: 'gray' }
    
    const colorClasses = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
      gray: 'bg-gray-100 text-gray-800'
    }

    const icons = {
      completed: <FiCheckCircle className="mr-1" />,
      pending: <FiClock className="mr-1" />,
      failed: <FiXCircle className="mr-1" />,
      cancelled: <FiXCircle className="mr-1" />
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[status] || colorClasses.gray}`}>
        {icons[status] || null}
        {option.label}
      </span>
    )
  }

  // Process payment
  const processPayment = (id) => {
    // Update the payment status to completed
    setDeliveryPayments(prevPayments =>
      prevPayments.map(payment =>
        payment.id === id ? { ...payment, status: 'completed' } : payment
      )
    )
    alert(`Payment ${id} processed successfully!`)
  }

  // Refresh data
  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Handle new payment
  const handleNewPayment = () => {
    setShowNewPaymentModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Delivery Employee Payments</h1>
          <p className="text-gray-500">Manage and track payments to your delivery staff</p>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* ... existing stats cards code ... */}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
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
                placeholder="Search employees, IDs, or amounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="sr-only">Status</label>
            <select
              id="status"
              name="status"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((option, index) => (
                <option 
                  key={option.value} 
                  value={option.value}
                  className={option.border ? 'border-b border-gray-200' : ''}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label htmlFor="date-range" className="sr-only">Date Range</label>
            <select
              id="date-range"
              name="date-range"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              {dateRangeOptions.map((option, index) => (
                <option 
                  key={option.value} 
                  value={option.value}
                  className={option.border ? 'border-b border-gray-200' : ''}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Delivery Payments Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deliveries
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {payment.employee.vehicle === 'Motorcycle' ? (
                          <FaMotorcycle className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        ) : payment.employee.vehicle === 'Scooter' ? (
                          <FiTruck className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        ) : (
                          <FiMapPin className="flex-shrink-0 h-5 w-5 text-gray-400" />
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{payment.employee.name}</div>
                          <div className="text-sm text-gray-500">{payment.employee.id}</div>
                          <div className="text-xs text-gray-400">{payment.employee.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">₹{payment.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {payment.bonus > 0 && `+₹${payment.bonus} bonus `}
                        {payment.deductions > 0 && `-₹${payment.deductions} deductions`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FiPackage className="flex-shrink-0 mr-1 text-gray-400" />
                        <span className="text-sm text-gray-900">{payment.deliveries}</span>
                      </div>
                      <div className="text-xs text-gray-500">{payment.employee.zone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        {paymentMethods.find(m => m.value === payment.method)?.icon || <FiDollarSign className="text-gray-500" />}
                        <span className="ml-2">
                          {paymentMethods.find(m => m.value === payment.method)?.label || payment.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                      {payment.status === 'failed' && payment.failureReason && (
                        <div className="text-xs text-red-500 mt-1">{payment.failureReason}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        Details
                      </button>
                      {payment.status === 'pending' && (
                        <button 
                          onClick={() => processPayment(payment.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Pay
                        </button>
                      )}
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
        
        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          {/* ... existing pagination code ... */}
        </div>
      </div>

      {/* New Payment Modal */}
      {showNewPaymentModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          {/* ... existing modal code ... */}
        </div>
      )}
    </div>
  )
}