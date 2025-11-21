import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2, Search, Filter, MapPin, CheckCircle, X } from "lucide-react";
import { formatDate } from "../../../utils/helpers";
import { EmployeeMasterAPI } from "../../../api/employeeMaster";
import { DepartmentsAPI } from "../../../api/departments";
import { DesignationsAPI } from "../../../api/designations";
import EmployeeActivationModal from "./EmployeeActivationModal";

const EmployeeTable = ({ onAction, onDelete, onViewDetails }) => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");
  const [filterMobile, setFilterMobile] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterEmploymentStatus, setFilterEmploymentStatus] = useState("On_Progress"); // Default to On_Progress
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => { 
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [employeesRes, departmentsRes, designationsRes] = await Promise.all([
        EmployeeMasterAPI.getAll(),
        DepartmentsAPI.getAll(),
        DesignationsAPI.getAll()
      ]);

      if (employeesRes?.success && Array.isArray(employeesRes.result)) {
        setEmployees(employeesRes.result);
      } else {
        console.error("Unexpected employees API response:", employeesRes);
      }

      if (departmentsRes?.success && Array.isArray(departmentsRes.result)) {
        setDepartments(departmentsRes.result);
      } else {
        console.error("Unexpected departments API response:", departmentsRes);
      }

      if (designationsRes?.success && Array.isArray(designationsRes.result)) {
        setDesignations(designationsRes.result);
      } else {
        console.error("Unexpected designations API response:", designationsRes);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const officeLocations = [
    ...new Set(
      employees
        .map((emp) => emp.employment_details?.office_location?.name)
        .filter(Boolean)
    ),
  ];

  // Helper function to get current employment status
  const getCurrentStatus = (emp) => {
    return emp.employment_details?.status_history?.[
      emp.employment_details.status_history.length - 1
    ]?.status;
  };

  // Apply filters
  const filteredEmployees = employees.filter((emp) => {
    const name = `${emp.first_name} ${emp.middle_name || ""} ${
      emp.last_name || ""
    }`
      .trim()
      .toLowerCase();
    const email = emp.employment_details?.official_email?.toLowerCase() || "";
    const empCode = emp.employee_code?.toLowerCase() || "";
    const department = emp.employment_details?.department?.name || "";
    const designation = emp.employment_details?.designation?.name || "";
    const mobileNumber = emp.employee_mobile_number || "";
    const officeLocation = emp.employment_details?.office_location?.name || "";
    const isProbation = emp.employment_details?.is_probation ? "true" : "false";
    const currentStatus = getCurrentStatus(emp);

    const matchesSearch =
      !searchTerm ||
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      empCode.includes(searchTerm.toLowerCase());

    const matchesDepartment =
      !filterDepartment || department === filterDepartment;

    const matchesDesignation =
      !filterDesignation || designation === filterDesignation;

    const matchesMobile =
      !filterMobile || mobileNumber.includes(filterMobile);

    const matchesLocation =
      !filterLocation || officeLocation === filterLocation;

    const matchesStatus =
      !filterStatus || isProbation === filterStatus.toLowerCase();

    const matchesEmploymentStatus =
      !filterEmploymentStatus || currentStatus === filterEmploymentStatus;

    return matchesSearch && matchesDepartment && matchesDesignation && 
           matchesMobile && matchesLocation && matchesStatus && matchesEmploymentStatus;
  });

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterDesignation("");
    setFilterMobile("");
    setFilterLocation("");
    setFilterStatus("");
    setFilterEmploymentStatus("");
  };

  const hasActiveFilters = searchTerm || filterDepartment || filterDesignation || 
                           filterMobile || filterLocation || filterStatus || filterEmploymentStatus;

  const handleOpenActivationModal = (employee) => {
    setSelectedEmployee(employee);
    setIsActivationModalOpen(true);
  };

  const handleCloseActivationModal = () => {
    setIsActivationModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleActivateEmployee = async (employeeId) => {
    try {
      const response = await EmployeeMasterAPI.activate(employeeId);
      
      if (response?.success) {
        await fetchData();
        return response;
      } else {
        throw new Error(response?.message || "Failed to activate employee");
      }
    } catch (error) {
      console.error("Error activating employee:", error);
      throw error;
    }
  };

  const handleConfirmProbation = async (employeeId) => {
    try {
      const response = await EmployeeMasterAPI.confirmProbation(employeeId);
      
      if (response?.success) {
        await fetchData();
        return response;
      } else {
        throw new Error(response?.message || "Failed to confirm probation");
      }
    } catch (error) {
      console.error("Error confirming probation:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading employees...
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Onboarded Employees
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              {/* Search */}
              <div className="relative col-span-1 sm:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Department Filter */}
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>

              {/* Designation Filter */}
              <select
                value={filterDesignation}
                onChange={(e) => setFilterDesignation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Designations</option>
                {designations.map((desig) => (
                  <option key={desig.id} value={desig.name}>
                    {desig.name}
                  </option>
                ))}
              </select>

              {/* Mobile Number Filter */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by mobile..."
                  value={filterMobile}
                  onChange={(e) => setFilterMobile(e.target.value)}
                  className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Office Location Filter */}
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Locations</option>
                {officeLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>

              {/* Probation Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Status</option>
                <option value="true">Probationary</option>
                <option value="false">Full Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <Filter className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No employees found</p>
                      <p className="text-sm">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const currentStatus = getCurrentStatus(emp);
                  
                  return (
                    <tr key={emp.employee_id} className="hover:bg-gray-50">
                      {/* Employee */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {`${emp.first_name} ${emp.middle_name || ""} ${
                              emp.last_name || ""
                            }`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {emp.employment_details?.designation?.name || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-gray-900">
                            {emp.employment_details?.official_email ||
                              emp.personal_email ||
                              "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {emp.employee_mobile_number || "N/A"}
                          </div>
                          {emp.current_city && (
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {emp.current_city}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Employment */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {emp.employee_code || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {emp.employment_details?.department?.name || "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            Joined:{" "}
                            {formatDate(
                              emp.employment_details?.date_of_joining
                            ) || "N/A"}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const base = "px-3 py-1 text-xs font-semibold rounded-full border";
                          const color =
                            currentStatus === "Active"
                              ? "bg-green-100 text-green-700 border-green-300"
                              : currentStatus === "On_Progress"
                              ? "bg-blue-100 text-blue-700 border-blue-300"
                              : currentStatus === "On_Notice"
                              ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                              : currentStatus === "Resigned"
                              ? "bg-orange-100 text-orange-700 border-orange-300"
                              : currentStatus === "Terminated"
                              ? "bg-red-100 text-red-700 border-red-300"
                              : currentStatus === "Retired"
                              ? "bg-gray-200 text-gray-700 border-gray-300"
                              : "bg-gray-100 text-gray-600 border-gray-300";

                          return <span className={`${base} ${color}`}>{currentStatus || "N/A"}</span>;
                        })()}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onAction("view", emp.employee_id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Employee"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onAction("edit", emp.employee_id)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit Employee"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleOpenActivationModal(emp)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Manage Employee Status"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDelete(emp.employee_id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filteredEmployees.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              Showing {filteredEmployees.length} of {employees.length} employees
            </p>
          </div>
        )}
      </div>

      {/* Activation Modal */}
      <EmployeeActivationModal
        isOpen={isActivationModalOpen}
        onClose={handleCloseActivationModal}
        employee={selectedEmployee}
        onActivate={handleActivateEmployee}
        onConfirmProbation={handleConfirmProbation}
      />
    </>
  );
};

export default EmployeeTable;


































































// import React, { useEffect, useState } from "react";
// import { Eye, Edit, Trash2, Search, Filter, MapPin, CheckCircle, X } from "lucide-react";
// import { formatDate } from "../../../utils/helpers";
// import { EmployeeMasterAPI } from "../../../api/employeeMaster";
// import { DepartmentsAPI } from "../../../api/departments";
// import { DesignationsAPI } from "../../../api/designations";
// import EmployeeActivationModal from "./EmployeeActivationModal";

// const EmployeeTable = ({ onAction, onDelete, onViewDetails }) => {
//   const [employees, setEmployees] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [designations, setDesignations] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDepartment, setFilterDepartment] = useState("");
//   const [filterDesignation, setFilterDesignation] = useState("");
//   const [filterMobile, setFilterMobile] = useState("");
//   const [filterLocation, setFilterLocation] = useState("");
//   const [filterStatus, setFilterStatus] = useState("");
//   const [filterActiveStatus, setFilterActiveStatus] = useState(""); // New filter for is_active
//   const [loading, setLoading] = useState(true);
  
//   // Modal state
//   const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);

//   // ✅ Fetch employees, departments, and designations from API
//   useEffect(() => { 
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
      
//       // Fetch all data in parallel
//       const [employeesRes, departmentsRes, designationsRes] = await Promise.all([
//         EmployeeMasterAPI.getAll(),
//         DepartmentsAPI.getAll(),
//         DesignationsAPI.getAll()
//       ]);

//       if (employeesRes?.success && Array.isArray(employeesRes.result)) {
//         setEmployees(employeesRes.result);
//       } else {
//         console.error("Unexpected employees API response:", employeesRes);
//       }

//       if (departmentsRes?.success && Array.isArray(departmentsRes.result)) {
//         setDepartments(departmentsRes.result);
//       } else {
//         console.error("Unexpected departments API response:", departmentsRes);
//       }

//       if (designationsRes?.success && Array.isArray(designationsRes.result)) {
//         setDesignations(designationsRes.result);
//       } else {
//         console.error("Unexpected designations API response:", designationsRes);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Extract unique office locations for filter dropdown
//   const officeLocations = [
//     ...new Set(
//       employees
//         .map((emp) => emp.employment_details?.office_location?.name)
//         .filter(Boolean)
//     ),
//   ];

//   // ✅ Apply filters
//   const filteredEmployees = employees.filter((emp) => {
//     const name = `${emp.first_name} ${emp.middle_name || ""} ${
//       emp.last_name || ""
//     }`
//       .trim()
//       .toLowerCase();
//     const email = emp.employment_details?.official_email?.toLowerCase() || "";
//     const empCode = emp.employee_code?.toLowerCase() || "";
//     const department = emp.employment_details?.department?.name || "";
//     const designation = emp.employment_details?.designation?.name || "";
//     const mobileNumber = emp.employee_mobile_number || "";
//     const officeLocation = emp.employment_details?.office_location?.name || "";
//     const isProbation = emp.employment_details?.is_probation ? "true" : "false";

//     const matchesSearch =
//       !searchTerm ||
//       name.includes(searchTerm.toLowerCase()) ||
//       email.includes(searchTerm.toLowerCase()) ||
//       empCode.includes(searchTerm.toLowerCase());

//     const matchesDepartment =
//       !filterDepartment || department === filterDepartment;

//     const matchesDesignation =
//       !filterDesignation || designation === filterDesignation;

//     const matchesMobile =
//       !filterMobile || mobileNumber.includes(filterMobile);

//     const matchesLocation =
//       !filterLocation || officeLocation === filterLocation;

//     const matchesStatus =
//       !filterStatus || isProbation === filterStatus.toLowerCase();

//     return matchesSearch && matchesDepartment && matchesDesignation && 
//            matchesMobile && matchesLocation && matchesStatus;
//   });

//   // ✅ Clear all filters
//   const clearAllFilters = () => {
//     setSearchTerm("");
//     setFilterDepartment("");
//     setFilterDesignation("");
//     setFilterMobile("");
//     setFilterLocation("");
//     setFilterStatus("");
//   };

//   // ✅ Check if any filter is active
//   const hasActiveFilters = searchTerm || filterDepartment || filterDesignation || 
//                            filterMobile || filterLocation || filterStatus;

//   // ✅ Handle activation modal
//   const handleOpenActivationModal = (employee) => {
//     setSelectedEmployee(employee);
//     setIsActivationModalOpen(true);
//   };

//   const handleCloseActivationModal = () => {
//     setIsActivationModalOpen(false);
//     setSelectedEmployee(null);
//   };

//   // ✅ Handle employee activation (only is_active and status)
//   const handleActivateEmployee = async (employeeId) => {
//     try {
//       const response = await EmployeeMasterAPI.activate(employeeId);
      
//       if (response?.success) {
//         // Refresh employee data
//         await fetchData();
//         return response;
//       } else {
//         throw new Error(response?.message || "Failed to activate employee");
//       }
//     } catch (error) {
//       console.error("Error activating employee:", error);
//       throw error;
//     }
//   };

//   // ✅ Handle probation confirmation (only probation-related fields)
//   const handleConfirmProbation = async (employeeId) => {
//     try {
//       const response = await EmployeeMasterAPI.confirmProbation(employeeId);
      
//       if (response?.success) {
//         // Refresh employee data
//         await fetchData();
//         return response;
//       } else {
//         throw new Error(response?.message || "Failed to confirm probation");
//       }
//     } catch (error) {
//       console.error("Error confirming probation:", error);
//       throw error;
//     }
//   };

//   // ✅ Fixed: Now passes employee_id instead of entire employee object
//   const handleViewClick = (employee) => {
//     console.log('=== HANDLE VIEW CLICK ===');
//     console.log('Full employee object:', employee);
//     console.log('Employee ID:', employee.employee_id);
//     console.log('onViewDetails exists?', !!onViewDetails);
//     console.log('onAction exists?', !!onAction);
    
//     if (onViewDetails) {
//       console.log('Calling onViewDetails with ID:', employee.employee_id);
//       onViewDetails(employee.employee_id);
//     } else if (onAction) {
//       console.log('Calling onAction with ID:', employee.employee_id);
//       onAction("view", employee.employee_id);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-8 text-center text-gray-500">
//         Loading employees...
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex flex-col gap-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Onboarded Employees
//               </h2>
//               {hasActiveFilters && (
//                 <button
//                   onClick={clearAllFilters}
//                   className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                   Clear Filters
//                 </button>
//               )}
//             </div>

//             {/* Filters Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
//               {/* Search */}
//               <div className="relative col-span-1 sm:col-span-2">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, or code..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 />
//               </div>

//               {/* Department Filter */}
//               <select
//                 value={filterDepartment}
//                 onChange={(e) => setFilterDepartment(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               >
//                 <option value="">All Departments</option>
//                 {departments.map((dept) => (
//                   <option key={dept.id} value={dept.name}>
//                     {dept.name}
//                   </option>
//                 ))}
//               </select>

//               {/* Designation Filter */}
//               <select
//                 value={filterDesignation}
//                 onChange={(e) => setFilterDesignation(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               >
//                 <option value="">All Designations</option>
//                 {designations.map((desig) => (
//                   <option key={desig.id} value={desig.name}>
//                     {desig.name}
//                   </option>
//                 ))}
//               </select>

//               {/* Mobile Number Filter */}
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Filter by mobile..."
//                   value={filterMobile}
//                   onChange={(e) => setFilterMobile(e.target.value)}
//                   className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                 />
//               </div>

//               {/* Office Location Filter */}
//               <select
//                 value={filterLocation}
//                 onChange={(e) => setFilterLocation(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               >
//                 <option value="">All Locations</option>
//                 {officeLocations.map((location) => (
//                   <option key={location} value={location}>
//                     {location}
//                   </option>
//                 ))}
//               </select>

//               {/* Status Filter */}
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//               >
//                 <option value="">All Status</option>
//                 <option value="true">Probationary</option>
//                 <option value="false">Permanent</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Employee
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Contact
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Employment
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredEmployees.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="5"
//                     className="px-6 py-12 text-center text-gray-500"
//                   >
//                     <div className="flex flex-col items-center">
//                       <Filter className="w-12 h-12 text-gray-300 mb-4" />
//                       <p className="text-lg font-medium">No employees found</p>
//                       <p className="text-sm">
//                         Try adjusting your search or filters
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredEmployees.map((emp) => (
//                   <tr key={emp.employee_id} className="hover:bg-gray-50">
//                     {/* Employee */}
//                     <td className="px-6 py-4">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {`${emp.first_name} ${emp.middle_name || ""} ${
//                             emp.last_name || ""
//                           }`}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {emp.employment_details?.designation?.name || "N/A"}
//                         </div>
//                       </div>
//                     </td>

//                     {/* Contact */}
//                     <td className="px-6 py-4">
//                       <div>
//                         <div className="text-sm text-gray-900">
//                           {emp.employment_details?.official_email ||
//                             emp.personal_email ||
//                             "N/A"}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {emp.employee_mobile_number || "N/A"}
//                         </div>
//                         {emp.current_city && (
//                           <div className="flex items-center text-sm text-gray-500">
//                             <MapPin className="w-3 h-3 mr-1" />
//                             {emp.current_city}
//                           </div>
//                         )}
//                       </div>
//                     </td>

//                     {/* Employment */}
//                     <td className="px-6 py-4">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {emp.employee_code || "N/A"}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {emp.employment_details?.department?.name || "N/A"}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           Joined:{" "}
//                           {formatDate(
//                             emp.employment_details?.date_of_joining
//                           ) || "N/A"}
//                         </div>
//                       </div>
//                     </td>

//                     {/* Status */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {(() => {
//                         const status =
//                           emp.employment_details?.status_history?.[
//                             emp.employment_details.status_history.length - 1
//                           ]?.status;

//                         const base = "px-3 py-1 text-xs font-semibold rounded-full border";

//                         const color =
//                           status === "Active"
//                             ? "bg-green-100 text-green-700 border-green-300"
//                             : status === "On_Progress"
//                             ? "bg-blue-100 text-blue-700 border-blue-300"
//                             : status === "On_Notice"
//                             ? "bg-yellow-100 text-yellow-700 border-yellow-300"
//                             : status === "Resigned"
//                             ? "bg-orange-100 text-orange-700 border-orange-300"
//                             : status === "Terminated"
//                             ? "bg-red-100 text-red-700 border-red-300"
//                             : status === "Retired"
//                             ? "bg-gray-200 text-gray-700 border-gray-300"
//                             : "bg-gray-100 text-gray-600 border-gray-300";

//                         return <span className={`${base} ${color}`}>{status || "N/A"}</span>;
//                       })()}
//                     </td>

//                     {/* Actions */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => onAction("view", emp.employee_id)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                           title="View Employee"
//                         >
//                           <Eye className="w-4 h-4" />
//                         </button>

//                         <button
//                           onClick={() => onAction("edit", emp.employee_id)}
//                           className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
//                           title="Edit Employee"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>

//                         <button
//                           onClick={() => handleOpenActivationModal(emp)}
//                           className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
//                           title="Manage Employee Status"
//                         >
//                           <CheckCircle className="w-4 h-4" />
//                         </button>

//                         <button
//                           onClick={() => onDelete(emp.employee_id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                           title="Delete Employee"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Footer */}
//         {filteredEmployees.length > 0 && (
//           <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
//             <p className="text-sm text-gray-700">
//               Showing {filteredEmployees.length} of {employees.length} employees
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Activation Modal */}
//       <EmployeeActivationModal
//         isOpen={isActivationModalOpen}
//         onClose={handleCloseActivationModal}
//         employee={selectedEmployee}
//         onActivate={handleActivateEmployee}
//         onConfirmProbation={handleConfirmProbation}
//       />
//     </>
//   );
// };

// export default EmployeeTable;

