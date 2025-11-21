// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   BarChart3, 
//   Package, 
//   ShoppingCart, 
//   FileText, 
//   BookOpen, 
//   Users, 
//   DollarSign,
//   TrendingUp,
//   Eye,
//   Plus,
//   Loader2,
//   RefreshCw, IndianRupee 
// } from 'lucide-react';
// import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// import { DashboardAPI } from '../../api/dashboard';
// import { API_CONFIG } from '../../api/api-config';

// const Dashboard = () => {
//   const navigate = useNavigate();
  
//   const [dashboardData, setDashboardData] = useState({
//     productCategories: [],
//     products: [],
//     blogCategories: [],
//     blogs: [],
//     teamMembers: [],
//     currencies: []
//   });
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [retryCount, setRetryCount] = useState(0);


// //   // Sample data for charts - you can replace this with real data from your API
//   const salesData = [
//     { month: 'Jan', sales: 4000, target: 3500 },
//     { month: 'Feb', sales: 3000, target: 3200 },
//     { month: 'Mar', sales: 5000, target: 4000 },
//     { month: 'Apr', sales: 4500, target: 4200 },
//     { month: 'May', sales: 6000, target: 5000 },
//     { month: 'Jun', sales: 5500, target: 5200 },
//     { month: 'Jul', sales: 7000, target: 6000 },
//     { month: 'Aug', sales: 6500, target: 6200 },
//     { month: 'Sep', sales: 8000, target: 7000 },
//     { month: 'Oct', sales: 7500, target: 7200 },
//     { month: 'Nov', sales: 9000, target: 8000 },
//     { month: 'Dec', sales: 8500, target: 8200 }
//   ];

//   const ordersData = [
//     { month: 'Jan', orders: 120, completed: 115, pending: 5 },
//     { month: 'Feb', orders: 98, completed: 92, pending: 6 },
//     { month: 'Mar', orders: 150, completed: 145, pending: 5 },
//     { month: 'Apr', orders: 135, completed: 128, pending: 7 },
//     { month: 'May', orders: 180, completed: 175, pending: 5 },
//     { month: 'Jun', orders: 165, completed: 158, pending: 7 },
//     { month: 'Jul', orders: 210, completed: 205, pending: 5 },
//     { month: 'Aug', orders: 195, completed: 188, pending: 7 },
//     { month: 'Sep', orders: 240, completed: 235, pending: 5 },
//     { month: 'Oct', orders: 225, completed: 218, pending: 7 },
//     { month: 'Nov', orders: 270, completed: 265, pending: 5 },
//     { month: 'Dec', orders: 255, completed: 248, pending: 7 }
//   ];


//   // Use useCallback to prevent infinite loops
//   const fetchDashboardData = useCallback(async () => {
//     console.log('Fetching dashboard data...');
//     setLoading(true);
//     setError(null);
//     setRetryCount(0);

//     try {
//       const [
//         productCategoriesRes,
//         productsRes,
//         blogCategoriesRes,
//         blogsRes,
//         teamMembersRes,
//         currenciesRes
//       ] = await Promise.all([
//         DashboardAPI.getProductCategories(),
//         DashboardAPI.getProducts(),
//         DashboardAPI.getBlogCategories(),
//         DashboardAPI.getBlogs(),
//         DashboardAPI.getTeamMembers(),
//         DashboardAPI.getCurrencies()
//       ]);

//       // Debug: Log actual API responses
//       console.log('API Responses:', {
//         productCategories: productCategoriesRes,
//         products: productsRes,
//         blogCategories: blogCategoriesRes,
//         blogs: blogsRes,
//         teamMembers: teamMembersRes,
//         currencies: currenciesRes
//       });

//       // Handle different possible response formats
//       const extractData = (response) => {
//         if (!response) return [];
        
//         // If response has success property
//         if (response.hasOwnProperty('success')) {
//           return response.success ? (response.result || response.data || []) : [];
//         }
        
//         // If response is directly an array
//         if (Array.isArray(response)) {
//           return response;
//         }
        
//         // If response has data property
//         if (response.data && Array.isArray(response.data)) {
//           return response.data;
//         }
        
//         // If response has result property
//         if (response.result && Array.isArray(response.result)) {
//           return response.result;
//         }
        
//         return [];
//       };

//       const newDashboardData = {
//         productCategories: extractData(productCategoriesRes),
//         products: extractData(productsRes),
//         blogCategories: extractData(blogCategoriesRes),
//         blogs: extractData(blogsRes),
//         teamMembers: extractData(teamMembersRes),
//         currencies: extractData(currenciesRes)
//       };

//       console.log('Extracted data:', newDashboardData);
//       setDashboardData(newDashboardData);
//       setLoading(false);

//     } catch (err) {
//       console.error('Dashboard API Error:', err);
//       setError(`Unable to fetch dashboard data: ${err.message}`);
//       setLoading(false);
//     }
//   }, []); // Empty dependency array to prevent infinite loops

//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]);

//   const handleRetry = () => {
//     fetchDashboardData();
//   };

//   const dashboardCards = [
//     {
//       title: 'Product Categories',
//       count: dashboardData.productCategories.length,
//       icon: Package,
//       color: 'bg-blue-500',
//       bgColor: 'bg-blue-50',
//       textColor: 'text-blue-600',
//       route: '/admin/product-category',
//       description: 'Total product categories'
//     },
//     {
//       title: 'Products',
//       count: dashboardData.products.length,
//       icon: ShoppingCart,
//       color: 'bg-green-500',
//       bgColor: 'bg-green-50',
//       textColor: 'text-green-600',
//       route: '/admin/products',
//       description: 'Total products available'
//     },
//     {
//       title: 'Blog Categories',
//       count: dashboardData.blogCategories.length,
//       icon: BookOpen,
//       color: 'bg-purple-500',
//       bgColor: 'bg-purple-50',
//       textColor: 'text-purple-600',
//       route: '/admin/blog-category',
//       description: 'Total blog categories'
//     },
//     {
//       title: 'Blogs',
//       count: dashboardData.blogs.length,
//       icon: FileText,
//       color: 'bg-orange-500',
//       bgColor: 'bg-orange-50',
//       textColor: 'text-orange-600',
//       route: '/admin/blogs',
//       description: 'Total blog posts'
//     },
//     {
//       title: 'Team Members',
//       count: dashboardData.teamMembers.length,
//       icon: Users,
//       color: 'bg-indigo-500',
//       bgColor: 'bg-indigo-50',
//       textColor: 'text-indigo-600',
//       route: '/admin/team-member-add',
//       description: 'Active team members'
//     },
//     {
//       title: 'Currencies',
//       count: dashboardData.currencies.length,
//       icon: IndianRupee,
//       color: 'bg-yellow-500',
//       bgColor: 'bg-yellow-50',
//       textColor: 'text-yellow-600',
//       route: '/admin/currency',
//       description: 'Supported currencies'
//     }
//   ];

//   const quickActions = [
//     {
//       title: 'Add Product',
//       description: 'Create a new product',
//       icon: Plus,
//       route: '/admin/add-product',
//       color: 'bg-blue-600 hover:bg-blue-700'
//     },
//     {
//       title: 'Add Blog',
//       description: 'Write a new blog post',
//       icon: Plus,
//       route: '/admin/add-blog',
//       color: 'bg-green-600 hover:bg-green-700'
//     },
//     {
//       title: 'View Profile',
//       description: 'Manage user profiles',
//       icon: Eye,
//       route: '/admin/profile',
//       color: 'bg-purple-600 hover:bg-purple-700'
//     },
//     {
//       title: 'Contact Info',
//       description: 'Update contact details',
//       icon: Eye,
//       route: '/admin/contact',
//       color: 'bg-orange-600 hover:bg-orange-700'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//               <p className="mt-2 text-gray-600">Welcome back! Here's what's happening with your business.</p>
//             </div>
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={handleRetry}
//                 disabled={loading}
//                 className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

       

