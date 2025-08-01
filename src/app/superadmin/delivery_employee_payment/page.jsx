// 'use client'

// import { useState } from 'react'
// import { 
//   FiFilter, 
//   FiDownload, 
//   FiSearch,
//   FiCheckCircle,
//   FiXCircle,
//   FiClock,
//   FiUser,
//   FiTruck,
//   FiCalendar,
//   FiCreditCard,
//   FiPhone,
//   FiPlus,
//   FiRefreshCw,
//   FiMapPin,
//   FiPackage,
//   FiX
// } from 'react-icons/fi'
// import { FaMotorcycle, FaRupeeSign } from 'react-icons/fa'

// export default function DeliveryPartnerPayments() {
//   const [searchQuery, setSearchQuery] = useState('')
//   const [statusFilter, setStatusFilter] = useState('all')
//   const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
//   const [dateRange, setDateRange] = useState('7days')
//   const [isLoading, setIsLoading] = useState(false)
//   const [processingPayment, setProcessingPayment] = useState(null)

//   // Delivery Partner payment records
//   const [deliveryPayments, setDeliveryPayments] = useState([
//     {
//       id: 'DEL-1001',
//       partner: { 
//         name: 'Rahul Kumar', 
//         id: 'EMP-001', 
//         vehicle: 'Motorcycle', 
//         contact: '9876543210',
//         zone: 'North District'
//       },
//       amount: 3250,
//       date: '2023-06-15',
//       status: 'completed',
//       method: 'upi',
//       deliveries: 24,
//       bonus: 500,
//       deductions: 0,
//       notes: 'On-time deliveries'
//     },
//     {
//       id: 'DEL-1002',
//       partner: { 
//         name: 'Priya Sharma', 
//         id: 'EMP-002', 
//         vehicle: 'Scooter', 
//         contact: '9876543211',
//         zone: 'Central City'
//       },
//       amount: 2850,
//       date: '2023-06-14',
//       status: 'pending',
//       method: 'bank_transfer',
//       deliveries: 18,
//       bonus: 300,
//       deductions: 150,
//       notes: '2 delayed deliveries'
//     },
//     {
//       id: 'DEL-1003',
//       partner: { 
//         name: 'Amit Singh', 
//         id: 'EMP-003', 
//         vehicle: 'Bicycle', 
//         contact: '9876543212',
//         zone: 'South Suburbs'
//       },
//       amount: 2420,
//       date: '2023-06-12',
//       status: 'completed',
//       method: 'cash',
//       deliveries: 15,
//       bonus: 200,
//       deductions: 0,
//       notes: 'Excellent customer feedback'
//     },
//     {
//       id: 'DEL-1004',
//       partner: { 
//         name: 'Neha Patel', 
//         id: 'EMP-004', 
//         vehicle: 'Motorcycle', 
//         contact: '9876543213',
//         zone: 'East Zone'
//       },
//       amount: 3560,
//       date: '2023-06-10',
//       status: 'failed',
//       method: 'upi',
//       deliveries: 28,
//       bonus: 600,
//       deductions: 0,
//       notes: 'Payment failed - wrong UPI ID',
//       failureReason: 'Invalid UPI ID'
//     },
//     {
//       id: 'DEL-1005',
//       partner: { 
//         name: 'Vikram Joshi', 
//         id: 'EMP-005', 
//         vehicle: 'Scooter', 
//         contact: '9876543214',
//         zone: 'West District'
//       },
//       amount: 2920,
//       date: '2023-06-08',
//       status: 'completed',
//       method: 'upi',
//       deliveries: 22,
//       bonus: 400,
//       deductions: 80,
//       notes: '1 customer complaint'
//     }
//   ])

//   // Payment method options with rupee icons
//   const paymentMethods = [
//     { value: 'upi', label: 'UPI', icon: <FiCreditCard className="text-indigo-500" /> },
//     { value: 'bank_transfer', label: 'Bank Transfer', icon: <FiCreditCard className="text-blue-500" /> },
//     { value: 'cash', label: 'Cash', icon: <FaRupeeSign className="text-green-500" /> },
//     { value: 'wallet', label: 'Wallet', icon: <FaRupeeSign className="text-yellow-500" /> }
//   ]

//   // Status options
//   const statusOptions = [
//     { value: 'all', label: 'All Statuses' },
//     { value: 'completed', label: 'Completed' },
//     { value: 'pending', label: 'Pending' },
//     { value: 'failed', label: 'Failed' },
//     { value: 'cancelled', label: 'Cancelled' }
//   ]

//   // Date range options
//   const dateRangeOptions = [
//     { value: '7days', label: 'Last 7 days' },
//     { value: '30days', label: 'Last 30 days' },
//     { value: '90days', label: 'Last 90 days' },
//     { value: 'custom', label: 'Custom range' }
//   ]

//   // Filter delivery payments
//   const filteredPayments = deliveryPayments.filter(payment => {
//     const matchesSearch = 
//       payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       payment.partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       payment.partner.id.toLowerCase().includes(searchQuery.toLowerCase())
    
//     const matchesStatus = 
//       statusFilter === 'all' || payment.status === statusFilter
    
//     const matchesMethod = 
//       paymentMethodFilter === 'all' || payment.method === paymentMethodFilter
    
//     return matchesSearch && matchesStatus && matchesMethod
//   })

//   // Status badges
//   const getStatusBadge = (status) => {
//     const colorClasses = {
//       completed: 'bg-green-100 text-green-800',
//       pending: 'bg-yellow-100 text-yellow-800',
//       failed: 'bg-red-100 text-red-800',
//       cancelled: 'bg-gray-100 text-gray-800'
//     }

//     const icons = {
//       completed: <FiCheckCircle className="mr-1" />,
//       pending: <FiClock className="mr-1" />,
//       failed: <FiXCircle className="mr-1" />,
//       cancelled: <FiXCircle className="mr-1" />
//     }

//     const labels = {
//       completed: 'Completed',
//       pending: 'Pending',
//       failed: 'Failed',
//       cancelled: 'Cancelled'
//     }

//     return (
//       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[status] || colorClasses.cancelled}`}>
//         {icons[status]}
//         {labels[status] || status}
//       </span>
//     )
//   }

//   // Process payment - opens modal
//   const processPayment = (id) => {
//     const payment = deliveryPayments.find(p => p.id === id)
//     setProcessingPayment(payment)
//   }

//   // Confirm payment - updates status
//   const confirmPayment = (id, method, notes) => {
//     setDeliveryPayments(prevPayments =>
//       prevPayments.map(payment =>
//         payment.id === id ? { 
//           ...payment, 
//           status: 'completed',
//           method,
//           notes
//         } : payment
//       )
//     )
//     setProcessingPayment(null)
//     alert(`Payment ${id} processed successfully!`)
//   }

//   // Refresh data
//   const refreshData = () => {
//     setIsLoading(true)
//     setTimeout(() => {
//       setIsLoading(false)
//     }, 1000)
//   }

//   // Payment Modal Component
//   const PaymentModal = ({ payment, onClose, onConfirm }) => {
//     const [paymentMethod, setPaymentMethod] = useState(payment?.method || 'upi')
//     const [notes, setNotes] = useState(payment?.notes || '')
//     const [upiId, setUpiId] = useState('')
//     const [accountNumber, setAccountNumber] = useState('')
//     const [ifscCode, setIfscCode] = useState('')

//     if (!payment) return null

//     const handleConfirm = () => {
//       // Validation based on payment method
//       if (paymentMethod === 'upi' && !upiId.trim()) {
//         alert('Please enter UPI ID')
//         return
//       }
//       if (paymentMethod === 'bank_transfer' && (!accountNumber.trim() || !ifscCode.trim())) {
//         alert('Please enter account number and IFSC code')
//         return
//       }
      
//       onConfirm(payment.id, paymentMethod, notes)
//     }

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
//           {/* Modal Header */}
//           <div className="flex items-center justify-between p-6 border-b">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Process Payment to {payment.partner.name}
//             </h3>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 p-1"
//             >
//               <FiX className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Modal Body */}
//           <div className="p-6 space-y-6">
//             {/* Payment Details */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Payment Details</label>
//               <div className="bg-gray-50 p-4 rounded-md">
//                 <div className="grid grid-cols-2 gap-4 mb-3">
//                   <div>
//                     <p className="text-xs text-gray-500">Payment ID</p>
//                     <p className="text-sm font-medium">{payment.id}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Amount</p>
//                     <p className="text-sm font-medium text-green-600">₹{payment.amount.toLocaleString()}</p>
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-xs text-gray-500">Deliveries</p>
//                     <p className="text-sm font-medium">{payment.deliveries}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Bonus/Deductions</p>
//                     <p className="text-sm font-medium">
//                       {payment.bonus > 0 && `+₹${payment.bonus} `}
//                       {payment.deductions > 0 && `-₹${payment.deductions}`}
//                       {payment.bonus === 0 && payment.deductions === 0 && 'None'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Payment Method */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
//               <div className="grid grid-cols-2 gap-2">
//                 {paymentMethods.map((method) => (
//                   <button
//                     key={method.value}
//                     type="button"
//                     onClick={() => setPaymentMethod(method.value)}
//                     className={`inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
//                       paymentMethod === method.value
//                         ? 'border-green-500 bg-green-50 text-green-700'
//                         : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
//                     }`}
//                   >
//                     {method.icon}
//                     <span className="ml-2">{method.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* UPI ID Field */}
//             {paymentMethod === 'upi' && (
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   UPI ID <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={upiId}
//                   onChange={(e) => setUpiId(e.target.value)}
//                   placeholder="partner@upi"
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
//                 />
//               </div>
//             )}

//             {/* Bank Transfer Fields */}
//             {paymentMethod === 'bank_transfer' && (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Account Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={accountNumber}
//                     onChange={(e) => setAccountNumber(e.target.value)}
//                     placeholder="Enter account number"
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     IFSC Code <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={ifscCode}
//                     onChange={(e) => setIfscCode(e.target.value)}
//                     placeholder="Enter IFSC code"
//                     className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
//                   />
//                 </div>
//               </>
//             )}
            
//             {/* Payment Notes */}
//             <div>
//               <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
//                 Payment Notes (Optional)
//               </label>
//               <textarea
//                 id="notes"
//                 rows={3}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
//                 placeholder="Add any notes about this payment..."
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//               />
//             </div>
//           </div>
          
//           {/* Modal Footer */}
//           <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-green-500"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={handleConfirm}
//               className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
//             >
//               <FiCreditCard className="inline mr-2 h-4 w-4" />
//               Confirm Payment
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">Delivery Partner Payments</h1>
//           <p className="text-gray-500">Manage and track payments to your delivery staff</p>
//         </div>
//         <div className="mt-4 md:mt-0 flex space-x-3">
//           <button 
//             onClick={refreshData}
//             disabled={isLoading}
//             className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
//           >
//             <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-green-100 text-green-600">
//               <FaRupeeSign className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
//               <p className="text-2xl font-semibold text-gray-900">₹12,450</p>
//               <p className="text-sm text-green-600">+5.2% from last week</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-blue-100 text-blue-600">
//               <FiClock className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Pending</h3>
//               <p className="text-2xl font-semibold text-gray-900">₹2,850</p>
//               <p className="text-sm text-blue-600">2 payments</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-red-100 text-red-600">
//               <FiXCircle className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Failed</h3>
//               <p className="text-2xl font-semibold text-gray-900">₹3,560</p>
//               <p className="text-sm text-red-600">1 payment</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//           <div className="flex items-center">
//             <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
//               <FiUser className="h-6 w-6" />
//             </div>
//             <div className="ml-4">
//               <h3 className="text-sm font-medium text-gray-500">Active Partners</h3>
//               <p className="text-2xl font-semibold text-gray-900">5</p>
//               <p className="text-sm text-yellow-600">3 zones covered</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Search */}
//           <div className="md:col-span-2">
//             <label htmlFor="search" className="sr-only">Search</label>
//             <div className="relative rounded-md shadow-sm">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiSearch className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 name="search"
//                 id="search"
//                 className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md"
//                 placeholder="Search Partners, IDs, or amounts..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Status Filter */}
//           <div>
//             <label htmlFor="status" className="sr-only">Status</label>
//             <select
//               id="status"
//               name="status"
//               className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//             >
//               {statusOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Date Range Filter */}
//           <div>
//             <label htmlFor="date-range" className="sr-only">Date Range</label>
//             <select
//               id="date-range"
//               name="date-range"
//               className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
//               value={dateRange}
//               onChange={(e) => setDateRange(e.target.value)}
//             >
//               {dateRangeOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Delivery Payments Table */}
//       <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Partner
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Payment ID
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Amount
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Deliveries
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Method
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredPayments.length > 0 ? (
//                 filteredPayments.map((payment) => (
//                   <tr key={payment.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {payment.partner.vehicle === 'Motorcycle' ? (
//                           <FaMotorcycle className="flex-shrink-0 h-5 w-5 text-gray-400" />
//                         ) : payment.partner.vehicle === 'Scooter' ? (
//                           <FiTruck className="flex-shrink-0 h-5 w-5 text-gray-400" />
//                         ) : (
//                           <FiMapPin className="flex-shrink-0 h-5 w-5 text-gray-400" />
//                         )}
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{payment.partner.name}</div>
//                           <div className="text-sm text-gray-500">{payment.partner.id}</div>
//                           <div className="text-xs text-gray-400">{payment.partner.contact}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {payment.id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">₹{payment.amount.toLocaleString()}</div>
//                       <div className="text-xs text-gray-500">
//                         {payment.bonus > 0 && `+₹${payment.bonus} bonus `}
//                         {payment.deductions > 0 && `-₹${payment.deductions} deductions`}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <FiPackage className="flex-shrink-0 mr-1 text-gray-400" />
//                         <span className="text-sm text-gray-900">{payment.deliveries}</span>
//                       </div>
//                       <div className="text-xs text-gray-500">{payment.partner.zone}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       <div className="flex items-center">
//                         {paymentMethods.find(m => m.value === payment.method)?.icon || <FaRupeeSign className="text-gray-500" />}
//                         <span className="ml-2">
//                           {paymentMethods.find(m => m.value === payment.method)?.label || payment.method}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {getStatusBadge(payment.status)}
//                       {payment.status === 'failed' && payment.failureReason && (
//                         <div className="text-xs text-red-500 mt-1">{payment.failureReason}</div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {payment.date}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <button className="text-green-600 hover:text-green-900 mr-3">
//                         Details
//                       </button>
//                       {payment.status === 'pending' && (
//                         <button 
//                           onClick={() => processPayment(payment.id)}
//                           className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
//                         >
//                           Pay
//                         </button>
//                       )}
//                       {payment.status === 'failed' && (
//                         <button 
//                           onClick={() => processPayment(payment.id)}
//                           className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
//                         >
//                           Retry
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
//                     No payments found matching your criteria
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
        
//         {/* Pagination */}
//         <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//           <div className="flex-1 flex justify-between sm:hidden">
//             <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//               Previous
//             </button>
//             <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//               Next
//             </button>
//           </div>
//           <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//             <div>
//               <p className="text-sm text-gray-700">
//                 Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
//                 <span className="font-medium">5</span> results
//               </p>
//             </div>
//             <div>
//               <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                 <button
//                   disabled
//                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                 >
//                   <span className="sr-only">Previous</span>
//                   <FiClock className="h-5 w-5" aria-hidden="true" />
//                 </button>
//                 <button
//                   aria-current="page"
//                   className="z-10 bg-green-50 border-green-500 text-green-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
//                 >
//                   1
//                 </button>
//                 <button
//                   disabled
//                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                 >
//                   <span className="sr-only">Next</span>
//                   <FiClock className="h-5 w-5" aria-hidden="true" />
//                 </button>
//               </nav>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Payment Modal */}
//       {processingPayment && (
//         <PaymentModal
//           payment={processingPayment}
//           onClose={() => setProcessingPayment(null)}
//           onConfirm={confirmPayment}
//         />
//       )}
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { 
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
  FiPackage,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi'
import { FaMotorcycle, FaRupeeSign } from 'react-icons/fa'

export default function DeliveryPartnerPayments() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7days')
  const [isLoading, setIsLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(null)
  
  // API Data States
  const [deliveryPayments, setDeliveryPayments] = useState([])
  const [statistics, setStatistics] = useState({
    totalPartners: 0,
    activePartners: 0,
    onlinePartners: 0,
    paymentStatus: {}
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  })

  // API Configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1'
  //const getAuthToken = () => localStorage.getItem('accessToken')
  
  const apiHeaders = {
    'Content-Type': 'application/json',
    //'Authorization': `Bearer ${getAuthToken()}`
  }

  // Payment method options with rupee icons
  const paymentMethods = [
    { value: 'upi', label: 'UPI', icon: <FiCreditCard className="text-indigo-500" /> },
    { value: 'bank_transfer', label: 'Bank Transfer', icon: <FiCreditCard className="text-blue-500" /> },
    { value: 'cash', label: 'Cash', icon: <FaRupeeSign className="text-green-500" /> },
    { value: 'wallet', label: 'Wallet', icon: <FaRupeeSign className="text-yellow-500" /> }
  ]

  // Status options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'processed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ]

  // Date range options
  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom range' }
  ]

  // Fetch delivery payments from API
  const fetchDeliveryPayments = async (page = 1) => {
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        sortBy: 'requestedAt',
        sortOrder: 'desc'
      })

      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter)
      }
      if (searchQuery.trim()) {
        queryParams.append('search', searchQuery.trim())
      }

      const response = await fetch(`${API_BASE_URL}/delivery-payments?${queryParams}`, {
        headers: apiHeaders
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setDeliveryPayments(data.data.payments)
        setPagination(data.data.pagination)
      } else {
        console.error('API Error:', data.message)
        alert('Failed to fetch payment data: ' + data.message)
      }
    } catch (error) {
      console.error('Error fetching delivery payments:', error)
      alert('Failed to fetch payment data. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/delivery-payments/statistics`, {
        headers: apiHeaders
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setStatistics(data.data)
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  // Update payment status
  const updatePaymentStatus = async (partnerId, paymentId, status, adminNote = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/delivery-payments/${partnerId}/${paymentId}`, {
        method: 'PATCH',
        headers: apiHeaders,
        body: JSON.stringify({ status, adminNote })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Refresh the payments list
        await fetchDeliveryPayments(pagination.currentPage)
        await fetchStatistics()
        return true
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Failed to update payment status: ' + error.message)
      return false
    }
  }

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchDeliveryPayments(1)
    fetchStatistics()
  }, [statusFilter, searchQuery])

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== '') {
        fetchDeliveryPayments(1)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Status badges
  const getStatusBadge = (status) => {
    const colorClasses = {
      processed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800'
    }

    const icons = {
      processed: <FiCheckCircle className="mr-1" />,
      pending: <FiClock className="mr-1" />,
      approved: <FiCheckCircle className="mr-1" />,
      rejected: <FiXCircle className="mr-1" />
    }

    const labels = {
      processed: 'Completed',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[status] || colorClasses.rejected}`}>
        {icons[status]}
        {labels[status] || status}
      </span>
    )
  }

  // Get payment method display
  const getPaymentMethodDisplay = (method) => {
    const methodObj = paymentMethods.find(m => m.value === method?.toLowerCase())
    return methodObj || { icon: <FaRupeeSign className="text-gray-500" />, label: method || 'N/A' }
  }

  // Get vehicle icon
  const getVehicleIcon = (vehicleType) => {
    switch (vehicleType?.toLowerCase()) {
      case 'motorcycle':
        return <FaMotorcycle className="flex-shrink-0 h-5 w-5 text-gray-400" />
      case 'bicycle':
        return <FiMapPin className="flex-shrink-0 h-5 w-5 text-gray-400" />
      default:
        return <FiTruck className="flex-shrink-0 h-5 w-5 text-gray-400" />
    }
  }

  // Process payment - opens modal
  const processPayment = (payment) => {
    setProcessingPayment(payment)
  }

  // Confirm payment - updates status
  const confirmPayment = async (payment, method, notes) => {
    const success = await updatePaymentStatus(
      payment.partnerId, 
      payment.paymentId.replace('DEL-', ''), 
      'processed', 
      notes
    )
    
    if (success) {
      setProcessingPayment(null)
      alert(`Payment ${payment.paymentId} processed successfully!`)
    }
  }

  // Refresh data
  const refreshData = async () => {
    await fetchDeliveryPayments(pagination.currentPage)
    await fetchStatistics()
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchDeliveryPayments(newPage)
    }
  }

  // Calculate statistics for display
  const totalPaid = deliveryPayments
    .filter(p => p.status === 'processed')
    .reduce((sum, p) => sum + (p.netAmount || p.amount), 0)

  const totalPending = deliveryPayments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + (p.netAmount || p.amount), 0)

  const totalFailed = deliveryPayments
    .filter(p => p.status === 'rejected')
    .reduce((sum, p) => sum + (p.netAmount || p.amount), 0)

  // Payment Modal Component
  const PaymentModal = ({ payment, onClose, onConfirm }) => {
    const [paymentMethod, setPaymentMethod] = useState('upi')
    const [notes, setNotes] = useState('')
    const [upiId, setUpiId] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [ifscCode, setIfscCode] = useState('')

    if (!payment) return null

    const handleConfirm = () => {
      // Validation based on payment method
      if (paymentMethod === 'upi' && !upiId.trim()) {
        alert('Please enter UPI ID')
        return
      }
      if (paymentMethod === 'bank_transfer' && (!accountNumber.trim() || !ifscCode.trim())) {
        alert('Please enter account number and IFSC code')
        return
      }
      
      onConfirm(payment, paymentMethod, notes)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Process Payment to {payment.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Payment Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Details</label>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Payment ID</p>
                    <p className="text-sm font-medium">{payment.paymentId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-medium text-green-600">₹{(payment.netAmount || payment.amount)?.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Deliveries</p>
                    <p className="text-sm font-medium">{payment.deliveries}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bonus/Deductions</p>
                    <p className="text-sm font-medium">
                      {payment.bonus > 0 && `+₹${payment.bonus} `}
                      {payment.deductions > 0 && `-₹${payment.deductions}`}
                      {(payment.bonus === 0 || !payment.bonus) && (payment.deductions === 0 || !payment.deductions) && 'None'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      paymentMethod === method.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {method.icon}
                    <span className="ml-2">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* UPI ID Field */}
            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="partner@upi"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            )}

            {/* Bank Transfer Fields */}
            {paymentMethod === 'bank_transfer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter account number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    placeholder="Enter IFSC code"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </>
            )}
            
            {/* Payment Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Notes (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Add any notes about this payment..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
            >
              <FiCreditCard className="inline mr-2 h-4 w-4" />
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Delivery Partner Payments</h1>
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
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaRupeeSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
              <p className="text-2xl font-semibold text-gray-900">₹{totalPaid.toLocaleString()}</p>
              <p className="text-sm text-green-600">{statistics.paymentStatus?.processed?.count || 0} payments</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FiClock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-semibold text-gray-900">₹{totalPending.toLocaleString()}</p>
              <p className="text-sm text-blue-600">{statistics.paymentStatus?.pending?.count || 0} payments</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FiXCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
              <p className="text-2xl font-semibold text-gray-900">₹{totalFailed.toLocaleString()}</p>
              <p className="text-sm text-red-600">{statistics.paymentStatus?.rejected?.count || 0} payments</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiUser className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Partners</h3>
              <p className="text-2xl font-semibold text-gray-900">{statistics.activePartners}</p>
              <p className="text-sm text-yellow-600">{statistics.onlinePartners} online</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-black">
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
                placeholder="Search Partners, IDs, or amounts..."
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
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
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
              {dateRangeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Delivery Payments Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <FiRefreshCw className="animate-spin h-8 w-8 text-green-500" />
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partner
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
              {deliveryPayments.length > 0 ? (
                deliveryPayments.map((payment) => {
                  const methodDisplay = getPaymentMethodDisplay(payment.paymentMethod)
                  
                  return (
                    <tr key={payment.paymentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getVehicleIcon(payment.vehicle)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{payment.name}</div>
                            <div className="text-sm text-gray-500">{payment.employeeId}</div>
                            <div className="text-xs text-gray-400">{payment.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.paymentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{(payment.amount || payment.amount)?.toLocaleString()}</div>
                        {/* <div className="text-xs text-gray-500">
                          {payment.bonus > 0 && `+₹${payment.bonus} bonus `}
                          {payment.deductions > 0 && `-₹${payment.deductions} deductions`}
                        </div> */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FiPackage className="flex-shrink-0 mr-1 text-gray-400" />
                          <span className="text-sm text-gray-900">{payment.deliveries}</span>
                        </div>
                        <div className="text-xs text-gray-500">{payment.area}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          {methodDisplay.icon}
                          <span className="ml-2">{methodDisplay.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                        {payment.adminNote && (
                          <div className="text-xs text-gray-500 mt-1">{payment.adminNote}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          Details
                        </button>
                        {payment.status === 'pending' && (
                          <button 
                            onClick={() => processPayment(payment)}
                            className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                          >
                            Pay
                          </button>
                        )}
                        {payment.status === 'rejected' && (
                          <button 
                            onClick={() => processPayment(payment)}
                            className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50"
                          >
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    {isLoading ? 'Loading payments...' : 'No payments found matching your criteria'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button 
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.limit) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.limit, pagination.totalRecords)}
                </span> of{' '}
                <span className="font-medium">{pagination.totalRecords}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  const isCurrentPage = pageNum === pagination.currentPage
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        isCurrentPage
                          ? 'z-10 bg-green-50 border-green-500 text-green-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {processingPayment && (
        <PaymentModal
          payment={processingPayment}
          onClose={() => setProcessingPayment(null)}
          onConfirm={confirmPayment}
        />
      )}
    </div>
  )
}