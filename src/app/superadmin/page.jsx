"use client"

import { useEffect, useState } from 'react'
import { 
  FiTrendingUp, 
  FiShoppingCart, 
  FiUsers, 
  FiPackage,
  FiAlertCircle
} from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { icon: FiTrendingUp, title: "Today's Revenue", value: "₹0", change: "", trend: 'up', description: "Total paid (customers)" },
    { icon: FiShoppingCart, title: "Total Payments", value: "0", change: "", trend: 'up', description: "Customer payments" },
    { icon: FiUsers, title: "Payouts Processed", value: "0", change: "", trend: 'up', description: "Delivery payouts" },
    { icon: FiPackage, title: "Products", value: "-", change: "", trend: 'up', description: "Active products" }
  ])
  const [revenueData, setRevenueData] = useState([])
  const [alerts, setAlerts] = useState([])
  const [recentPayments, setRecentPayments] = useState([])
  const [deliverySummary, setDeliverySummary] = useState({ processed: 0, pending: 0, rejected: 0 })

  const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000'}/api/v1`
  const headers = () => {
    const token = localStorage.getItem('superadmin_token') || sessionStorage.getItem('superadmin_token')
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  }

  useEffect(() => {
    const run = async () => {
      try {
        const [custStatsRes, daStatsRes, custPaymentsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/payments/statistics`, { headers: headers() }).catch(() => null),
          fetch(`${API_BASE_URL}/delivery-payments/statistics`, { headers: headers() }).catch(() => null),
          fetch(`${API_BASE_URL}/payments?limit=10&sortBy=createdAt&sortOrder=desc`, { headers: headers() }).catch(() => null)
        ])

        const custStats = custStatsRes && custStatsRes.ok ? await custStatsRes.json() : null
        const daStats = daStatsRes && daStatsRes.ok ? await daStatsRes.json() : null
        const custPayments = custPaymentsRes && custPaymentsRes.ok ? await custPaymentsRes.json() : null

        const paidTotal = custStats?.data?.paidTotalAmount || custStats?.data?.paid?.totalAmount || 0
        const totalPayments = custStats?.data?.totalRecords || custStats?.data?.count || 0
        const processedCount = daStats?.data?.paymentStatus?.processed?.count || 0

        setStats(prev => [
          { ...prev[0], value: `₹${Number(paidTotal).toLocaleString()}` },
          { ...prev[1], value: `${totalPayments}` },
          { ...prev[2], value: `${processedCount}` },
          prev[3]
        ])

        const chart = custStats?.data?.lastSixDays || []
        setRevenueData(chart.map(d => ({ name: d.date || d.label || '', revenue: d.amount || d.total || 0 })))

        const failedPayments = custStats?.data?.failed?.count || 0
        const rejectedPayouts = daStats?.data?.paymentStatus?.rejected?.count || 0
        const pendingPayouts = daStats?.data?.paymentStatus?.pending?.count || 0
        const newAlerts = []
        if (failedPayments > 0) newAlerts.push({ type: 'payment', title: `${failedPayments} Failed Transactions`, description: 'Require manual review', priority: 'high' })
        if (pendingPayouts > 0) newAlerts.push({ type: 'payout', title: `${pendingPayouts} Pending Payouts`, description: 'Delivery associates waiting for approval', priority: 'medium' })
        if (rejectedPayouts > 0) newAlerts.push({ type: 'payout', title: `${rejectedPayouts} Rejected Payouts`, description: 'Review and retry if needed', priority: 'low' })
        setAlerts(newAlerts)

        const records = Array.isArray(custPayments?.data?.records) ? custPayments.data.records : []
        setRecentPayments(records.slice(0, 4))

        setDeliverySummary({
          processed: daStats?.data?.paymentStatus?.processed?.count || 0,
          pending: daStats?.data?.paymentStatus?.pending?.count || 0,
          rejected: daStats?.data?.paymentStatus?.rejected?.count || 0
        })
      } catch {}
    }
    run()
  }, [])

  const deliveryStats = [
    { name: 'Processed', value: deliverySummary.processed, color: 'bg-green-500' },
    { name: 'Pending', value: deliverySummary.pending, color: 'bg-yellow-500' },
    { name: 'Rejected', value: deliverySummary.rejected, color: 'bg-red-500' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with Farm Fairy today.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <select className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-green-500 focus:ring-green-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">{stat.description}</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <stat.icon className="text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Revenue Analytics</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md">Daily</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Weekly</button>
              <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">Monthly</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts and Delivery */}
        <div className="space-y-6">
          {/* System Alerts */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">System Alerts</h2>
              <button className="text-sm text-green-600 hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 ${
                    alert.priority === 'high' ? 'bg-red-100 text-red-600' :
                    alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <FiAlertCircle />
                  </div>
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-gray-500">{alert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Performance */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Delivery Performance</h2>
            <div className="flex items-center justify-between">
              {deliveryStats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`h-2 w-16 mx-auto mb-2 rounded-full ${stat.color}`}></div>
                  <p className="text-sm text-gray-500">{stat.name}</p>
                  <p className="text-xl font-bold">{stat.value}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Customer Payments</h2>
          <button className="text-sm text-green-600 hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPayments.map((p, idx) => (
                <tr key={p.id || p.paymentId || idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id || p.paymentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.customer?.name || p.customerName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{(p.amount || p.totalAmount || 0).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.method || p.paymentMethod || ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      (p.status || p.paymentStatus) === 'paid' ? 'bg-green-100 text-green-800' :
                      (p.status || p.paymentStatus) === 'pending' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {(p.status || p.paymentStatus || '').toString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.createdAt || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Top Products</h2>
            <button className="text-sm text-green-600 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {['Organic Apples', 'Farm Fresh Eggs', 'Whole Wheat Bread'].map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{product}</span>
                <span className="text-sm text-gray-500">{(index + 1) * 24} sold</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Top Vendors</h2>
            <button className="text-sm text-green-600 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {['Green Valley Farms', 'Organic Harvest', 'Dairy Delight'].map((vendor, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{vendor}</span>
                <span className="text-sm text-gray-500">₹{(index + 1) * 12500}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Delivery Zones</h2>
            <button className="text-sm text-green-600 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {['North District', 'Central City', 'South Suburbs'].map((zone, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{zone}</span>
                <span className="text-sm text-gray-500">{(index + 5) * 7} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}