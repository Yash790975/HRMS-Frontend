import React, { useEffect, useState } from "react";
import {
  ArrowLeft,User,Mail,Phone,MapPin,Building,Calendar,Badge,
  CreditCard,Briefcase,Clock,Home,Users,FileText,GraduationCap,
  Award,Heart,Shield,Upload,CheckCircle,ReceiptIndianRupeeIcon,
  AlignVerticalJustifyEnd,Wallet,
} from "lucide-react";
import { formatDate } from "../../../utils/helpers";
// import { EmployeeMasterAPI } from '../../../api/employeeMaster';
import { EmployeeMasterAPI } from "../../../api/employeeMaster";
import { EmployeePassportDetailsAPI } from "../../../api/employeePassportDetails";
import { EmployeePriorExperienceAPI } from "../../../api/employeePriorExperience";
import { EmployeeFamilyDetailsAPI } from "../../../api/employeeFamilyDetails";
import { EmployeeInsuranceDetailsAPI } from "../../../api/employeeInsuranceDetails";
import { EmployeeSkillsAPI } from "../../../api/employeeSkills";
import { EmployeeChildrenDetailsAPI } from "../../../api/employeeChildrenDetails";
import { EmployeeBankDetailsAPI } from "../../../api/employeeBankDetails";
import { EmployeeReferenceseAPI } from "../../../api/employeeReferences";
import { EmployeeDocumentChecklistAPI } from "../../../api/employeeDocumentChecklist";
import { BASE_URL } from "../../../api/api-config"; 