//         {/* Loading State */}
//         {loading && (
//           <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
//             <div className="flex items-center gap-3">
//               <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
//               <div>
//                 <h3 className="font-semibold text-blue-800">Loading Dashboard</h3>
//                 <p className="text-blue-700">Fetching the latest data...</p>
//                 {retryCount > 0 && (
//                   <p className="text-blue-600 text-sm mt-1">
//                     Retry attempt {retryCount}/{API_CONFIG.RETRY_ATTEMPTS}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error State */}
//         {error && !loading && (
//           <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
//             <h3 className="font-semibold text-red-800">Something went wrong</h3>
//             <p className="text-red-700">{error}</p>
//             <button
//               onClick={handleRetry}
//               className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         )}

//         {/* Dashboard Cards */}
//         {!loading && !error && (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//               {dashboardCards.map((card, index) => {
//                 const IconComponent = card.icon;
//                 return (
//                   <div
//                     key={index}
//                     onClick={() => navigate(card.route)}
//                     className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-3">
//                           <div className={`w-12 h-12 ${card.bgColor} rounded-lg flex items-center justify-center`}>
//                             <IconComponent className={`w-6 h-6 ${card.textColor}`} />
//                           </div>
//                           <div>
//                             <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
//                             <p className="text-sm text-gray-600">{card.description}</p>
//                           </div>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <span className="text-3xl font-bold text-gray-900">{card.count}</span>
//                           <div className="flex items-center space-x-1 text-green-600">
//                             <TrendingUp className="w-4 h-4" />
//                             <span className="text-sm font-medium">Active</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//           {/* NEW: Statistics Charts Section */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//               {/* Sales Chart */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
//                       <IndianRupee className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-semibold text-gray-900">Sales Overview</h2>
//                       <p className="text-sm text-gray-600">Monthly sales vs targets</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-gray-900">₹68.5K</div>
//                     <div className="text-sm text-green-600 flex items-center">
//                       <TrendingUp className="w-4 h-4 mr-1" />
//                       +12.5% from last year
//                     </div>
//                   </div>
//                 </div>
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={salesData}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                       <XAxis 
//                         dataKey="month" 
//                         stroke="#6b7280"
//                         fontSize={12}
//                       />
//                       <YAxis 
//                         stroke="#6b7280"
//                         fontSize={12}
//                         tickFormatter={(value) => `₹${value/1000}K`}
//                       />
//                       <Tooltip 
//                         formatter={(value, name) => [`₹${value}`, name === 'sales' ? 'Sales' : 'Target']}
//                         labelFormatter={(label) => `Month: ${label}`}
//                         contentStyle={{
//                           backgroundColor: 'white',
//                           border: '1px solid #e5e7eb',
//                           borderRadius: '8px',
//                           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                         }}
//                       />
//                       <Legend />
//                       <Area
//                         type="monotone"
//                         dataKey="target"
//                         stackId="1"
//                         stroke="#94a3b8"
//                         fill="#e2e8f0"
//                         name="Target"
//                         strokeWidth={2}
//                       />
//                       <Area
//                         type="monotone"
//                         dataKey="sales"
//                         stackId="2"
//                         stroke="#3b82f6"
//                         fill="#3b82f6"
//                         name="Sales"
//                         strokeWidth={2}
//                         fillOpacity={0.6}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>

