"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiBell,
  FiSearch,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiMaximize2,
  FiMinimize2,
  FiTruck,
  FiClipboard,
  FiAlertCircle,
  FiCreditCard,
  FiDollarSign,
  FiZap,
  FiSettings,
  FiRefreshCw,
  FiPieChart,
  FiPackage,
  FiShield,
  FiDatabase
} from "react-icons/fi";
import { FaRupeeSign } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import { HiOutlineCash, HiOutlineCurrencyRupee } from 'react-icons/hi';
import { SuperAdminProfileProvider, useSuperAdminProfile } from "../../context/SuperAdminProfileContext";

const AdminLayoutInner = ({ children }) => {
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    // For now, we'll skip authentication check since we don't have the auth utilities
    // You can add authentication logic here later
  }, [router]);

  // Sidebar control states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Navbar dropdown states
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Notifications (sample data, replace with real)
  const [notifications, setNotifications] = useState([]);

  // Search states
  const [searchValue, setSearchValue] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Active sidebar item stored in localStorage for persistence
  const [activeItem, setActiveItem] = useState("Payment Records");
  
  // Initialize activeItem from localStorage after hydration
  useEffect(() => {
    const storedActive = localStorage.getItem("adminSidebarActive");
    if (storedActive) {
      setActiveItem(storedActive);
    }
  }, []);

  // Fullscreen mode state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs for click outside detection
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Sidebar menu focused on payment management & key super admin sections
  const sidebarItems = [
    {
      icon: FiHome,
      label: "Dashboard",
      description: "Overview & Analytics",
      route: "/superadmin",
    },
    {
      icon: FiUser,
      label: "Customers",
      description: "Manage registered customers",
      route: "/superadmin/customers",
    },
    {
      icon: FiTruck,
      label: "Suppliers",
      description: "Manage product suppliers",
      route: "/superadmin/suppliers",
    },
    {
      icon: MdDeliveryDining,
      label: "Delivery Associates",
      description: "Manage delivery fleet",
      route: "/superadmin/delivery_associates",
    },
    {
      icon: FiDatabase,
      label: "Customer Payment Records",
      description: "View all payment transactions",
      route: "/superadmin/customer_payment_Records",
    },
    {
      icon: HiOutlineCurrencyRupee,
      label: "Supplier Payments",
      description: "Manage supplier payouts",
      route: "/superadmin/supplier_payments",
    },
    {
      icon: MdDeliveryDining,
      label: "Delivery Partner Payment Records",
      description: "Track delivery employee payments",
      route: "/superadmin/delivery_employee_payment",
    },
    {
      icon: FaRupeeSign,
      label: "Refund Management",
      description: "Process and review refunds",
      route: "/superadmin/refund",
    },
    {
      icon: FiSettings,
      label: "Settings",
      description: "Configure system & payment options",
      route: "/superadmin/settings",
    },
  ];

  // Sample payment-focused notifications (Replace with real backend data)
  const initialNotifications = [
    {
      id: 101,
      type: "success",
      title: "Payment Successful",
      message: "Order #56789 paid via UPI (₹1,250.00).",
      time: "3 minutes ago",
      unread: true,
      icon: FiDollarSign,
      color: "green",
    },
    {
      id: 102,
      type: "failure",
      title: "Payment Failed",
      message: "Payment for Order #56790 declined (₹899.00).",
      time: "15 minutes ago",
      unread: true,
      icon: FiAlertCircle,
      color: "red",
    },
    {
      id: 103,
      type: "refund",
      title: "Refund Processed",
      message: "Refund issued for Order #56788 (₹1,499.00).",
      time: "1 hour ago",
      unread: false,
      icon: FiRefreshCw,
      color: "blue",
    },
    {
      id: 104,
      type: "supplier",
      title: "Supplier Payout",
      message: "Paid ₹12,850.00 to Fresh Farms Co.",
      time: "2 hours ago",
      unread: false,
      icon: FiTruck,
      color: "indigo",
    },
  ];

  // Initialize notifications on mount
  useEffect(() => {
    setNotifications(initialNotifications);
  }, []);

  // Responsive sidebar toggle based on window size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fullscreen API toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Failed to enter fullscreen", err));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error("Failed to exit fullscreen", err));
    }
  };

  // Notification unread count
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Mark notification as read handler
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, unread: false })));
  };

  // Set sidebar active item and navigate
  const handleItemClick = (item) => {
    setActiveItem(item.label);
    if (typeof window !== "undefined") {
      localStorage.setItem("adminSidebarActive", item.label);
    }
    if (isMobile) setSidebarOpen(false);
    if (item.route) router.push(item.route);
  };

  // Clear localStorage on logout and route to login page
  const handleLogout = () => {
    // Clear all localStorage (or just relevant keys if you want)
    localStorage.clear();
    // Redirect to login page
    router.push("/loginpage");
  };

  // Search submission (can be extended later)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      console.log("Search query:", searchValue);
      // Implement payment search here or in page components
    }
  };

  // Close dropdowns on outside click and escape key press
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileOpen &&
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
      if (
        notificationOpen &&
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(e.target)
      ) {
        setNotificationOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [profileOpen, notificationOpen]);

  const { profile } = useSuperAdminProfile();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          ${sidebarCollapsed ? "w-16" : "w-64"}
          bg-white shadow-xl
          transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          flex flex-col
        `}
        aria-label="Primary Sidebar"
      >
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            {!sidebarCollapsed && (
              <img
                src="/images/Farm-Ferry-logo.jpeg"
                alt="Farm Ferry Logo"
                className="h-10 w-10 sm:h-14 sm:w-14 mr-2 object-contain rounded-full shadow-lg"
              />
            )}
            {!sidebarCollapsed && (
              <span className="text-lg sm:text-xl font-bold text-gray-800">
                FarmFerry 
                <span className="block text-xs text-green-600">SuperAdmin</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block p-1 sm:p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label="Toggle sidebar collapse"
            >
              {sidebarCollapsed ? (
                <FiChevronRight className="w-4 h-4" aria-hidden="true" />
              ) : (
                <FiChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 sm:p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <FiX className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto py-4 hide-scrollbar px-2 sm:px-4 space-y-1"
          aria-label="Payment navigation"
        >
          {sidebarItems.map((item, idx) => {
            const isActive = activeItem === item.label;
            return (
              <div key={idx} className="relative group">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-green-50 text-green-700 border-r-4 border-green-500 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                  } ${sidebarCollapsed ? "justify-center" : ""}`}
                  title={sidebarCollapsed ? item.label : ""}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-green-600" : "text-gray-500"} ${
                        isActive ? "animate-pulse" : ""
                      }`}
                      aria-hidden="true"
                    />
                    {!sidebarCollapsed && (
                      <div className="flex-1 text-left">
                        <span className="font-medium block text-sm sm:text-base">{item.label}</span>
                        <p className="text-xs text-gray-500 mt-1 hidden sm:block">{item.description}</p>
                      </div>
                    )}
                  </div>
                </button>

                {/* Tooltip for collapsed sidebar */}
                {sidebarCollapsed && (
                  <div
                    className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg"
                    role="tooltip"
                  >
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-300">{item.description}</div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {!sidebarCollapsed && (
          <footer className="flex-shrink-0 p-3 sm:p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} FarmFerry Payments
            <div className="text-[10px] mt-1">v2.1.0</div>
          </footer>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white border-gray-200 shadow-sm border-b h-16">
          <div className="flex items-center justify-between px-4 sm:px-6 h-full">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile sidebar menu toggle */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                title="Open sidebar"
                aria-label="Open sidebar"
              >
                <FiMenu className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Payment-focused Search */}
              <form onSubmit={handleSearchSubmit} className="relative" role="search" aria-label="Search payments and orders">
                <div
                  className={`flex items-center ${
                    searchFocused ? "w-40 sm:w-64 md:w-80" : "w-32 sm:w-56 md:w-64"
                  } transition-all duration-300`}
                >
                  <FiSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    placeholder="Search payments, orders..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                    aria-label="Search"
                    spellCheck="false"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={() => setSearchValue("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Clear search"
                      aria-label="Clear search input"
                    >
                      <FiX className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Navbar Right Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Fullscreen toggle button */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors hidden sm:block"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                aria-label="Toggle fullscreen mode"
              >
                {isFullscreen ? (
                  <FiMinimize2 className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <FiMaximize2 className="w-5 h-5" aria-hidden="true" />
                )}
              </button>

              {/* Notifications dropdown */}
              <div
                className="relative notification-dropdown"
                ref={notificationDropdownRef}
              >
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                  title="Notifications"
                  aria-haspopup="true"
                  aria-expanded={notificationOpen}
                  aria-label={`Notifications, ${unreadCount} unread`}
                >
                  <FiBell className="w-5 h-5" aria-hidden="true" />
                  {unreadCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-medium"
                      aria-live="polite"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Notifications panel"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                        Payment Notifications
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm text-gray-500">
                          {unreadCount} new
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            aria-label="Mark all notifications as read"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => markAsRead(notification.id)}
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                markAsRead(notification.id);
                              }
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  notification.color === "green"
                                    ? "bg-green-100 text-green-600"
                                    : notification.color === "red"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                <notification.icon
                                  className="w-4 h-4"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                                    {notification.title}
                                  </h4>
                                  {notification.unread && (
                                    <div
                                      className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"
                                      aria-label="Unread"
                                    />
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-500">
                          <FiBell className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-2 text-sm">No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative profile-dropdown" ref={profileDropdownRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Profile menu"
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  aria-label="Profile menu"
                >
                  {profile.avatar ? (
                    <img
                      src={`${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://farm-ferry-backend-new.vercel.app')}${profile.avatar}`}
                      alt="Profile"
                      className="w-8 h-8 rounded-full ring-2 ring-green-500 ring-offset-2 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full ring-2 ring-green-500 ring-offset-2 bg-gray-200 flex items-center justify-center">
                      <FiUser className="text-gray-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {profile.name}
                  </span>
                  <FiChevronDown
                    className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200 ${
                      profileOpen ? "transform rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 sm:w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    role="menu"
                    aria-label="Profile options"
                  >
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        {profile.avatar ? (
                          <img
                            src={`${process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://farm-ferry-backend-new.vercel.app')}${profile.avatar}`}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiUser className="text-gray-600 text-xl" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            {profile.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {profile.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 transition-colors"
                        onClick={() => {
                          router.push("/superadmin/settings?tab=profile");
                          setProfileOpen(false);
                        }}
                        role="menuitem"
                      >
                        <FiUser className="w-4 h-4 mr-3" aria-hidden="true" />
                        Profile Settings
                      </button>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        role="menuitem"
                      >
                        <FiLogOut className="w-4 h-4 mr-3" aria-hidden="true" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content placeholder */}
        <main className="flex-1 overflow-auto p-4 sm:p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
};

const AdminLayout = ({ children }) => (
  <SuperAdminProfileProvider>
    <AdminLayoutInner>{children}</AdminLayoutInner>
  </SuperAdminProfileProvider>
);

export default AdminLayout;