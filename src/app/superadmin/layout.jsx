"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaRupeeSign } from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import {
  Home,
  Bell,
  Search,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  Truck,
  ClipboardList,
  AlertCircle,
  CreditCard,
  DollarSign,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";

const AdminLayout = ({ children }) => {
  const router = useRouter();

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
  const [activeItem, setActiveItem] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("adminSidebarActive") || "Payment Records";
    }
    return "Payment Records";
  });

  // Fullscreen mode state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs for click outside detection
  const profileDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Sidebar menu focused on payment management & key super admin sections
  const sidebarItems = [
    {
      icon: Home,
      label: "Dashboard",
      description: "Overview & Analytics",
      route: "/superadmin",
    },
    {
      icon: ClipboardList,
      label: "Customer Payment Records",
      description: "View all payment transactions",
      route: "/superadmin/customer_payment_Records",
    },
    {
      icon: Truck,
      label: "Supplier Payments",
      description: "Manage supplier payouts",
      route: "/superadmin/supplier_payments",
    },
    {
    icon: MdDeliveryDining,
    label: "Delivery Employee Payment Records",
    description: "Track delivery employee payments",
    route: "/superadmin/delivery_employee_payment",
  },
    // {
    //   icon: AlertCircle,
    //   label: "Failed Payments",
    //   description: "Monitor declined and failed payments",
    //   route: "/admin/failed-payments",
    // },
    {
      icon: FaRupeeSign,
      label: "Refund Management",
      description: "Process and review refunds",
      route: "/superadmin/refund",
    },
    
    {
      icon: Zap,
      label: "Settings",
      description: "Configure system & payment options",
      route: "/admin/settings",
    },
  ];

  // Sample payment-focused notifications (Replace with real backend data)
  const initialNotifications = [
    {
      id: 101,
      type: "success",
      title: "Payment Successful",
      message: "Order #56789 paid via UPI.",
      time: "3 minutes ago",
      unread: true,
      icon: DollarSign,
      color: "green",
    },
    {
      id: 102,
      type: "failure",
      title: "Payment Failed",
      message: "Payment for Order #56790 declined.",
      time: "15 minutes ago",
      unread: true,
      icon: AlertCircle,
      color: "red",
    },
    {
      id: 103,
      type: "refund",
      title: "Refund Processed",
      message: "Refund issued for Order #56788.",
      time: "1 hour ago",
      unread: false,
      icon: CreditCard,
      color: "blue",
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
    localStorage.removeItem("adminSidebarActive");
    // Clear tokens/session here if applicable before redirecting
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

  // Static super admin profile data (can be linked to real profile data)
  const adminProfile = {
    avatar: "", // URL to avatar or empty to fallback icon
    name: "SuperAdmin",
    role: "Super Admin",
  };

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
                SuperAdmin
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
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 sm:p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" aria-hidden="true" />
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
                      className={`w-5 h-5 flex-shrink-0 ${isActive ? "animate-pulse" : ""}`}
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
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>

              {/* Payment-focused Search */}
              <form onSubmit={handleSearchSubmit} className="relative" role="search" aria-label="Search payments and orders">
                <div
                  className={`flex items-center ${
                    searchFocused ? "w-40 sm:w-64 md:w-80" : "w-32 sm:w-56 md:w-64"
                  } transition-all duration-300`}
                >
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    placeholder="Search payments, orders, suppliers..."
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
                      <X className="w-4 h-4" aria-hidden="true" />
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
                  <Minimize2 className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Maximize2 className="w-5 h-5" aria-hidden="true" />
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
                  <Bell className="w-5 h-5" aria-hidden="true" />
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
                        Notifications
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
                      {notifications.map((notification) => (
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
                                  ? "bg-green-100"
                                  : notification.color === "red"
                                  ? "bg-red-100"
                                  : "bg-blue-100"
                              }`}
                            >
                              <notification.icon
                                className={`w-4 h-4 ${
                                  notification.color === "green"
                                    ? "text-green-600"
                                    : notification.color === "red"
                                    ? "text-red-600"
                                    : "text-blue-600"
                                }`}
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
                      ))}
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
                  {adminProfile.avatar ? (
                    <img
                      src={adminProfile.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full ring-2 ring-green-500 ring-offset-2 object-cover"
                    />
                  ) : (
                    <User
                      className="w-8 h-8 rounded-full ring-2 ring-green-500 ring-offset-2 bg-gray-200 text-gray-400 p-1"
                      aria-hidden="true"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {adminProfile.name}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 text-gray-400 hidden sm:block transition-transform duration-200"
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
                        {adminProfile.avatar ? (
                          <img
                            src={adminProfile.avatar}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <User
                            className="w-10 h-10 rounded-full bg-gray-200 text-gray-400 p-2"
                            aria-hidden="true"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            {adminProfile.name}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {adminProfile.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button
                        className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 text-gray-700 transition-colors"
                        onClick={() => {
                          router.push("/admin/settings?tab=profile");
                          setProfileOpen(false);
                        }}
                        role="menuitem"
                      >
                        <User className="w-4 h-4 mr-3" aria-hidden="true" />
                        Profile
                      </button>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        role="menuitem"
                      >
                        <LogOut className="w-4 h-4 mr-3" aria-hidden="true" />
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

export default AdminLayout;
