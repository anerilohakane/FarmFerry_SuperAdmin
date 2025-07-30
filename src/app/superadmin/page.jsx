'use client'

import { 
  FiTrendingUp, 
  FiShoppingCart, 
  FiUsers, 
  FiPackage,
  FiActivity,
  FiCalendar,
  FiCreditCard,
  FiTruck,
  FiAlertCircle
} from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
]

export default function DashboardPage() {
  // Dashboard metrics
  const stats = [
    { 
      icon: FiTrendingUp, 
      title: "Today's Revenue", 
      value: "₹1,24,567", 
      change: "+12%", 
      trend: 'up',
      description: "Compared to yesterday"
    },
    { 
      icon: FiShoppingCart, 
      title: "Total Orders", 
      value: "1,234", 
      change: "+8%", 
      trend: 'up',
      description: "24 new today"
    },
    { 
      icon: FiUsers, 
      title: "Active Users", 
      value: "8,456", 
      change: "+5%", 
      trend: 'up',
      description: "385 active now"
    },
    { 
      icon: FiPackage, 
      title: "Products", 
      value: "2,567", 
      change: "+3%", 
      trend: 'up',
      description: "45 low stock"
    }
  ]

  // Recent orders
  const recentOrders = [
    { 
      id: "#ORD-1001", 
      customer: "John Doe", 
      amount: "₹1,250", 
      status: "delivered", 
      date: "2023-06-15",
      items: 5
    },
    { 
      id: "#ORD-1002", 
      customer: "Jane Smith", 
      amount: "₹850", 
      status: "processing", 
      date: "2023-06-15",
      items: 3
    },
    { 
      id: "#ORD-1003", 
      customer: "Robert Johnson", 
      amount: "₹420", 
      status: "cancelled", 
      date: "2023-06-14",
      items: 2
    },
    { 
      id: "#ORD-1004", 
      customer: "Emily Davis", 
      amount: "₹1,560", 
      status: "delivered", 
      date: "2023-06-14",
      items: 7
    }
  ]

  // System alerts
  const alerts = [
    {
      type: "payment",
      title: "3 Failed Transactions",
      description: "Require manual review",
      priority: "high"
    },
    {
      type: "inventory",
      title: "Low Stock Items",
      description: "15 products below threshold",
      priority: "medium"
    },
    {
      type: "vendor",
      title: "New Vendor Applications",
      description: "2 pending approvals",
      priority: "low"
    }
  ]

  // Delivery performance
  const deliveryStats = [
    { name: 'On Time', value: 87, color: 'bg-green-500' },
    { name: 'Delayed', value: 9, color: 'bg-yellow-500' },
    { name: 'Failed', value: 4, color: 'bg-red-500' }
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

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <button className="text-sm text-green-600 hover:underline">View All Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
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