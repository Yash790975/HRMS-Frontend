import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle } from 'lucide-react';
import {ChevronDown, ChevronUp } from 'lucide-react';
import { validateEmail, validatePhone } from '../../../utils/helpers';

const InvitationForm = ({ onSendInvitation }) => {
  const [formData, setFormData] = useState({
    email: '',
    mobile: ''
  });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validatePhone(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSending(true);
    
    // Simulate API call
    setTimeout(() => {
      onSendInvitation(formData);
      setSending(false);
      setSent(true);
      
      // Reset form
      setFormData({ email: '', mobile: '' });
      
      // Reset sent state after 3 seconds
      setTimeout(() => setSent(false), 3000);
    }, 1000);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Accordion Header */}
      <div 
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={toggleAccordion}
      >
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center mr-3">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Send Invitation</h2>
            <p className="text-gray-600 text-sm">Invite new employees to join your organization</p>
          </div>
        </div>
        
        <div className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </div>

      {/* Accordion Content */}
      <div className={`transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                      errors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                  />
                </div>
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
                )}
              </div>
            </div>

            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending || sent}
                className={`
                  inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 transform
                  ${sent 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 hover:scale-[1.02] shadow-md hover:shadow-lg'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                `}
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : sent ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Invitation Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvitationForm;