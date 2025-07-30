"use client"

import { useState } from 'react'
import {
  FiFilter,
  FiDownload,
  FiSearch,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUser,
  FiShoppingBag,
  FiCreditCard,
  FiPhone,
  FiRefreshCw,
  FiArrowLeft,
  FiAlertTriangle,
  FiEye
} from 'react-icons/fi'
import { FaRupeeSign, FaExchangeAlt } from 'react-icons/fa'

export default function RefundPayments() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [refundMethodFilter, setRefundMethodFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRefund, setSelectedRefund] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [payMethod, setPayMethod] = useState('original')
  const [payProcessing, setPayProcessing] = useState(false)
  const [paidRefundId, setPaidRefundId] = useState(null)

  // Refund payment records with all statuses and methods
  const refundPayments = [
    {
      id: 'REF-1001',
      orderId: 'ORD-2056',
      customer: { name: 'Rahul Sharma', id: 'CUST-001', contact: '9876543210' },
      amount: 1250,
      dateRequested: '2023-06-15',
      dateProcessed: '2023-06-16',
      status: 'completed',
      method: 'original',
      reason: 'Product damaged',
      products: [
        { name: 'Organic Apples (1kg)', quantity: 2, price: 200 },
        { name: 'Fresh Milk (1L)', quantity: 1, price: 60 }
      ],
      initiatedBy: 'Customer'
    },
    {
      id: 'REF-1002',
      orderId: 'ORD-2057',
      customer: { name: 'Priya Patel', id: 'CUST-002', contact: '9876543211' },
      amount: 850,
      dateRequested: '2023-06-14',
      dateProcessed: '',
      status: 'pending',
      method: 'wallet',
      reason: 'Wrong item delivered',
      products: [
        { name: 'Whole Wheat Bread', quantity: 1, price: 50 }
      ],
      initiatedBy: 'Customer'
    },
    {
      id: 'REF-1003',
      orderId: 'ORD-2058',
      customer: { name: 'Amit Singh', id: 'CUST-003', contact: '9876543212' },
      amount: 420,
      dateRequested: '2023-06-12',
      dateProcessed: '2023-06-13',
      status: 'failed',
      method: 'bank_transfer',
      reason: 'Order cancellation',
      products: [
        { name: 'Fresh Eggs (Dozen)', quantity: 1, price: 90 }
      ],
      initiatedBy: 'System',
      failureReason: 'Bank account details invalid'
    },
    {
      id: 'REF-1004',
      orderId: 'ORD-2059',
      customer: { name: 'Neha Gupta', id: 'CUST-004', contact: '9876543213' },
      amount: 1560,
      dateRequested: '2023-06-10',
      dateProcessed: '2023-06-11',
      status: 'completed',
      method: 'voucher',
      reason: 'Late delivery',
      products: [
        { name: 'Organic Rice (5kg)', quantity: 1, price: 450 }
      ],
      initiatedBy: 'Admin'
    },
    {
      id: 'REF-1005',
      orderId: 'ORD-2060',
      customer: { name: 'Vikram Joshi', id: 'CUST-005', contact: '9876543214' },
      amount: 920,
      dateRequested: '2023-06-08',
      dateProcessed: '',
      status: 'pending',
      method: 'original',
      reason: 'Customer not satisfied',
      products: [
        { name: 'Fresh Chicken (1kg)', quantity: 1, price: 320 }
      ],
      initiatedBy: 'Customer'
    }
  ]

  // Filter refund payments
  const filteredRefunds = refundPayments.filter(refund => {
    const matchesSearch =
      refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || refund.status === statusFilter
    const matchesMethod =
      refundMethodFilter === 'all' || refund.method === refundMethodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  // Refund method options (now all rupee icon where appropriate)
  const refundMethods = [
    { value: 'original', label: 'Original Method', icon: <FaExchangeAlt className="text-blue-500" /> },
    { value: 'wallet', label: 'Wallet Credit', icon: <FaRupeeSign className="text-green-500" /> },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: <FiCreditCard className="text-indigo-500" /> },
    { value: 'voucher', label: 'Store Voucher', icon: <FiShoppingBag className="text-yellow-500" /> }
  ]

  // Status options
  const statusOptions = [
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'failed', label: 'Failed', color: 'red' },
    { value: 'cancelled', label: 'Cancelled', color: 'gray' }
  ]

  // Status badges
  const getStatusBadge = (status) => {
    const option = statusOptions.find(opt => opt.value === status) || { label: 'Unknown', color: 'gray' }
    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800'
    }
    const icons = {
      completed: <FiCheckCircle className="mr-1" />,
      pending: <FiClock className="mr-1" />,
      failed: <FiXCircle className="mr-1" />,
      cancelled: <FiXCircle className="mr-1" />
    }
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[option.color]}`}>
        {icons[status] || null}
        {option.label}
      </span>
    )
  }

  // Calculate stats summary (uses rupees)
  const calculateStats = () => {
    const total = refundPayments.reduce((sum, refund) => sum + refund.amount, 0)
    const completed = refundPayments.filter(r => r.status === 'completed').reduce((sum, refund) => sum + refund.amount, 0)
    const pending = refundPayments.filter(r => r.status === 'pending').reduce((sum, refund) => sum + refund.amount, 0)
    const failed = refundPayments.filter(r => r.status === 'failed').reduce((sum, refund) => sum + refund.amount, 0)
    return [
      {
        title: "Total Refunds",
        value: `₹${total.toLocaleString()}`,
        change: "+12%",
        description: `${refundPayments.length} requests`
      },
      {
        title: "Completed",
        value: `₹${completed.toLocaleString()}`,
        change: "+8%",
        description: `${Math.round((completed/total)*100)}% of total`
      },
      {
        title: "Pending",
        value: `₹${pending.toLocaleString()}`,
        change: pending > 0 ? "+5%" : "0%",
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

  // Refresh data
  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => { setIsLoading(false) }, 1000)
  }

  // Refund details (Eye icon)
  const viewRefundDetails = (refund) => setSelectedRefund(refund)
  const closeDetails = () => setSelectedRefund(null)

  // Show pay modal
  const openPayModal = (refund) => {
    setPaidRefundId(null)
    setPayMethod(refund.method)
    setSelectedRefund(refund)
    setShowPaymentModal(true)
  }
  const closePayModal = () => {
    setShowPaymentModal(false)
    setSelectedRefund(null)
    setPayProcessing(false)
  }

  // Process refund
  const processRefund = () => {
    setPayProcessing(true)
    setTimeout(() => {
      setPayProcessing(false)
      setPaidRefundId(selectedRefund.id)
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Refund Details Drawer */}
      {selectedRefund && !showPaymentModal ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <button
            onClick={closeDetails}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" /> Back to refunds
          </button>
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800">Refund Details</h2>
            <div className="flex items-center mt-2">
              {getStatusBadge(selectedRefund.status)}
              <span className="ml-4 text-sm text-gray-500">Refund ID: {selectedRefund.id}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiUser className="text-gray-400 mr-2" />
                  <span className="font-medium">{selectedRefund.customer.name}</span>
                </div>
                <div className="text-sm text-gray-500 mb-1">Customer ID: {selectedRefund.customer.id}</div>
                <div className="text-sm text-gray-500">Contact: {selectedRefund.customer.contact}</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Order Information</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FiShoppingBag className="text-gray-400 mr-2" />
                  <span className="font-medium">Order #{selectedRefund.orderId}</span>
                </div>
                <div className="text-sm text-gray-500 mb-1">Requested on: {selectedRefund.dateRequested}</div>
                {selectedRefund.dateProcessed && (
                  <div className="text-sm text-gray-500">Processed on: {selectedRefund.dateProcessed}</div>
                )}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Refund Items</h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedRefund.products.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><FaRupeeSign className="inline" />{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><FaRupeeSign className="inline" />{product.quantity * product.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Refund Reason</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <FiAlertTriangle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{selectedRefund.reason}</p>
                    <p className="text-sm text-gray-500 mt-1">Initiated by: {selectedRefund.initiatedBy}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Refund Summary</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium"><FaRupeeSign className="inline" />{selectedRefund.amount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Refund Method:</span>
                  <span className="font-medium">
                    {refundMethods.find(m => m.value === selectedRefund.method)?.label || selectedRefund.method}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-3 pt-2 border-t border-gray-200">
                  <span>Total Refund:</span>
                  <span><FaRupeeSign className="inline" />{selectedRefund.amount}</span>
                </div>
              </div>
            </div>
          </div>

          {selectedRefund.status === 'failed' && selectedRefund.failureReason && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiXCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Refund Failed:</span> {selectedRefund.failureReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              onClick={closeDetails}
            >
              Close
            </button>
            {selectedRefund.status === 'pending' && (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                onClick={() => openPayModal(selectedRefund)}
              >
                <FaRupeeSign className="mr-2" />
                Pay
              </button>
            )}
            {selectedRefund.status === 'failed' && (
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                onClick={() => openPayModal(selectedRefund)}
              >
                <FaRupeeSign className="mr-2" />
                Retry
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Page header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Refund Payments</h1>
              <p className="text-gray-500">Manage and track customer refund requests</p>
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
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                <FiDownload className="mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
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
                        stat.change.startsWith('+') ? 'text-green-500'
                          : stat.change.startsWith('-') ? 'text-red-500'
                          : 'text-gray-500'
                        }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">{stat.description}</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-green-100 text-green-600'
                      : stat.change.startsWith('-') ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <FaRupeeSign className="text-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    placeholder="Search refunds, orders, or customers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
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
              <div>
                <select
                  id="refund-method"
                  name="refund-method"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
                  value={refundMethodFilter}
                  onChange={(e) => setRefundMethodFilter(e.target.value)}
                >
                  <option value="all">All Methods</option>
                  {refundMethods.map(method => (
                    <option key={method.value} value={method.value}>{method.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Refunds Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order/Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRefunds.length > 0 ? (
                    filteredRefunds.map((refund) => (
                      <tr key={refund.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {refund.id}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">Order #{refund.orderId}</div>
                          <div className="text-sm text-gray-500">{refund.customer.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                          <FaRupeeSign className="inline mr-1" />{refund.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            {refundMethods.find(m => m.value === refund.method)?.icon || <FaRupeeSign className="text-gray-500" />}
                            <span className="ml-2">
                              {refundMethods.find(m => m.value === refund.method)?.label || refund.method}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {refund.dateRequested}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(refund.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2 justify-end">
                          <button
                            onClick={() => viewRefundDetails(refund)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center"
                            aria-label={`View details of refund ${refund.id}`}
                          >
                            <FiEye className="mr-1" />
                          </button>
                          {(refund.status === 'pending' || refund.status === 'failed') && (
                            <button
                              className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                              aria-label="Pay this refund"
                              onClick={() => openPayModal(refund)}
                            >
                              {/* <FaRupeeSign className="mr-1" /> */}
                              pay
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No refunds found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination (static, demo) */}
          {/* ... you may add pagination here ... */}
        </>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedRefund && (
        <div className="fixed z-50 top-0 right-0 left-0 bottom-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 relative">
            <button
              onClick={closePayModal}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-900"
            >
              <FiXCircle size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Pay Refund</h2>
            <div className="mb-4 flex flex-col gap-1">
              <div className="text-sm text-gray-500">Refund ID: <span className="font-mono">{selectedRefund.id}</span></div>
              <div className="text-sm text-gray-500">Order ID: <span className="font-mono">{selectedRefund.orderId}</span></div>
              <div className="text-sm">Customer: {selectedRefund.customer.name} ({selectedRefund.customer.contact})</div>
              <div className="font-bold text-gray-800 mt-2">Amount: <FaRupeeSign className="inline" />{selectedRefund.amount}</div>
              <div className="text-xs text-gray-500 mt-2">Requested on: {selectedRefund.dateRequested}</div>
            </div>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">Select Payment Method:</label>
              <div className="space-y-2">
                {refundMethods.map((method) => (
                  <label key={method.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-green-600"
                      value={method.value}
                      checked={payMethod === method.value}
                      disabled={payProcessing || paidRefundId === selectedRefund.id}
                      onChange={() => setPayMethod(method.value)}
                    />
                    {method.icon}
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
                onClick={closePayModal}
                disabled={payProcessing}
              >
                Cancel
              </button>
              {paidRefundId === selectedRefund.id ? (
                <button
                  className="px-4 py-2 rounded-md bg-green-100 text-green-900 flex items-center space-x-2 border border-green-300 cursor-default"
                  disabled
                >
                  <FiCheckCircle className="mr-1" />
                  Paid
                </button>
              ) : (
                <button
                  className={`px-4 py-2 rounded-md bg-green-600 text-white flex items-center space-x-2 font-medium shadow ${
                    payProcessing ? "opacity-70" : "hover:bg-green-700"
                  }`}
                  disabled={payProcessing}
                  onClick={processRefund}
                >
                  {payProcessing ? (
                    <>
                      <FiRefreshCw className="animate-spin mr-2" /> Paying...
                    </>
                  ) : (
                    <>
                      <FaRupeeSign className="mr-1" />
                      Pay Refund
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
