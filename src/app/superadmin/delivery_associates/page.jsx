"use client";

import React, { useState, useEffect } from "react";
import { Search, Loader2, Truck, Star, Circle, User } from "lucide-react";
import { getDeliveryAssociates } from "../../../utils/superadminApi";

const DeliveryAssociatesPage = () => {
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAssociates();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchAssociates = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDeliveryAssociates(currentPage, 10, searchTerm, statusFilter);
      if (res.success) {
        setAssociates(res.data.deliveryAssociates);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch delivery associates");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Associates</h1>
          <p className="text-gray-500">Manage your delivery fleet and partners</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search name, email, or phone..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 bg-white text-sm"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Duty">On Duty</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Associate
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Loading delivery associates...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-red-500 bg-red-50 p-4 rounded-lg inline-block">
                      <p className="font-medium">Error loading data</p>
                      <p className="text-sm opacity-80">{error}</p>
                    </div>
                  </td>
                </tr>
              ) : associates.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No delivery associates found
                  </td>
                </tr>
              ) : (
                associates.map((associate) => (
                  <tr
                    key={associate._id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                           {associate.name ? associate.name[0] : <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {associate.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {associate._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="w-4 h-4 text-gray-400" />
                        {associate.vehicle?.type || "Unknown Vehicle"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          associate.status === "Active" || associate.status === "On Duty"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <Circle className={`w-1.5 h-1.5 fill-current ${
                            associate.status === "Active" || associate.status === "On Duty" ? "text-green-600" : "text-gray-500"
                        }`} />
                        {associate.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                <span>{associate.rating || 0}</span>
                                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            </div>
                            <p className="text-xs text-gray-500">{associate.ordersCompleted || 0} orders completed</p>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                       <div className="space-y-0.5">
                           <p>{associate.email}</p>
                           <p className="text-xs text-gray-500">{associate.phone}</p>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && !error && associates.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryAssociatesPage;
