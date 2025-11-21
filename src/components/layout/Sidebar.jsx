
import React from 'react';
import { NavLink } from 'react-router-dom';
// import logo from '../../../public/Euryfox-logo.png'
import { 
  LayoutDashboard, 
  Package, 
  Grid3X3, 
  FileText, 
  Layers,
  BookOpen,
  Phone,
  Ruler,
  UserPlus,
  Scale,
  IndianRupee,
  User
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    // { path: '/admin/product-category', icon: Grid3X3, label: 'Product Category' },
    // { path: '/admin/products', icon: Package, label: 'Products' },
    // { path: '/admin/blog-category', icon: Layers, label: 'Blog Category' },
    // { path: '/admin/blogs', icon: BookOpen, label: 'Blogs' },
  
    // { path: '/admin/product-units', icon: Ruler, label: 'Product Units' },
    // { path: '/admin/unit-quantities', icon: Scale, label: 'Unit Quantities' },
    // { path: '/admin/contact', icon: Phone, label: 'Contact' },
    { path: '/admin/admin-users', icon: UserPlus, label: 'Manage Admin Users' },
    // { path: '/admin/currency', icon:  IndianRupee, label: 'Currency' },
    // { path: '/admin/user-profile', icon: User, label: 'UserProfile' },

  ];

  return (
    // <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
    //   {/* Logo */}
    //   <div className="flex items-center justify-center h-16 px-2 border-b border-gray-200">
    //     <div className="flex items-center space-x-3">
          
    //       <a href="/" className="flex items-center space-x-3 sm:space-x-4 group min-w-0 flex-shrink">
    //         <img src={logo} alt="Eury Fox Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain transition-transform duration-300 group-hover:scale-105"/>

    //         <div style={{marginLeft: "1px"}} className="min-w-0">
    //           <h1 className="font-serif font-black text-lg  bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500  bg-clip-text text-transparent transition-colors duration-300 truncate">
    //             Eury Fox Global
    //           </h1>
    //           <p className="text-xs sm:text-sm text-muted-foreground font-sans hidden xs:block">
    //             Empowering Global Trade
    //           </p>
    //         </div>
    //       </a>
    //     </div>
    //   </div>

    //   {/* Navigation */}
    //   <nav className="flex-1 overflow-y-auto py-4">
    //     <div className="px-3 space-y-1">
    //       {menuItems.map((item) => {
    //         const Icon = item.icon;
    //         return (
    //           <NavLink
    //             key={item.path}
    //             to={item.path}
    //             className={({ isActive }) =>
    //               `flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
    //                 isActive
    //                   ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white'
    //                   : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
    //               }`
    //             }
    //           >
    //             <Icon className="w-5 h-5 mr-3" />
    //             {item.label}
    //           </NavLink>
    //         );
    //       })}
    //     </div>

        
    //   </nav>

     
    // </div>


    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full shadow-xl">
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          
          <a href="/" className="flex items-center space-x-3 group min-w-0 flex-shrink">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"> */}
              {/* <img src={logo} alt="Eury Fox Logo" className="h-6 w-6 object-contain"/> */}
            {/* </div> */}

            <div style={{marginLeft: "1px"}} className="min-w-0">
              <h1 className="text-xl font-bold text-orange-700">
                Cyber Instant CRM
              </h1>
              <p className="text-sm text-orange-900">
                Empowering Global Trade
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg transform scale-[1.02]'
                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-700'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;