const EmployeeDetailsView = ({ employeeId, onBack }) => {
  const [employee, setEmployee] = useState(null);
  const [passportDetails, setPassportDetails] = useState(null);
  const [priorExperience, setPriorExperience] = useState([]);
  const [familyDetails, setFamilyDetails] = useState([]);
  const [insuranceDetails, setInsuranceDetails] = useState(null);
  const [skills, setSkills] = useState([]);
  const [childrenDetails, setChildrenDetails] = useState([]);
  const [bankDetails, setBankDetails] = useState([]);
  const [employeeReferencese, setEmployeeReferencese] = useState([]);
  const [employeeDocumentChecklist, setEmployeeDocumentChecklist] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employee details from API
  useEffect(() => {
    console.log("=== EMPLOYEE DETAILS VIEW ===");
    console.log("Received employeeId prop:", employeeId);
    console.log("Type of employeeId:", typeof employeeId);

    const fetchEmployeeDetails = async () => {
      if (!employeeId) {
        console.error("No employeeId provided!");
        setError("No employee ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching employee with ID:", employeeId);
        const response = await EmployeeMasterAPI.getById(employeeId);
        console.log("API Response:", response);

        if (response?.success && response.result) {
          console.log("Employee data received:", response.result);
          setEmployee(response.result);
        } else {
          setError("Failed to fetch employee details");
          console.error("Unexpected API response:", response);
        }
      } catch (err) {
        setError("Error loading employee details");
        console.error("Error fetching employee:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId]);

  //  Fetch passport details
  useEffect(() => {
    if (!employeeId) return;

    const fetchPassportDetails = async () => {
      try {
        console.log("Fetching passport details for employee ID:", employeeId);
        const response = await EmployeePassportDetailsAPI.getByEmployeeId(
          employeeId
        );
        // console.log(response)
        console.log("Passport details response:", response);

        if (response?.success && response.result) {
          setPassportDetails(response.result);
        }
      } catch (err) {
        console.error("Error fetching passport details:", err);
      }
    };

    fetchPassportDetails();
  }, [employeeId]);

  //  Fetch prior experience
  useEffect(() => {
    if (!employeeId) return;

    const fetchPriorExperience = async () => {
      try {
        console.log("Fetching prior experience for employee ID:", employeeId);
        const response = await EmployeePriorExperienceAPI.getByEmployeeId(
          employeeId
        );
        console.log("Prior experience response:", response);

        if (response?.success && Array.isArray(response.result)) {
          setPriorExperience(response.result);
        }
      } catch (err) {
        console.error("Error fetching prior experience:", err);
      }
    };

    fetchPriorExperience();
  }, [employeeId]);

  //  Fetch Employee Referencese
  useEffect(() => {
    if (!employeeId) return;

    const fetchEmployeeReferencese = async () => {
      try {
        console.log(
          "Fetching Employee Referencese for employee ID:",
          employeeId
        );
        const response = await EmployeeReferenceseAPI.getByEmployeeId(
          employeeId
        );
        console.log("Employee Referencese response:", response);

        if (response?.success && Array.isArray(response.result)) {
          setEmployeeReferencese(response.result);
        }
      } catch (err) {
        console.error("Error fetching Employee Referencese:", err);
      }
    };

    fetchEmployeeReferencese();
  }, [employeeId]);

  // Fetch family details
  useEffect(() => {
    if (!employeeId) return;

    const fetchFamilyDetails = async () => {
      try {
        console.log("Fetching family details for employee ID:", employeeId);
        const response = await EmployeeFamilyDetailsAPI.getByEmployeeId(
          employeeId
        );
        console.log("Family details response:", response);

        console.log(response.result);

        if (response?.success && response.result) {
          setFamilyDetails(response.result);
        }

        // if (response.success && Array.isArray(response.result)) {
        // setFamilyDetails(response.result);
        // console.log(response.result)
        // }
      } catch (err) {
        console.error("Error fetching family details:", err);
      }
    };

    fetchFamilyDetails();
  }, [employeeId]);

  //  Fetch insurance details
  useEffect(() => {
    if (!employeeId) return;

    const fetchInsuranceDetails = async () => {
      try {
        console.log("Fetching insurance details for employee ID:", employeeId);
        const response = await EmployeeInsuranceDetailsAPI.getByEmployeeId(
          employeeId
        );
        console.log("Insurance details response:", response);

        if (response?.success && response.result) {
          setInsuranceDetails(response.result);
        }
      } catch (err) {
        console.error("Error fetching insurance details:", err);
      }
    };

    fetchInsuranceDetails();
  }, [employeeId]);

  // Fetch skills
  useEffect(() => {
    if (!employeeId) return;

    const fetchSkills = async () => {
      try {
        console.log("Fetching skills for employee ID:", employeeId);
        const response = await EmployeeSkillsAPI.getByEmployeeId(employeeId);
        console.log("Skills response:", response);

        if (response?.success && Array.isArray(response.result)) {
          setSkills(response.result);
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    };

    fetchSkills();
  }, [employeeId]);

  //  Fetch children details
  useEffect(() => {
    if (!employeeId) return;

    const fetchChildrenDetails = async () => {
      try {
        console.log("Fetching children details for employee ID:", employeeId);
        const response = await EmployeeChildrenDetailsAPI.getByEmployeeId(
          employeeId
        );
        console.log("Children details response:", response);

        if (response?.success && Array.isArray(response.result)) {
          setChildrenDetails(response.result);
        }
      } catch (err) {
        console.error("Error fetching children details:", err);
      }
    };

    fetchChildrenDetails();
  }, [employeeId]);

  // Bank account details
  useEffect(() => {
    if (!employeeId) return;

    const fetchBankDetails = async () => {
      try {
        console.log("Fetching bank details for employee ID:", employeeId);
        const response = await EmployeeBankDetailsAPI.getByEmployeeId(
          employeeId
        );
        console.log("Bank details response:", response);
        console.log("bankkkkkkkkkkkkkkkkkkkkkkkkkk:", response?.result);

        if (response?.success && response?.result) {
          setBankDetails(response.result);
        }
       
      } catch (err) {
        console.error("Error fetching bank details:", err);
      
        // setBankDetails([]);
      }
    };

    fetchBankDetails();
  }, [employeeId]);

  
  // DOCS account details
  // useEffect(() => {
  //   if (!employeeId) return;

  //   const fetchDocumentChecklist = async () => {
  //     try {
  //       console.log("Fetching Documents for employee ID:", employeeId);
  //       const response = await EmployeeDocumentChecklistAPI.getByEmployeeId(
  //         employeeId
  //       );
  //       // console.log("Docssssssssssssssssss details response:", response.result?.last_3months_payslip_url);
  //       console.log("Docsssssssssssssss:", response?.result);

  //       if (response?.success && response?.result) {
  //         setEmployeeDocumentChecklist(response.result);
  //       }
       
  //     } catch (err) {
  //       console.error("Error fetching Doc details:", err);
      
  //       // setBankDetails([]);
  //     }
  //   };

  //   fetchDocumentChecklist();
  // }, [employeeId]);


  // DOCS account details
  useEffect(() => {
    if (!employeeId) return;

    const fetchDocumentChecklist = async () => {
      try {
        console.log("Fetching Documents for employee ID:", employeeId);
        const response = await EmployeeDocumentChecklistAPI.getByEmployeeId(
          employeeId
        );
        console.log("Docsssssssssssssss:", response?.result);

        if (response?.success && response?.result) {
          // Parse the payslip URLs if they exist
          const processedResult = { ...response.result };
          if (processedResult.last_3months_payslip_url) {
            try {
              processedResult.last_3months_payslip_url = JSON.parse(
                processedResult.last_3months_payslip_url
              );
            } catch (e) {
              console.error("Error parsing payslip URLs:", e);
              processedResult.last_3months_payslip_url = [];
            }
          }
          setEmployeeDocumentChecklist(processedResult);
        }
       
      } catch (err) {
        console.error("Error fetching Doc details:", err);
      }
    };

    fetchDocumentChecklist();
  }, [employeeId]);

  // ---------------------
  const getStatusBadge = () => {
    const isProbation = employee?.employment_details?.is_probation;
    return isProbation ? (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
        <Clock className="w-4 h-4 mr-2" />
        Probationary Period
      </span>
    ) : (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
        <Badge className="w-4 h-4 mr-2" />
        Full Time Employee
      </span>
    );
  };

  const InfoCard = ({ icon: Icon, title, children, className = "" }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}
    >
      <div className="flex items-center mb-4">
        <div className="p-2 bg-orange-50 rounded-lg mr-3">
          <Icon className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );

  const DetailItem = ({ label, value, icon: Icon }) => (
    <div className="flex items-start space-x-3">
      {Icon && (
        <div className="p-1.5 bg-gray-100 rounded-lg mt-0.5">
          <Icon className="w-4 h-4 text-gray-600" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-base text-gray-900 break-words">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );

  const DocumentStatus = ({ label, isUploaded }) => (
    <div className="flex items-center space-x-3">
      <CheckCircle
        className={`w-5 h-5 ${isUploaded ? "text-green-600" : "text-gray-400"}`}
      />
      <span
        className={`text-sm font-medium ${
          isUploaded ? "text-green-700" : "text-gray-500"
        }`}
      >
        {label}
      </span>
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          isUploaded
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {isUploaded ? "Uploaded" : "Pending"}
      </span>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Employee Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            The employee details could not be loaded.
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </button>
        </div>
      </div>
    );
  }

  // Helper function to get full name
  const getFullName = () => {
    return (
      `${employee.first_name || ""} ${employee.middle_name || ""} ${
        employee.last_name || ""
      }`.trim() || "Unknown Employee"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Employees
              </button>
            </div>
            <div className="flex items-center space-x-4">
              {getStatusBadge()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Employee Header */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl shadow-sm p-8 mb-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{getFullName()}</h1>
              <p className="text-orange-100 text-lg">
                {employee.employment_details?.designation?.name ||
                  "No designation specified"}
              </p>
              <p className="text-orange-200 text-sm mt-1">
                Employee ID: {employee.employee_code || "Not assigned"}
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}

          <InfoCard
            icon={User}
            title="Personal Information"
            className="w-full col-span-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
              {/* Left Column */}
              <div className="space-y-3">
                <DetailItem
                  label="First Name"
                  value={employee.first_name}
                  icon={User}
                />
                <DetailItem
                  label="Middle Name"
                  value={employee.middle_name}
                  icon={User}
                />
                <DetailItem
                  label="Last Name"
                  value={employee.last_name}
                  icon={User}
                />
                <DetailItem
                  label="Personal Email"
                  value={employee.personal_email}
                  icon={Mail}
                />
                <DetailItem
                  label="Personal Email"
                  value={employee.alternative_email}
                  icon={Mail}
                />
                <DetailItem
                  label="Mobile Number"
                  value={employee.employee_mobile_number}
                  icon={Phone}
                />
                <DetailItem
                  label="Date of Birth"
                  value={formatDate(employee.date_of_birth)}
                  icon={Calendar}
                />
                <DetailItem
                  label="Gender"
                  value={employee.gender}
                  icon={User}
                />
                <DetailItem
                  label="Marital Status"
                  value={employee.marital_status}
                  icon={Heart}
                />
                <DetailItem
                  label="Blood Group"
                  value={employee.blood_group}
                  icon={Heart}
                />
                <DetailItem
                  label="Aadhar Number"
                  value={employee.aadhaar_number}
                  icon={CreditCard}
                />
                <DetailItem
                  label="PAN Number"
                  value={employee.pan_number}
                  icon={CreditCard}
                />
                <DetailItem
                  label="Father's Name"
                  value={familyDetails?.fathers_full_name}
                  icon={User}
                />
                <DetailItem
                  label="Mother's Name"
                  value={familyDetails?.mothers_full_name}
                  icon={User}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                <DetailItem
                  label="Spouse Name"
                  value={employee.spouse_name}
                  icon={User}
                />
                <DetailItem
                  label="City"
                  value={employee.current_city}
                  icon={MapPin}
                />
                <DetailItem
                  label="State"
                  value={employee.current_state}
                  icon={MapPin}
                />
                <DetailItem
                  label="Country"
                  value={employee.current_country}
                  icon={MapPin}
                />
                <DetailItem
                  label="Nationality"
                  value={employee.nationality}
                  icon={User}
                />
                <DetailItem
                  label="Religion"
                  value={employee.religion}
                  icon={ReceiptIndianRupeeIcon}
                />
                <DetailItem
                  label="Hobbies"
                  value={employee.hobbies}
                  icon={AlignVerticalJustifyEnd}
                />
                <DetailItem
                  label="University/Collage Name"
                  value={employee.university_name}
                  icon={AlignVerticalJustifyEnd}
                />
              </div>
            </div>
          </InfoCard>


          {/* Employment Details */}
          <InfoCard
            icon={Briefcase}
            title="Employment Details"
            className="lg:col-span-1"
          >
            <DetailItem
              label="Employee Code"
              value={employee.employee_code}
              icon={CreditCard}
            />
            <DetailItem
              label="Official Email"
              value={employee.employment_details?.official_email}
              icon={Mail}
            />
            <DetailItem
              label="Department"
              value={employee.employment_details?.department?.name}
              icon={Building}
            />
            <DetailItem
              label="Designation"
              value={employee.employment_details?.designation?.name}
              icon={Briefcase}
            />
            <DetailItem
              label="Date of Joining"
              value={formatDate(employee.employment_details?.date_of_joining)}
              icon={Calendar}
            />
            <DetailItem
              label="Recruiter Name"
              value={employee.employment_details?.recruiter_name}
              icon={User}
            />
            {/* <DetailItem label="Recruitment Source" value={employee.employment_details?.recruitment_source?.name} icon={Building} /> */}
            {/* <DetailItem label="Reporting Manager" value={employee.employment_details?.reporting_manager?.name} icon={User} /> */}
            <DetailItem
              label="Work Location"
              value={employee.employment_details?.office_location?.name}
              icon={MapPin}
            />
            <DetailItem
              label="Reporting Location"
              value={employee.employment_details?.office_location?.name}
              icon={MapPin}
            />
            <DetailItem
              label="Probation Status"
              value={
                employee.employment_details?.is_probation
                  ? "On Probation"
                  : "Permanent"
              }
              icon={Clock}
            />
          </InfoCard>

          {/* {console.log(familyDetails)} */}
          {/* Family Details */}
          {familyDetails?.fathers_full_name && (
            <InfoCard
              icon={FileText}
              title="Family Details"
              className="lg:col-span-1"
            >
              <DetailItem
                label="Father Full Name"
                value={familyDetails?.fathers_full_name}
                icon={FileText}
              />
              <DetailItem
                label="Fathers Occupation"
                value={familyDetails?.fathers_occupation}
                icon={FileText}
              />
              <DetailItem
                label="Fathers DOB"
                value={formatDate(familyDetails.fathers_dob)}
                icon={Calendar}
              />
              <DetailItem
                label="Mothers Full Name"
                value={familyDetails?.mothers_full_name}
                icon={FileText}
              />
              <DetailItem
                label="Mothers Occupation"
                value={familyDetails?.mothers_occupation}
                icon={FileText}
              />
              <DetailItem
                label="Mothers DOB"
                value={formatDate(familyDetails.mothers_dob)}
                icon={Calendar}
              />
              <DetailItem
                label="Spouse Full Name"
                value={familyDetails?.spouse_full_name}
                icon={FileText}
              />
              <DetailItem
                label="Spouse Occupation"
                value={familyDetails?.spouse_occupation}
                icon={FileText}
              />
              <DetailItem
                label="Spouse DOB"
                value={formatDate(familyDetails.spouse_dob)}
                icon={Calendar}
              />
            </InfoCard>
          )}

          {/* Passport Details */}
          {passportDetails?.passport_number && (
            <InfoCard
              icon={FileText}
              title="Passport Details"
              className="lg:col-span-1"
            >
              <DetailItem
                label="Passport Number"
                value={passportDetails.passport_number}
                icon={FileText}
              />
              <DetailItem
                label="Place of Issue"
                value={passportDetails.place_of_issue}
                icon={MapPin}
              />
              <DetailItem
                label="Date of Issue"
                value={formatDate(passportDetails.date_of_issue)}
                icon={Calendar}
              />
              <DetailItem
                label="Date of Expiry"
                value={formatDate(passportDetails.date_of_expiry)}
                icon={Calendar}
              />
            </InfoCard>
          )}

          {/* Insurennnnce Details */}
          {insuranceDetails?.self_name && (
            <InfoCard
              icon={FileText}
              title="Insurance Details"
              className="lg:col-span-1"
            >
              <DetailItem
                label="Self Name"
                value={insuranceDetails.self_name}
                icon={FileText}
              />
              <DetailItem
                label="Self Dob"
                value={formatDate(insuranceDetails.self_dob)}
                icon={Calendar}
              />
              <DetailItem
                label="Self Age"
                value={insuranceDetails.self_age}
                icon={MapPin}
              />
              <DetailItem
                label="Self Gender"
                value={insuranceDetails.self_gender}
                icon={MapPin}
              />
              <DetailItem
                label="Marital Status"
                value={insuranceDetails.marital_status}
                icon={Calendar}
              />
            </InfoCard>
          )}

          {/* Emergency Contacts */}
          {/* {(employee.emergency_contact_1_name || employee.emergency_contact_2_name) && ( */}
          <InfoCard
            icon={Phone}
            title="Emergency Contacts"
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-orange-600" />
                  Emergency Contact 1
                </h4>
                <DetailItem
                  label="Name"
                  value={employee.emergency_contact_name1}
                  icon={User}
                />
                <DetailItem
                  label="Relation"
                  value={employee.emergency_contact_relationship1}
                  icon={Heart}
                />
                <DetailItem
                  label="Mobile Number"
                  value={employee.emergency_contact_number1}
                  icon={Phone}
                />
                {/* <DetailItem label="Alternate Number" value={employee.emergency_contact_alternate_mobile_number_1} icon={Phone} /> */}
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-orange-600" />
                  Emergency Contact 2
                </h4>
                <DetailItem
                  label="Name"
                  value={employee.emergency_contact_name2}
                  icon={User}
                />
                <DetailItem
                  label="Relation"
                  value={employee.emergency_contact_relationship2}
                  icon={Heart}
                />
                <DetailItem
                  label="Mobile Number"
                  value={employee.emergency_contact_number2}
                  icon={Phone}
                />
                {/* <DetailItem label="Alternate Number" value={employee.emergency_contact_2_alternate_mobile_number} icon={Phone} /> */}
              </div>
            </div>
          </InfoCard>
          {/* )} */}

          {/* Work Experience */}
          {priorExperience && priorExperience.length > 0 && (
            <>
              {priorExperience.map((experience, index) => (
                <InfoCard
                  key={index}
                  icon={Briefcase}
                  title={`Previous Work Experience ${
                    priorExperience.length > 1 ? index + 1 : ""
                  }`}
                  className="lg:col-span-1"
                >
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <DetailItem
                      label="Company Name"
                      value={experience.company_name_size}
                      icon={Building}
                    />
                    <DetailItem
                      label="Previous Designation"
                      value={experience.post_held}
                      icon={Briefcase}
                    />
                    <DetailItem
                      label="Previous Department"
                      value={experience.department_function}
                      icon={Building}
                    />
                    <DetailItem
                      label="City"
                      value={experience.city}
                      icon={MapPin}
                    />
                    <DetailItem
                      label="Tenure"
                      value={experience.tenure_years_months}
                      icon={Clock}
                    />
                  </div>
                </InfoCard>
              ))}
            </>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <>
              {skills.map((skill, index) => (
                <InfoCard
                  key={index}
                  icon={Briefcase}
                  title={`Skills ${skills.length > 1 ? index + 1 : ""}`}
                  className="lg:col-span-1"
                >
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <DetailItem
                      label="Area of Skill"
                      value={skill.skill_area}
                      icon={Building}
                    />
                    <DetailItem
                      label="Skills"
                      value={skill.skills_acquired}
                      icon={Briefcase}
                    />
                    <DetailItem
                      label="Grade"
                      value={skill.certification_grade}
                      icon={Building}
                    />
                    <DetailItem
                      label="Summary"
                      value={skill.project_summary}
                      icon={MapPin}
                    />
                  </div>
                </InfoCard>
              ))}
            </>
          )}

          {/* refference Details */}
          {employeeReferencese && employeeReferencese.length > 0 && (
            <>
              {employeeReferencese.map((employeeReference, index) => (
                <InfoCard
                  key={index}
                  icon={Briefcase}
                  title={`Employee Referencese Details ${
                    employeeReferencese.length > 1 ? index + 1 : ""
                  }`}
                  className="lg:col-span-1"
                >
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <DetailItem
                      label="Reference Name"
                      value={employeeReference.reference_name}
                      icon={Building}
                    />
                    <DetailItem
                      label="Reference Mobile Number"
                      value={employeeReference.reference_mobile_number}
                      icon={Briefcase}
                    />
                    <DetailItem
                      label="Area"
                      value={employeeReference.area}
                      icon={Building}
                    />
                    <DetailItem
                      label="Organization"
                      value={employeeReference.organization}
                      icon={MapPin}
                    />
                    <DetailItem
                      label="Relationship With Reference"
                      value={employeeReference.relationship_with_reference}
                      icon={MapPin}
                    />
                  </div>
                </InfoCard>
              ))}
            </>
          )}

          {/* Bank Details */}
          {/* {console.log(bankDetails)} */}
          {bankDetails?.account_holder_name && (
            <InfoCard
              icon={FileText}
              title="Bank Details"
              className="lg:col-span-1"
            >
              <DetailItem
                label="Account Holder Name"
                value={bankDetails.account_holder_name}
                icon={FileText}
              />
              <DetailItem
                label="Account Number"
                value={bankDetails.account_number}
                icon={Calendar}
              />
              <DetailItem
                label="Account Type"
                value={bankDetails.account_type}
                icon={MapPin}
              />
              <DetailItem
                label="Bank Name"
                value={bankDetails.bank_name}
                icon={MapPin}
              />
              <DetailItem
                label="IFSC Code"
                value={bankDetails.ifsc_code}
                icon={Calendar}
              />
              <DetailItem
                label="Registered Mobile Number"
                value={bankDetails.registered_mobile_number}
                icon={Calendar}
              />
            </InfoCard>
          )}

          {/* Address Information */}
          <InfoCard
            icon={Home}
            title="Address Information"
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Home className="w-4 h-4 mr-2 text-orange-600" />
                  Local Address
                </h4>
                <DetailItem
                  label="Door No/House No"
                  value={employee.current_full_address?.split(" ")[0]}
                  icon={Home}
                />
                <DetailItem
                  label="Street"
                  value={
                    employee.current_full_address
                      ?.split(" ")
                      .slice(1)
                      .join(" ") || "N/A"
                  }
                  icon={Home}
                />
                <DetailItem
                  label="City"
                  value={employee.current_city}
                  icon={MapPin}
                />
                <DetailItem
                  label="District"
                  value={employee.current_district}
                  icon={MapPin}
                />
                <DetailItem
                  label="State"
                  value={employee.current_state}
                  icon={MapPin}
                />
                <DetailItem
                  label="Country"
                  value={employee.current_country}
                  icon={MapPin}
                />
                <DetailItem
                  label="PIN Code"
                  value={employee.current_pin_code}
                  icon={MapPin}
                />
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Home className="w-4 h-4 mr-2 text-orange-600" />
                  Permanent Address
                </h4>
                {employee.is_permanent_address_same_as_local ? (
                  <p className="text-sm text-gray-600 italic flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Same as local address
                  </p>
                ) : (
                  <>
                    <DetailItem
                      label="Door No/House No"
                      value={employee.permanent_full_address?.split(" ")[0]}
                      icon={Home}
                    />
                    <DetailItem
                      label="Street"
                      value={
                        employee.permanent_full_address
                          ?.split(" ")
                          .slice(1)
                          .join(" ") || "N/A"
                      }
                      icon={Home}
                    />
                    {/* <DetailItem label="Door No/House No" value={employee.permanent_door_no} icon={Home} />
                    <DetailItem label="Street" value={employee.permanent_street} icon={MapPin} /> */}
                    {/* <DetailItem label="Area" value={employee.employment_details?.office_location?.name} icon={MapPin} /> */}
                    <DetailItem
                      label="City"
                      value={employee.permanent_city}
                      icon={MapPin}
                    />
                    <DetailItem
                      label="District"
                      value={employee.permanent_district}
                      icon={MapPin}
                    />
                    <DetailItem
                      label="State"
                      value={employee.permanent_state}
                      icon={MapPin}
                    />
                    <DetailItem
                      label="Country"
                      value={employee.permanent_country}
                      icon={MapPin}
                    />
                    <DetailItem
                      label="PIN Code"
                      value={employee.permanent_pin_code}
                      icon={MapPin}
                    />
                  </>
                )}
              </div>
            </div>
          </InfoCard>

          {/* Children Details */}
          {childrenDetails && childrenDetails.length > 0 && (
            <>
              {childrenDetails.map((childrenDetail, index) => (
                <InfoCard
                  key={index}
                  icon={Briefcase}
                  title={`Children Details ${
                    childrenDetails.length > 1 ? index + 1 : ""
                  }`}
                  className="lg:col-span-1"
                >
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <DetailItem
                      label="Child Number"
                      value={childrenDetail.child_number}
                      icon={Building}
                    />
                    <DetailItem
                      label="Child Name"
                      value={childrenDetail.child_name}
                      icon={Briefcase}
                    />
                    <DetailItem
                      label="Child DOB"
                      value={childrenDetail.child_dob}
                      icon={Building}
                    />
                    <DetailItem
                      label="Child Age"
                      value={childrenDetail.child_age}
                      icon={MapPin}
                    />
                    <DetailItem
                      label="Child Gender"
                      value={childrenDetail.child_gender}
                      icon={MapPin}
                    />
                  </div>
                </InfoCard>
              ))}
            </>
          )}

          {/* DOCS Details */}
{/* DOCS Details */}

{employeeDocumentChecklist && (
  <InfoCard
    icon={FileText}
    title="Document Checklist"
    className="lg:col-span-2"
  >
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        {
          label: "Passport Size Photo",
          url: employeeDocumentChecklist.passport_size_photo_url,
        },
        {
          label: "Resume",
          url: employeeDocumentChecklist.resume_url,
        },
        {
          label: "Signed Offer Letter",
          url: employeeDocumentChecklist.signed_offer_letter_url,
        },
        {
          label: "Cheque for Trainee",
          url: employeeDocumentChecklist.cheque_for_trainee_url,
        },
        {
          label: "Medical Certificate for Trainee",
          url: employeeDocumentChecklist.medical_certificate_for_trainee_url,
        },
        {
          label: "PAN Card",
          url: employeeDocumentChecklist.pan_card_url,
        },
        {
          label: "Aadhaar Card",
          url: employeeDocumentChecklist.aadhaar_card_url,
        },
        {
          label: "Passport",
          url: employeeDocumentChecklist.passport_url,
        },
        {
          label: "10th Marks Card",
          url: employeeDocumentChecklist.tenth_marks_card_url,
        },
        {
          label: "12th Marks Card",
          url: employeeDocumentChecklist.twelfth_marks_card_url,
        },
        {
          label: "Degree Marks Card",
          url: employeeDocumentChecklist.degree_marks_card_certificate_url,
        },
        {
          label: "Master Degree Certificate",
          url: employeeDocumentChecklist.master_marks_card_certificate_url,
        },
        {
          label: "Local Address Proof",
          url: employeeDocumentChecklist.current_local_address_proof_url,
        },
        {
          label: "Permanent Address Proof",
          url: employeeDocumentChecklist.permanent_address_proof_url,
        },
        {
          label: "Experience Letter",
          url: employeeDocumentChecklist.experience_letter_url,
        },
        {
          label: "Relieving Letter",
          url: employeeDocumentChecklist.relieving_letter_url,
        },
        {
          label: "Last 3 Months Salary Slips",
          // url: employeeDocumentChecklist.last_3_months_salary_slips_url,
          url: employeeDocumentChecklist.last_3months_payslip_url,
        }
      ]
        // .filter(item => item.url) // only documents that exist
        // .map((doc, index) => (
        //   <div key={index} className="space-y-2">
        //     <p className="text-sm font-medium text-gray-500">{doc.label}</p>
        //     <a 
        //       href={BASE_URL + doc.url} 
        //       target="_blank" 
        //       rel="noopener noreferrer"
        //       className="block"
        //     >
        //       <img
        //         src={BASE_URL + doc.url}
        //         alt={doc.label}
        //         className="w-full h-48 object-cover rounded-md border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        //         onError={(e) => {
        //           e.target.onerror = null;
        //           e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
        //         }}
        //       />
        //     </a>
        //   </div>
        

        .filter(item => item.url)
        .map((doc, index) => (
          <div key={index} className="space-y-2">
            <p className="text-sm font-medium text-gray-500">{doc.label}</p>

            {Array.isArray(doc.url) ? (
              // If URL is array → render multiple images
              doc.url.map((u, i) => (
                
                <a 
                  key={i}
                  href={BASE_URL + u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={BASE_URL + u}
                    alt={`${doc.label} - ${i + 1}`}
                    className="w-full h-48 object-cover rounded-md border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </a>
              ))
            ) : (
              // If URL is single string → render one image
              <a
                href={BASE_URL + doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={BASE_URL + doc.url}
                  alt={doc.label}
                  className="w-full h-48 object-cover rounded-md border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </a>
            )}
          </div>
        ))
      }
    </div>
  </InfoCard>
)
}

          {/* Timeline */}
          <InfoCard icon={Calendar} title="Timeline" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem
                label="Created At"
                value={formatDate(employee.created_at)}
                icon={Calendar}
              />
              <DetailItem
                label="Last Updated"
                value={formatDate(employee.updated_at)}
                icon={Clock}
              />
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailsView;

