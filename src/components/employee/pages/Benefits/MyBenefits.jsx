import React, { useState } from 'react';
import { Gift, Heart, Shield, DollarSign, Calendar, Users, Phone, Mail } from 'lucide-react';

const MyBenefits = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock benefits data
  const benefitsData = {
    healthInsurance: {
      plan: 'Premium Health Plan',
      provider: 'BlueCross BlueShield',
      coverage: 'Employee + Family',
      monthlyPremium: 450,
      employerContribution: 350,
      employeeContribution: 100,
      deductible: 1000,
      outOfPocketMax: 5000,
      benefits: [
        'Primary Care: $20 copay',
        'Specialist: $40 copay',
        'Emergency Room: $200 copay',
        'Prescription Drugs: $10/$30/$60',
        'Annual Physical: Covered 100%'
      ]
    },
    dentalInsurance: {
      plan: 'Dental Plus',
      provider: 'Delta Dental',
      coverage: 'Employee + Family',
      monthlyPremium: 85,
      employerContribution: 65,
      employeeContribution: 20,
      benefits: [
        'Preventive Care: Covered 100%',
        'Basic Procedures: 80% coverage',
        'Major Procedures: 50% coverage',
        'Orthodontics: 50% coverage (lifetime max $2,000)'
      ]
    },
    visionInsurance: {
      plan: 'Vision Care',
      provider: 'VSP',
      coverage: 'Employee + Family',
      monthlyPremium: 25,
      employerContribution: 20,
      employeeContribution: 5,
      benefits: [
        'Annual Eye Exam: Covered 100%',
        'Frames: $150 allowance every 2 years',
        'Lenses: Covered 100%',
        'Contact Lenses: $150 allowance annually'
      ]
    },
    retirement: {
      plan: '401(k) Retirement Plan',
      provider: 'Fidelity',
      employeeContribution: 6,
      employerMatch: 4,
      vestingSchedule: 'Immediate',
      currentBalance: 45000,
      yearToDateContributions: 3600,
      employerContributions: 2400
    },
    lifeInsurance: {
      plan: 'Basic Life Insurance',
      provider: 'MetLife',
      coverage: 100000,
      beneficiary: 'Jane Doe (Spouse)',
      monthlyPremium: 15,
      employerContribution: 15,
      employeeContribution: 0
    },
    disability: {
      shortTerm: {
        plan: 'Short-term Disability',
        coverage: '60% of salary',
        waitingPeriod: '7 days',
        maxBenefit: '26 weeks'
      },
      longTerm: {
        plan: 'Long-term Disability',
        coverage: '60% of salary',
        waitingPeriod: '90 days',
        maxBenefit: 'To age 65'
      }
    },
    paidTimeOff: {
      vacation: { accrued: 120, used: 40, remaining: 80 },
      sick: { accrued: 80, used: 16, remaining: 64 },
      personal: { accrued: 24, used: 8, remaining: 16 }
    },
    additionalBenefits: [
      {
        name: 'Employee Assistance Program',
        description: '24/7 counseling and support services',
        provider: 'ComPsych'
      },
      {
        name: 'Flexible Spending Account',
        description: 'Pre-tax dollars for medical expenses',
        currentBalance: 1200
      },
      {
        name: 'Commuter Benefits',
        description: 'Pre-tax transit and parking',
        monthlyAllowance: 150
      },
      {
        name: 'Gym Membership Discount',
        description: '20% off local gym memberships',
        provider: 'Various Partners'
      },
      {
        name: 'Professional Development',
        description: 'Annual learning and development budget',
        annualAllowance: 2000,
        used: 450,
        remaining: 1550
      }
    ]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Benefits</h1>
        <p className="text-gray-600">View and manage your employee benefits</p>
      </div>

      {/* Benefits Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Health Insurance</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(benefitsData.healthInsurance.employeeContribution)}</p>
              <p className="text-xs text-gray-500">Monthly cost</p>
            </div>
            <Heart className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">401(k) Balance</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(benefitsData.retirement.currentBalance)}</p>
              <p className="text-xs text-gray-500">Current balance</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Life Insurance</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(benefitsData.lifeInsurance.coverage)}</p>
              <p className="text-xs text-gray-500">Coverage amount</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">PTO Remaining</p>
              <p className="text-2xl font-bold text-orange-600">{benefitsData.paidTimeOff.vacation.remaining}</p>
              <p className="text-xs text-gray-500">Vacation hours</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {['overview', 'health', 'retirement', 'time-off', 'additional'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Insurance Coverage</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Health Insurance</span>
                      <span className="text-green-600">{formatCurrency(benefitsData.healthInsurance.employeeContribution)}/month</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Dental Insurance</span>
                      <span className="text-green-600">{formatCurrency(benefitsData.dentalInsurance.employeeContribution)}/month</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Vision Insurance</span>
                      <span className="text-green-600">{formatCurrency(benefitsData.visionInsurance.employeeContribution)}/month</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Retirement & Savings</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">401(k) Contribution</span>
                        <span className="text-orange-600">{benefitsData.retirement.employeeContribution}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Employer Match</span>
                        <span className="text-sm text-green-600">{benefitsData.retirement.employerMatch}%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Current Balance</span>
                        <span className="text-green-600">{formatCurrency(benefitsData.retirement.currentBalance)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Health Tab */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Health Insurance */}
                <div className="bg-orange-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Heart className="h-6 w-6 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Health Insurance</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Plan</p>
                      <p className="font-medium">{benefitsData.healthInsurance.plan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Provider</p>
                      <p className="font-medium">{benefitsData.healthInsurance.provider}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Coverage</p>
                      <p className="font-medium">{benefitsData.healthInsurance.coverage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Cost</p>
                      <p className="font-medium">{formatCurrency(benefitsData.healthInsurance.employeeContribution)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {benefitsData.healthInsurance.benefits.map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Dental Insurance */}
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Dental Insurance</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Plan</p>
                      <p className="font-medium">{benefitsData.dentalInsurance.plan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Provider</p>
                      <p className="font-medium">{benefitsData.dentalInsurance.provider}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Cost</p>
                      <p className="font-medium">{formatCurrency(benefitsData.dentalInsurance.employeeContribution)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {benefitsData.dentalInsurance.benefits.map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Vision Insurance */}
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Vision Insurance</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Plan</p>
                      <p className="font-medium">{benefitsData.visionInsurance.plan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Provider</p>
                      <p className="font-medium">{benefitsData.visionInsurance.provider}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Cost</p>
                      <p className="font-medium">{formatCurrency(benefitsData.visionInsurance.employeeContribution)}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-2">Benefits</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {benefitsData.visionInsurance.benefits.map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Retirement Tab */}
          {activeTab === 'retirement' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">401(k) Plan Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan Provider</span>
                      <span className="font-medium">{benefitsData.retirement.provider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee Contribution</span>
                      <span className="font-medium">{benefitsData.retirement.employeeContribution}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employer Match</span>
                      <span className="font-medium text-green-600">{benefitsData.retirement.employerMatch}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vesting Schedule</span>
                      <span className="font-medium">{benefitsData.retirement.vestingSchedule}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Balance</span>
                      <span className="font-bold text-green-600">{formatCurrency(benefitsData.retirement.currentBalance)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">YTD Employee Contributions</span>
                      <span className="font-medium">{formatCurrency(benefitsData.retirement.yearToDateContributions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">YTD Employer Contributions</span>
                      <span className="font-medium text-green-600">{formatCurrency(benefitsData.retirement.employerContributions)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Time Off Tab */}
          {activeTab === 'time-off' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(benefitsData.paidTimeOff).map(([type, data]) => (
                  <div key={type} className="bg-orange-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">{type} Time</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accrued</span>
                        <span className="font-medium">{data.accrued} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Used</span>
                        <span className="font-medium text-red-600">{data.used} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining</span>
                        <span className="font-bold text-green-600">{data.remaining} hours</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${(data.used / data.accrued) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round((data.used / data.accrued) * 100)}% used
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Benefits Tab */}
          {activeTab === 'additional' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefitsData.additionalBenefits.map((benefit, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.name}</h3>
                    <p className="text-gray-600 mb-4">{benefit.description}</p>
                    
                    {benefit.provider && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">Provider: </span>
                        <span className="text-sm font-medium">{benefit.provider}</span>
                      </div>
                    )}
                    
                    {benefit.currentBalance && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">Current Balance: </span>
                        <span className="text-sm font-medium text-green-600">{formatCurrency(benefit.currentBalance)}</span>
                      </div>
                    )}
                    
                    {benefit.monthlyAllowance && (
                      <div className="mb-2">
                        <span className="text-sm text-gray-500">Monthly Allowance: </span>
                        <span className="text-sm font-medium text-orange-600">{formatCurrency(benefit.monthlyAllowance)}</span>
                      </div>
                    )}
                    
                    {benefit.annualAllowance && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Annual Allowance:</span>
                          <span className="text-sm font-medium">{formatCurrency(benefit.annualAllowance)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Used:</span>
                          <span className="text-sm font-medium text-red-600">{formatCurrency(benefit.used)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Remaining:</span>
                          <span className="text-sm font-medium text-green-600">{formatCurrency(benefit.remaining)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: `${(benefit.used / benefit.annualAllowance) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Benefits Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3">
            <Phone className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-gray-900">HR Benefits Hotline</p>
              <p className="text-gray-600">1-800-555-0123</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-gray-900">Benefits Email</p>
              <p className="text-gray-600">benefits@company.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBenefits;