import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2, Search, Filter, MapPin, ChevronLeft, ChevronRight, X } from "lucide-react";
import { formatDate } from "../../../utils/helpers";
import { DepartmentsAPI } from "../../../api/departments";
import { DesignationsAPI } from "../../../api/designations";

const EmployeeManagementTable = ({ employees: propEmployees = [], onAction, onDelete }) => {
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");
  const [filterMobile, setFilterMobile] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const employees = propEmployees;

  // Helper function to get latest status
  const getLatestStatus = (statusHistory) => {
    if (!statusHistory || statusHistory.length === 0) return 'Active';
    
    const sorted = [...statusHistory].sort((a, b) => {
      const dateCompare = new Date(b.change_date) - new Date(a.change_date);
      if (dateCompare !== 0) return dateCompare;
      return new Date(b.created_at) - new Date(a.created_at);
    });
    
    return sorted[0]?.status || 'Active';
  };

  useEffect(() => { 
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [departmentsRes, designationsRes] = await Promise.all([
          DepartmentsAPI.getAll(),
          DesignationsAPI.getAll()
        ]);

        if (departmentsRes?.success && Array.isArray(departmentsRes.result)) {
          setDepartments(departmentsRes.result);
        }

        if (designationsRes?.success && Array.isArray(designationsRes.result)) {
          setDesignations(designationsRes.result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const officeLocations = [
    ...new Set(
      employees
        .map((emp) => emp.employment_details?.office_location?.name)
        .filter(Boolean)
    ),
  ];

  const filteredEmployees = employees.filter((emp) => {
    const name = `${emp.first_name} ${emp.middle_name || ""} ${emp.last_name || ""}`
      .trim()
      .toLowerCase();
    const email = emp.employment_details?.official_email?.toLowerCase() || "";
    const empCode = emp.employee_code?.toLowerCase() || "";
    const department = emp.employment_details?.department?.name || "";
    const designation = emp.employment_details?.designation?.name || "";
    const mobileNumber = emp.employee_mobile_number || "";
    const officeLocation = emp.employment_details?.office_location?.name || "";

    const matchesSearch =
      !searchTerm ||
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      empCode.includes(searchTerm.toLowerCase());

    const matchesDepartment = !filterDepartment || department === filterDepartment;
    const matchesDesignation = !filterDesignation || designation === filterDesignation;
    const matchesMobile = !filterMobile || mobileNumber.includes(filterMobile);
    const matchesLocation = !filterLocation || officeLocation === filterLocation;

    return matchesSearch && matchesDepartment && matchesDesignation && 
           matchesMobile && matchesLocation;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDepartment, filterDesignation, filterMobile, filterLocation]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setFilterDepartment("");
    setFilterDesignation("");
    setFilterMobile("");
    setFilterLocation("");
  };

  const hasActiveFilters = searchTerm || filterDepartment || filterDesignation || 
                           filterMobile || filterLocation;

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading filters...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Employee List
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

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>

            <select
              value={filterDesignation}
              onChange={(e) => setFilterDesignation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Designations</option>
              {designations.map((desig) => (
                <option key={desig.id} value={desig.name}>
                  {desig.name}
                </option>
              ))}
            </select>

            <div className="relative">
              <input
                type="text"
                placeholder="Filter by mobile..."
                value={filterMobile}
                onChange={(e) => setFilterMobile(e.target.value)}
                className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              {officeLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Employment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentEmployees.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  <Filter className="w-12 h-12 text-gray-300 mb-4 mx-auto" />
                  <p className="text-lg font-medium">No employees found</p>
                </td>
              </tr>
            ) : (
              currentEmployees.map((emp) => {
                const latestStatus = getLatestStatus(emp.status_history);
                
                return (
                  <tr key={emp.employee_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {`${emp.first_name} ${emp.middle_name || ""} ${emp.last_name || ""}`.trim()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {emp.employment_details?.designation?.name || "N/A"}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">
                          {emp.employment_details?.official_email || emp.personal_email || "N/A"}
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

                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {emp.employee_code || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {emp.employment_details?.department?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500">
                          Joined: {formatDate(emp.employment_details?.date_of_joining) || "N/A"}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-300">
                        {latestStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4">
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

      {/* Pagination */}
      {filteredEmployees.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employees
              </p>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Per page:</label>
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-lg"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-1 text-sm rounded-lg ${
                        currentPage === page
                          ? "bg-orange-500 text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagementTable;