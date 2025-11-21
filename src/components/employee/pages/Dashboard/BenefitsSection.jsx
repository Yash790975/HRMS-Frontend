// import React from 'react';
// import { Shield, Heart, Umbrella, PiggyBank, Award, Calendar, ChevronRight } from 'lucide-react';

// const BenefitsSection = () => {
//   const benefits = [
//     {
//       id: 1,
//       name: 'Health Insurance',
//       type: 'Medical',
//       icon: Heart,
//       status: 'Enrolled',
//       plan: 'Premium PPO',
//       coverage: 'Employee + Family',
//       monthlyPremium: 450,
//       employeeContribution: 150,
//       nextAction: 'Annual enrollment: Oct 2025',
//       color: 'red'
//     },
//     {
//       id: 2,
//       name: 'Dental Insurance',
//       type: 'Dental',
//       icon: Shield,
//       status: 'Enrolled',
//       plan: 'Complete Care',
//       coverage: 'Employee + Spouse',
//       monthlyPremium: 75,
//       employeeContribution: 25,
//       nextAction: 'Claim pending review',
//       color: 'blue'
//     },
//     {
//       id: 3,
//       name: '401(k) Retirement',
//       type: 'Retirement',
//       icon: PiggyBank,
//       status: 'Active',
//       plan: '6% match',
//       coverage: 'Traditional + Roth',
//       monthlyPremium: 0,
//       employeeContribution: 187.50,
//       nextAction: 'Increase contribution limit available',
//       color: 'green'
//     },
//     {
//       id: 4,
//       name: 'Life Insurance',
//       type: 'Insurance',
//       icon: Umbrella,
//       status: 'Enrolled',
//       plan: 'Term Life',
//       coverage: '2x Annual Salary',
//       monthlyPremium: 37.50,
//       employeeContribution: 12.50,
//       nextAction: 'Beneficiary update recommended',
//       color: 'purple'
//     },
//     {
//       id: 5,
//       name: 'Wellness Program',
//       type: 'Wellness',
//       icon: Award,
//       status: 'Participating',
//       plan: 'Complete Wellness',
//       coverage: 'Gym + Mental Health',
//       monthlyPremium: 0,
//       employeeContribution: 0,
//       nextAction: 'Complete health assessment',
//       color: 'orange'
//     }
//   ];

//   const benefitsSummary = {
//     totalBenefitsValue: benefits.reduce((sum, benefit) => sum + benefit.monthlyPremium, 0) * 12,
//     employeeContributions: benefits.reduce((sum, benefit) => sum + benefit.employeeContribution, 0) * 12,
//     employerContributions: benefits.reduce((sum, benefit) => sum + (benefit.monthlyPremium - benefit.employeeContribution), 0) * 12,
//     enrolledBenefits: benefits.filter(b => b.status === 'Enrolled' || b.status === 'Active' || b.status === 'Participating').length
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Enrolled': return 'bg-green-100 text-green-800';
//       case 'Active': return 'bg-blue-100 text-blue-800';
//       case 'Participating': return 'bg-purple-100 text-purple-800';
//       case 'Pending': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getIconColor = (color) => {
//     const colors = {
//       red: 'text-red-600 bg-red-100',
//       blue: 'text-blue-600 bg-blue-100',
//       green: 'text-green-600 bg-green-100',
//       purple: 'text-purple-600 bg-purple-100',
//       orange: 'text-orange-600 bg-orange-100'
//     };
//     return colors[color] || 'text-gray-600 bg-gray-100';
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-lg font-semibold text-gray-900">Employee Benefits</h2>
//         <Shield className="h-5 w-5 text-orange-600" />
//       </div>

//       {/* Benefits Summary */}
//       <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
//         <h3 className="font-semibold text-blue-800 mb-3">Benefits Summary</h3>
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <p className="text-sm text-blue-600">Total Benefits Value</p>
//             <p className="text-xl font-bold text-blue-700">{formatCurrency(benefitsSummary.totalBenefitsValue)}</p>
//             <p className="text-xs text-blue-600">Annual value</p>
//           </div>
//           <div>
//             <p className="text-sm text-blue-600">Your Contribution</p>
//             <p className="text-xl font-bold text-blue-700">{formatCurrency(benefitsSummary.employeeContributions)}</p>
//             <p className="text-xs text-blue-600">Annual cost</p>
//           </div>
//         </div>
//         <div className="mt-3 pt-3 border-t border-blue-200">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-blue-600">Employer Contribution:</span>
//             <span className="font-semibold text-blue-700">{formatCurrency(benefitsSummary.employerContributions)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Benefits Overview Stats */}
//       <div className="grid grid-cols-4 gap-4 mb-6">
//         <div className="text-center p-3 bg-green-50 rounded-lg">
//           <p className="text-lg font-bold text-green-600">{benefitsSummary.enrolledBenefits}</p>
//           <p className="text-xs text-green-600">Active Benefits</p>
//         </div>
//         <div className="text-center p-3 bg-blue-50 rounded-lg">
//           <p className="text-lg font-bold text-blue-600">100%</p>
//           <p className="text-xs text-blue-600">Coverage</p>
//         </div>
//         <div className="text-center p-3 bg-purple-50 rounded-lg">
//           <p className="text-lg font-bold text-purple-600">$0</p>
//           <p className="text-xs text-purple-600">Claims YTD</p>
//         </div>
//         <div className="text-center p-3 bg-orange-50 rounded-lg">
//           <p className="text-lg font-bold text-orange-600">95%</p>
//           <p className="text-xs text-orange-600">Wellness Score</p>
//         </div>
//       </div>

//       {/* Benefits List */}
//       <div className="space-y-3">
//         {benefits.map((benefit) => {
//           const IconComponent = benefit.icon;
//           return (
//             <div key={benefit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
//               <div className="flex items-start justify-between">
//                 <div className="flex items-start space-x-3">
//                   <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor(benefit.color)}`}>
//                     <IconComponent className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-gray-900">{benefit.name}</h3>
//                     <p className="text-sm text-gray-600">{benefit.plan} • {benefit.coverage}</p>
//                     <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
//                       <span>Monthly: {formatCurrency(benefit.employeeContribution)}</span>
//                       {benefit.monthlyPremium > 0 && (
//                         <span>Total Value: {formatCurrency(benefit.monthlyPremium)}</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-2">
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(benefit.status)}`}>
//                     {benefit.status}
//                   </span>
//                   <ChevronRight className="h-4 w-4 text-gray-400" />
//                 </div>
//               </div>
              
//               {benefit.nextAction && (
//                 <div className="mt-3 pt-3 border-t border-gray-100">
//                   <div className="flex items-center space-x-2 text-sm">
//                     <Calendar className="h-3 w-3 text-orange-600" />
//                     <span className="text-orange-600 font-medium">Action Required:</span>
//                     <span className="text-gray-600">{benefit.nextAction}</span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>

//       {/* Open Enrollment Notice */}
//       <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//         <div className="flex items-start space-x-2">
//           <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
//           <div>
//             <h4 className="font-medium text-yellow-800">Open Enrollment Period</h4>
//             <p className="text-sm text-yellow-700 mt-1">
//               Annual benefits enrollment opens October 1, 2025. Review and update your benefit selections.
//             </p>
//             <button className="mt-2 text-sm text-yellow-800 font-medium hover:text-yellow-900">
//               Set Reminder →
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Benefits Resources */}
//       <div className="mt-4 text-center">
//         <button className="text-orange-600 hover:text-orange-700 text-sm font-medium">
//           View Benefits Guide & Resources →
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BenefitsSection;    
import React from 'react';
import { Shield, Heart, Umbrella, PiggyBank, Award, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BenefitsSection = () => {
  const navigate = useNavigate();
  
  // Mock benefits data based on MyBenefits.jsx structure
  const benefitsData = {
    healthInsurance: {
      plan: 'Premium Health Plan',
      monthlyContribution: 100,
      coverage: 'Employee + Family'
    },
    retirement: {
      currentBalance: 45000,
      contributionRate: 6,
      employerMatch: 4
    },
    lifeInsurance: {
      coverage: 100000
    },
    paidTimeOff: {
      vacation: { remaining: 80 }
    }
  };

  const benefits = [
    {
      id: 1,
      name: 'Health Insurance',
      type: 'Medical',
      icon: Heart,
      status: 'Enrolled',
      plan: benefitsData.healthInsurance.plan,
      coverage: benefitsData.healthInsurance.coverage,
      monthlyContribution: benefitsData.healthInsurance.monthlyContribution,
      color: 'red'
    },
    {
      id: 2,
      name: '401(k) Retirement',
      type: 'Retirement',
      icon: PiggyBank,
      status: 'Active',
      plan: `${benefitsData.retirement.contributionRate}% contribution`,
      coverage: `${benefitsData.retirement.employerMatch}% employer match`,
      currentBalance: benefitsData.retirement.currentBalance,
      color: 'green'
    },
    {
      id: 3,
      name: 'Life Insurance',
      type: 'Insurance',
      icon: Umbrella,
      status: 'Enrolled',
      plan: 'Term Life',
      coverage: `$${benefitsData.lifeInsurance.coverage.toLocaleString()} coverage`,
      color: 'purple'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Enrolled': return 'bg-green-100 text-green-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'Participating': return 'bg-purple-100 text-purple-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconColor = (color) => {
    const colors = {
      red: 'text-red-600 bg-red-100',
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      orange: 'text-orange-600 bg-orange-100'
    };
    return colors[color] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Employee Benefits</h2>
        <Shield className="h-5 w-5 text-orange-600" />
      </div>

      {/* Benefits Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-3">Benefits Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-600">Health Insurance</p>
            <p className="text-xl font-bold text-blue-700">{formatCurrency(benefitsData.healthInsurance.monthlyContribution)}</p>
            <p className="text-xs text-blue-600">Monthly cost</p>
          </div>
          <div>
            <p className="text-sm text-blue-600">401(k) Balance</p>
            <p className="text-xl font-bold text-blue-700">{formatCurrency(benefitsData.retirement.currentBalance)}</p>
            <p className="text-xs text-blue-600">Current balance</p>
          </div>
        </div>
      </div>

      {/* Benefits Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-lg font-bold text-green-600">{benefits.length}</p>
          <p className="text-xs text-green-600">Active Benefits</p>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-lg font-bold text-blue-600">100%</p>
          <p className="text-xs text-blue-600">Coverage</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-lg font-bold text-purple-600">{benefitsData.paidTimeOff.vacation.remaining}</p>
          <p className="text-xs text-purple-600">PTO Hours</p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <p className="text-lg font-bold text-orange-600">95%</p>
          <p className="text-xs text-orange-600">Wellness Score</p>
        </div>
      </div>

      {/* Benefits List */}
      <div className="space-y-3">
        {benefits.map((benefit) => {
          const IconComponent = benefit.icon;
          return (
            <div key={benefit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor(benefit.color)}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{benefit.name}</h3>
                    <p className="text-sm text-gray-600">{benefit.plan} • {benefit.coverage}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      {benefit.monthlyContribution && (
                        <span>Monthly: {formatCurrency(benefit.monthlyContribution)}</span>
                      )}
                      {benefit.currentBalance && (
                        <span>Balance: {formatCurrency(benefit.currentBalance)}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(benefit.status)}`}>
                    {benefit.status}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Open Enrollment Notice */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Open Enrollment Period</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Annual benefits enrollment opens October 1, 2025. Review and update your benefit selections.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Resources */}
      <div className="mt-4 text-center">
        <button 
          onClick={() => navigate('/benefits')}
          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
        >
          View All Benefits & Resources →
        </button>
      </div>
    </div>
  );
};

export default BenefitsSection;