//               {/* Orders Chart */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <div className="flex items-center justify-between mb-6">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
//                       <ShoppingCart className="w-5 h-5 text-green-600" />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-semibold text-gray-900">Orders Analytics</h2>
//                       <p className="text-sm text-gray-600">Monthly orders tracking</p>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-2xl font-bold text-gray-900">2.1K</div>
//                     <div className="text-sm text-green-600 flex items-center">
//                       <TrendingUp className="w-4 h-4 mr-1" />
//                       +8.3% from last year
//                     </div>
//                   </div>
//                 </div>
//                 <div className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={ordersData}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                       <XAxis 
//                         dataKey="month" 
//                         stroke="#6b7280"
//                         fontSize={12}
//                       />
//                       <YAxis 
//                         stroke="#6b7280"
//                         fontSize={12}
//                       />
//                       <Tooltip 
//                         formatter={(value, name) => [
//                           value, 
//                           name === 'orders' ? 'Total Orders' : 
//                           name === 'completed' ? 'Completed' : 'Pending'
//                         ]}
//                         labelFormatter={(label) => `Month: ${label}`}
//                         contentStyle={{
//                           backgroundColor: 'white',
//                           border: '1px solid #e5e7eb',
//                           borderRadius: '8px',
//                           boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
//                         }}
//                       />
//                       <Legend />
//                       <Line
//                         type="monotone"
//                         dataKey="orders"
//                         stroke="#10b981"
//                         strokeWidth={3}
//                         dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
//                         name="Total Orders"
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="completed"
//                         stroke="#3b82f6"
//                         strokeWidth={2}
//                         dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
//                         name="Completed"
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="pending"
//                         stroke="#f59e0b"
//                         strokeWidth={2}
//                         dot={{ fill: '#f59e0b', strokeWidth: 2, r: 3 }}
//                         name="Pending"
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
            

//             {/* Quick Actions */}
//             <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//               <div className="flex items-center space-x-3 mb-6">
//                 <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
//                   <BarChart3 className="w-5 h-5 text-gray-600" />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {quickActions.map((action, index) => {
//                   const IconComponent = action.icon;
//                   return (
//                     <button
//                       key={index}
//                       onClick={() => navigate(action.route)}
//                       className={`${action.color} text-white p-4 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <IconComponent className="w-5 h-5" />
//                         <div className="text-left">
//                           <h3 className="font-medium">{action.title}</h3>
//                           <p className="text-sm opacity-90">{action.description}</p>
//                         </div>
//                       </div>
//                     </button> 
//                   );
//                 })}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React from 'react';
import { Users, UserPlus, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';
// import EmployeesManagement from './EmployeesManagement';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Employees',
      value: '248',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'orange'
    },
    {
      title: 'New Hires This Month',
      value: '12',
      change: '+25%',
      changeType: 'positive',
      icon: UserPlus,
      color: 'emerald'
    },
    {
      title: 'Pending Leave Requests',
      value: '8',
      change: '-15%',
      changeType: 'negative',
      icon: Calendar,
      color: 'amber'
    },
    {
      title: 'Monthly Payroll',
      value: '₹84.2L',
      change: '+8%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'purple'
    }
  ];
 const navigate = useNavigate();
  
const handleClick = (route) => {
  navigate(route);
};
  const recentActivities = [
    {
      id: 1,
      action: 'New employee onboarded',
      employee: 'Sarah Johnson',
      time: '2 hours ago',
      type: 'onboarding'
    },
    {
      id: 2,
      action: 'Leave request approved',
      employee: 'Michael Chen',
      time: '4 hours ago',
      type: 'leave'
    },
    {
      id: 3,
      action: 'Payroll processed',
      employee: 'Finance Team',
      time: '1 day ago',
      type: 'payroll'
    },
    {
      id: 4,
      action: 'Asset assigned',
      employee: 'David Kumar',
      time: '2 days ago',
      type: 'asset'
    }
  ];

  const colorClasses = {
    orange: 'from-orange-600 to-orange-700',
    emerald: 'from-emerald-600 to-emerald-700',
    amber: 'from-amber-600 to-amber-700',
    purple: 'from-purple-600 to-purple-700'
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-orange-100">Here's what's happening with your workforce today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.employee} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleClick('/hr-portal/employees')} className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left">
              <UserPlus className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Employee</p>
            </button>
            
            <button onClick={() => handleClick('/hr-portal/leave')} className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 text-left">
              <Calendar className="w-6 h-6 text-emerald-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Manage Leaves</p>
            </button>
            
            <button onClick={() => handleClick('/hr-portal/payroll')} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left">
              <DollarSign className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Process Payroll</p>
            </button>
            
            <button onClick={() => handleClick('/hr-portal/expenses')} className="p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-all duration-200 text-left">
              <TrendingUp className="w-6 h-6 text-amber-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Expenses</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
