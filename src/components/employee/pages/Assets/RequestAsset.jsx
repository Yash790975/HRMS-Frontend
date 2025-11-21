import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, FileText, Save, DollarSign, Package } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const RequestAsset = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedValue: '',
    category: 'laptop',
    justification: '',
    urgency: 'medium',
    expectedUsageDuration: '',
    alternativeConsidered: '',
    documents: []
  }); 

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'laptop', label: 'Laptop' },
    { value: 'mobile-sim-card', label: 'Mobile & SIM Card' },
    { value: 'security-card', label: 'Security Card/SEZ Pass' },
    { value: 'drawer-keys', label: 'Drawer Keys' },
    { value: 'library-books', label: 'Library Books' },
    { value: 'mouse', label: 'Mouse' },
    { value: 'headphone', label: 'Headphone' },
    { value: 'vehicle-transportation', label: 'Vehicle/Transportation Facility' },
    { value: 'other', label: 'Other Asset' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Can wait 2-4 weeks' },
    { value: 'medium', label: 'Medium - Needed within 1-2 weeks' },
    { value: 'high', label: 'High - Needed within 1 week' },
    { value: 'urgent', label: 'Urgent - Needed immediately' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file,
      url: URL.createObjectURL(file)
    }));
    
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }));
  };

  const removeDocument = (documentId) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Asset title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.estimatedValue || parseFloat(formData.estimatedValue) <= 0) {
      newErrors.estimatedValue = 'Valid estimated value is required';
    }
    if (!formData.justification.trim()) newErrors.justification = 'Business justification is required';
    if (!formData.expectedUsageDuration.trim()) {
      newErrors.expectedUsageDuration = 'Expected usage duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real app, you would upload files and submit the asset request
      const assetRequest = {
        ...formData,
        id: Date.now().toString(),
        status: 'pending',
        requestDate: new Date().toISOString().split('T')[0],
        assetTag: `PENDING-${Date.now()}`,
        serialNumber: 'TBD'
      };

      addNotification({
        title: 'Asset Request Submitted',
        message: `Your asset request "${formData.title}" has been submitted for approval.`,
        type: 'success'
      });

      navigate('/assets');
    } catch (error) {
      addNotification({
        title: 'Request Failed',
        message: 'There was an error submitting your asset request. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-orange-600';
      case 'urgent':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate('/assets')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Request Asset</h1>
            <p className="text-gray-600">Submit a new asset request</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Asset Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., MacBook Pro 16-inch for development work"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Provide detailed description of the asset and its specifications"
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category and Estimated Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Value (₹) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={formData.estimatedValue}
                  onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                  placeholder="50000"
                  min="0"
                  step="1"
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.estimatedValue ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.estimatedValue && (
                <p className="text-red-600 text-sm mt-1">{errors.estimatedValue}</p>
              )}
            </div>
          </div>

          {/* Business Justification */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Justification *
            </label>
            <textarea
              value={formData.justification}
              onChange={(e) => handleInputChange('justification', e.target.value)}
              placeholder="Explain why this asset is needed and how it will benefit the organization"
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.justification ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.justification && (
              <p className="text-red-600 text-sm mt-1">{errors.justification}</p>
            )}
          </div>

          {/* Urgency and Expected Usage Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {urgencyLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              <div className="mt-1">
                <span className={`text-sm font-medium ${getUrgencyColor(formData.urgency)}`}>
                  Priority: {urgencyLevels.find(level => level.value === formData.urgency)?.label.split(' - ')[0]}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Usage Duration *
              </label>
              <input
                type="text"
                value={formData.expectedUsageDuration}
                onChange={(e) => handleInputChange('expectedUsageDuration', e.target.value)}
                placeholder="e.g., 3 years, 6 months, project duration"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.expectedUsageDuration ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.expectedUsageDuration && (
                <p className="text-red-600 text-sm mt-1">{errors.expectedUsageDuration}</p>
              )}
            </div>
          </div>

          {/* Alternative Considered */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alternatives Considered
            </label>
            <textarea
              value={formData.alternativeConsidered}
              onChange={(e) => handleInputChange('alternativeConsidered', e.target.value)}
              placeholder="Describe any alternatives you considered and why this option is preferred"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting Documents
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, DOC, DOCX, JPG, PNG, TXT up to 10MB each
                </p>
              </label>
            </div>

            {formData.documents.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/assets')}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (    
                <>
                  <Save className="h-4 w-4" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestAsset;