"use client";

import { useState, useEffect } from "react";
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
  FiRefreshCw,
  FiEye,
  FiX,
} from "react-icons/fi";
import { FaGooglePay, FaRupeeSign, FaExchangeAlt } from "react-icons/fa";
import { SiPaytm, SiRazorpay } from "react-icons/si";

// API Configuration
const API_BASE_URL = 'http://localhost:9000/api/v1';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  console.log('Token found:', !!token); // Debug log
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export default function SupplierPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7days");
  const [isLoading, setIsLoading] = useState(false);

  // States to control modals and selected payment
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [payMethod, setPayMethod] = useState("bank_transfer");
  const [payProcessing, setPayProcessing] = useState(false);
  const [paidPaymentId, setPaidPaymentId] = useState(null);

  // Dynamic supplier data states
  const [suppliers, setSuppliers] = useState([]);
  const [suppliersLoading, setSuppliersLoading] = useState(true);
  const [suppliersError, setSuppliersError] = useState(null);

  // Sample supplier payments data with dynamic supplier integration
  const [supplierPayments, setSupplierPayments] = useState([]);

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      setSuppliersLoading(true);
      setSuppliersError(null);

      console.log('Fetching suppliers from:', `${API_BASE_URL}/supplier-payments/business-names`);

      const response = await fetch(`${API_BASE_URL}/supplier-payments/business-names`, {
        headers: {
          'Content-Type': 'application/json'
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);

      if (data.success && data.data) {
        console.log('Suppliers fetched:', data.data.length);
        setSuppliers(data.data);
        // Generate sample payments with real supplier data
        generateSamplePayments(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch suppliers');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setSuppliersError(error.message);
      // Fallback to sample data if API fails
      generateSamplePayments([]);
    } finally {
      setSuppliersLoading(false);
    }
  };

  // Generate sample payment data using real suppliers
  const generateSamplePayments = (realSuppliers) => {
    const samplePayments = [];
    const paymentMethods = ["bank_transfer", "upi", "cheque", "card", "cash"];
    const statuses = ["completed", "pending", "failed", "cancelled", "partially_paid"];

    // If we have real suppliers, use them; otherwise use fallback data
    const suppliersToUse = realSuppliers.length > 0 ? realSuppliers : [
      { _id: "SUP-001", businessName: "Fresh Farm Produce" },
      { _id: "SUP-002", businessName: "Organic Dairy Co." },
      { _id: "SUP-003", businessName: "Grain Distributors" },
      { _id: "SUP-004", businessName: "Premium Spices" },
      { _id: "SUP-005", businessName: "Cold Storage Logistics" },
    ];

    suppliersToUse.forEach((supplier, index) => {
      const payment = {
        id: `SP-${1001 + index}`,
        supplier: { 
          name: supplier.businessName,
          id: supplier._id,
          contact: `987654321${index}` // Generate sample contact
        },
        amount: Math.floor(Math.random() * 20000) + 5000, // Random amount between 5000-25000
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date in last 30 days
        dueDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random due date in next 10 days
        status: statuses[Math.floor(Math.random() * statuses.length)],
        method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        invoice: { 
          number: `INV-${789456 + index}`, 
          date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        deliveryCount: Math.floor(Math.random() * 30) + 10,
        notes: `Payment for ${supplier.businessName}`,
        ...(Math.random() > 0.8 && { failureReason: "Insufficient funds" }) // 20% chance of failure reason
      };
      samplePayments.push(payment);
    });

    setSupplierPayments(samplePayments);
  };

  // Fetch suppliers on component mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Filtering supplier payments
  const filteredPayments = supplierPayments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoice.number.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;

    const matchesMethod = paymentMethodFilter === "all" || payment.method === paymentMethodFilter;

    const matchesDateRange = dateRange === "7days" || dateRange === "30days" || dateRange === "90days";

    return matchesSearch && matchesStatus && matchesMethod && matchesDateRange;
  });

  // Payment methods with icons
  const paymentMethods = [
    { value: "bank_transfer", label: "Bank Transfer", icon: <FiCreditCard className="text-blue-500" /> },
    { value: "upi", label: "UPI Payment", icon: <SiRazorpay className="text-indigo-600" /> },
    { value: "cheque", label: "Cheque", icon: <FiFileText className="text-green-500" /> },
    { value: "card", label: "Credit Card", icon: <FiCreditCard className="text-blue-500" /> },
    { value: "cash", label: "Cash", icon: <FaRupeeSign className="text-green-500" /> },
  ];

  // Status options for badge
  const statusOptions = [
    { value: "completed", label: "Completed", color: "green" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "failed", label: "Failed", color: "red" },
    { value: "cancelled", label: "Cancelled", color: "gray" },
    { value: "partially_paid", label: "Partially Paid", color: "blue" },
  ];

  // Get status badge JSX
  const getStatusBadge = (status) => {
    const option = statusOptions.find((opt) => opt.value === status) || { label: "Unknown", color: "gray" };
    const colorClasses = {
      green: "bg-green-100 text-green-800",
      yellow: "bg-yellow-100 text-yellow-800",
      red: "bg-red-100 text-red-800",
      blue: "bg-blue-100 text-blue-800",
      gray: "bg-gray-100 text-gray-800",
    };

    const icons = {
      completed: <FiCheckCircle className="mr-1" />,
      pending: <FiClock className="mr-1" />,
      failed: <FiXCircle className="mr-1" />,
      cancelled: <FiXCircle className="mr-1" />,
      partially_paid: <FaRupeeSign className="mr-1" />,
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[option.color]}`}>
        {icons[status] || null}
        {option.label}
      </span>
    );
  };

  // Stats summary calculation
  const calculateStats = () => {
    if (supplierPayments.length === 0) {
      return [
        { title: "Total Payments", value: <><FaRupeeSign className="inline mb-1" /> 0</>, change: "0%", description: "0 transactions" },
        { title: "Completed", value: <><FaRupeeSign className="inline mb-1" /> 0</>, change: "0%", description: "0% of total" },
        { title: "Pending", value: <><FaRupeeSign className="inline mb-1" /> 0</>, change: "0%", description: "0% of total" },
        { title: "Failed", value: <><FaRupeeSign className="inline mb-1" /> 0</>, change: "0%", description: "0% of total" },
      ];
    }

    const total = supplierPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const completed = supplierPayments.filter((p) => p.status === "completed").reduce((sum, payment) => sum + payment.amount, 0);
    const pending = supplierPayments.filter((p) => p.status === "pending").reduce((sum, payment) => sum + payment.amount, 0);
    const failed = supplierPayments.filter((p) => p.status === "failed").reduce((sum, payment) => sum + payment.amount, 0);

    return [
      { title: "Total Payments", value: <><FaRupeeSign className="inline mb-1" /> {total.toLocaleString()}</>, change: "+15%", description: `${supplierPayments.length} transactions` },
      { title: "Completed", value: <><FaRupeeSign className="inline mb-1" /> {completed.toLocaleString()}</>, change: "+12%", description: `${Math.round((completed / total) * 100)}% of total` },
      { title: "Pending", value: <><FaRupeeSign className="inline mb-1" /> {pending.toLocaleString()}</>, change: pending > 0 ? "-5%" : "0%", description: `${Math.round((pending / total) * 100)}% of total` },
      { title: "Failed", value: <><FaRupeeSign className="inline mb-1" /> {failed.toLocaleString()}</>, change: failed > 0 ? "+3%" : "0%", description: `${Math.round((failed / total) * 100)}% of total` },
    ];
  };

  const stats = calculateStats();

  // Loading simulation and refresh data
  const refreshData = () => {
    setIsLoading(true);
    fetchSuppliers();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Open payment details modal
  const openPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  // Close payment details modal
  const closePaymentDetails = () => {
    setSelectedPayment(null);
    setShowPaymentDetails(false);
  };

  // Open payment modal and preset values
  const openPayModal = (payment) => {
    setSelectedPayment(payment);
    setPayMethod(payment.method);
    setShowPaymentModal(true);
    setPaidPaymentId(null);
  };

  // Close payment modal
  const closePayModal = () => {
    setSelectedPayment(null);
    setShowPaymentModal(false);
    setPayProcessing(false);
  };

  // Simulate pay processing
  const processPayment = () => {
    setPayProcessing(true);
    setTimeout(() => {
      setPayProcessing(false);
      setPaidPaymentId(selectedPayment.id);
    }, 1500);
  };

  // Show loading state while suppliers are being fetched
  if (suppliersLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-3 text-gray-600">Loading supplier data...</span>
        </div>
      </div>
    );
  }

  // Show error state if suppliers failed to load
  if (suppliersError && suppliers.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <FiXCircle className="text-red-500 mr-2" />
            <span className="text-red-700">Error loading supplier data: {suppliersError}</span>
          </div>
          <button
            onClick={fetchSuppliers}
            className="mt-3 inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
          >
            <FiRefreshCw className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Supplier Payments</h1>
          <p className="text-gray-500">
            Manage and track all supplier payments and settlements
            {suppliers.length > 0 && (
              <span className="ml-2 text-sm text-green-600">
                ({suppliers.length} suppliers loaded)
              </span>
            )}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <FiRefreshCw className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => alert("Implement New Payment creation")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FiPlus className="mr-2" />
            New Payment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-gray-800">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{isLoading || suppliersLoading ? "..." : stat.value}</p>
                <div className="flex items-center mt-1">
                  <span
                    className={`text-sm ${
                      stat.change.startsWith("+")
                        ? "text-green-500"
                        : stat.change.startsWith("-")
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">{stat.description}</span>
                </div>
              </div>
              <div
                className={`p-2 rounded-full ${
                  stat.change.startsWith("+")
                    ? "bg-green-100 text-green-600"
                    : stat.change.startsWith("-")
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <FaRupeeSign className="text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-black">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
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
          <div>
            <select
              id="status"
              name="status"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <select
              id="payment-method"
              name="payment-method"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 rounded-md"
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
            >
              <option value="all">All Methods</option>
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Supplier Payments Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                      <FaRupeeSign className="inline mr-1" />
                      {payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        {paymentMethods.find((m) => m.value === payment.method)?.icon || (
                          <FaRupeeSign className="text-gray-500" />
                        )}
                        <span className="ml-2">
                          {paymentMethods.find((m) => m.value === payment.method)?.label || payment.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="text-sm text-gray-900">{payment.invoice.number}</div>
                      <div className="text-xs text-gray-500">{payment.invoice.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(payment.status)}
                      {payment.status === "failed" && payment.failureReason && (
                        <div className="text-xs text-red-500 mt-1">{payment.failureReason}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{payment.date}</div>
                      <div className="text-xs text-gray-400">Due: {payment.dueDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex space-x-2 justify-end">
                      <button
                        onClick={() => openPaymentDetails(payment)}
                        className="text-green-600 hover:text-green-900 inline-flex items-center"
                        aria-label={`View details of payment ${payment.id}`}
                      >
                        <FiEye className="mr-1" size={15}/>
                      </button>
                      {payment.status !== "completed" && (
                        <button
                          onClick={() => openPayModal(payment)}
                         className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          aria-label={`Pay payment ${payment.id}`}
                        >
                          Pay
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    {suppliersLoading ? "Loading payments..." : "No payments found matching your criteria"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {showPaymentDetails && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closePaymentDetails}
              aria-label="Close payment details"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-xl font-bold mb-4">Supplier Payment Details</h2>

            <div className="text-sm text-gray-700 space-y-2">
              <div>
                <strong>Payment ID:</strong> {selectedPayment.id}
              </div>
              <div>
                <strong>Supplier:</strong> {selectedPayment.supplier.name} ({selectedPayment.supplier.id})
              </div>
              <div>
                <strong>Contact:</strong> {selectedPayment.supplier.contact}
              </div>
              <div className="flex items-center">
                <strong>Amount:&nbsp;</strong>
                <FaRupeeSign />
                <span>{selectedPayment.amount.toLocaleString()}</span>
              </div>
              <div>
                <strong>Method:</strong>{" "}
                {paymentMethods.find((m) => m.value === selectedPayment.method)?.label || selectedPayment.method}
              </div>
              <div>
                <strong>Invoice Number:</strong> {selectedPayment.invoice.number}
              </div>
              <div>
                <strong>Invoice Date:</strong> {selectedPayment.invoice.date}
              </div>
              <div>
                <strong>Status:</strong> {getStatusBadge(selectedPayment.status)}
              </div>
              {selectedPayment.notes && (
                <div>
                  <strong>Notes:</strong> {selectedPayment.notes}
                </div>
              )}
              {selectedPayment.status === "failed" && selectedPayment.failureReason && (
                <div className="text-red-600 mt-2">
                  <strong>Failure Reason:</strong> {selectedPayment.failureReason}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={closePayModal}
              aria-label="Close pay modal"
            >
              <FiX size={24} />
            </button>

            <h2 className="text-xl font-bold mb-4">Make Payment</h2>

            <div className="text-sm text-gray-700 mb-4 space-y-2">
              <div>
                <strong>Payment ID:</strong> {selectedPayment.id}
              </div>
              <div>
                <strong>Supplier:</strong> {selectedPayment.supplier.name} ({selectedPayment.supplier.id})
              </div>
              <div className="flex items-center">
                <strong>Amount:&nbsp;</strong>
                <FaRupeeSign />
                <span>{selectedPayment.amount.toLocaleString()}</span>
              </div>
              <div>
                <strong>Invoice Number:</strong> {selectedPayment.invoice.number}
              </div>
              <div>
                <strong>Invoice Date:</strong> {selectedPayment.invoice.date}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">Select Payment Method</label>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label key={method.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payment-method"
                      value={method.value}
                      checked={payMethod === method.value}
                      disabled={payProcessing || paidPaymentId === selectedPayment.id}
                      onChange={() => setPayMethod(method.value)}
                      className="form-radio text-green-600"
                    />
                    {method.icon}
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium"
                onClick={closePayModal}
                disabled={payProcessing}
              >
                Cancel
              </button>
              {paidPaymentId === selectedPayment.id ? (
                <button className="px-4 py-2 rounded-md bg-green-100 text-green-900 flex items-center space-x-2 border border-green-300 cursor-default" disabled>
                  <FiCheckCircle />
                  <span>Paid</span>
                </button>
              ) : (
                <button
                  className={`px-4 py-2 rounded-md bg-blue-600 text-white flex items-center space-x-2 font-medium shadow ${
                    payProcessing ? "opacity-70" : "hover:bg-blue-700"
                  }`}
                  disabled={payProcessing}
                  onClick={processPayment}
                >
                  {payProcessing ? (
                    <>
                      <FiRefreshCw className="animate-spin mr-2" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FaRupeeSign />
                      <span>Pay</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}