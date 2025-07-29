"use client"

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
  FiShoppingBag,
  FiCreditCard,
  FiPhone,
  FiRefreshCw,
  FiArrowLeft,
  FiAlertTriangle,
  FiEye  // Only the icon change as you requested
} from 'react-icons/fi'
import { FaExchangeAlt } from 'react-icons/fa'

export default function RefundPayments() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRefund, setSelectedRefund] = useState(null)

  // Refund payment records - focusing only on pending refunds
  const refundPayments = [
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

  // Filter refund payments - only show pending refunds by default
  const filteredRefunds = refundPayments.filter(refund => {
    return (
      refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  // Refund method options
  const refundMethods = [
    { value: 'original', label: 'Original Method', icon: <FaExchangeAlt className="text-blue-500" /> },
    { value: 'wallet', label: 'Wallet Credit', icon: <FiDollarSign className="text-green-500" /> },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: <FiCreditCard className="text-indigo-500" /> },
    { value: 'voucher', label: 'Store Voucher', icon: <FiShoppingBag className="text-yellow-500" /> }
  ]

  // Status badges
  const getStatusBadge = (status) => {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <FiClock className="mr-1" />
        Pending
      </span>
    )
  }

  // Refresh data
  const refreshData = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // View refund details
  const viewRefundDetails = (refund) => {
    setSelectedRefund(refund)
  }

  // Close details view
  const closeDetails = () => {
    setSelectedRefund(null)
  }

  // Process refund
  const processRefund = (id) => {
    // Implement refund processing logic
    console.log(`Processing refund ${id}`)
    // In a real app, you would call an API here
    alert(`Refund ${id} processed successfully!`)
    // Refresh the data
    refreshData()
  }

  return (
    <div className="space-y-6">
      {selectedRefund ? (
        // Refund Detail View
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.quantity * product.price}</td>
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
                  <span className="font-medium">₹{selectedRefund.amount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Refund Method:</span>
                  <span className="font-medium">
                    {refundMethods.find(m => m.value === selectedRefund.method)?.label || selectedRefund.method}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-3 pt-2 border-t border-gray-200">
                  <span>Total Refund:</span>
                  <span>₹{selectedRefund.amount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={closeDetails}
            >
              Close
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={() => processRefund(selectedRefund.id)}
            >
              Pay Refund
            </button>
          </div>
        </div>
      ) : (
        // Main Refunds List View
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Pending Refund Payments</h1>
              <p className="text-gray-500">Process customer refund requests</p>
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
            </div>
          </div>

          {/* Search Filter */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
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
          </div>

          {/* Refunds Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Refund ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRefunds.length > 0 ? (
                    filteredRefunds.map((refund) => (
                      <tr key={refund.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {refund.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{refund.customer.name}</div>
                          <div className="text-sm text-gray-500">{refund.customer.contact}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {refund.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{refund.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {refund.dateRequested}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(refund.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <button
                            onClick={() => viewRefundDetails(refund)}
                            className="text-green-600 hover:text-green-900 inline-flex items-center"
                            aria-label={`View details of refund ${refund.id}`}
                          >
                            <FiEye className="mr-1" />
                            
                          </button>
                          <button
                            onClick={() => processRefund(refund.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Pay
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No pending refunds found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
