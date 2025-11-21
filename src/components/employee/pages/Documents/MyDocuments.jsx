import React, { useState } from 'react';
import { FileText, Download, Eye, Upload, Search, Filter, Folder, File } from 'lucide-react';

const MyDocuments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Mock documents data
  const documents = [
    {
      id: '1',
      name: 'Employee Handbook 2024',
      type: 'pdf',
      category: 'company-policies',
      size: '2.5 MB',
      uploadDate: '2024-01-01',
      description: 'Complete employee handbook with policies and procedures',
      downloadCount: 45,
      isCompanyDocument: true
    },
    {
      id: '2',
      name: 'My Resume - Updated',
      type: 'pdf',
      category: 'personal',
      size: '1.2 MB',
      uploadDate: '2024-01-15',
      description: 'Updated resume with latest experience',
      downloadCount: 3,
      isCompanyDocument: false
    },
    {
      id: '3',
      name: 'React Certification',
      type: 'pdf',
      category: 'certifications',
      size: '0.8 MB',
      uploadDate: '2024-01-10',
      description: 'React Developer Certification from Meta',
      downloadCount: 1,
      isCompanyDocument: false
    },
    {
      id: '4',
      name: 'Code of Conduct',
      type: 'pdf',
      category: 'company-policies',
      size: '1.1 MB',
      uploadDate: '2024-01-01',
      description: 'Company code of conduct and ethics guidelines',
      downloadCount: 67,
      isCompanyDocument: true
    },
    {
      id: '5',
      name: 'Benefits Guide 2024',
      type: 'pdf',
      category: 'benefits',
      size: '3.2 MB',
      uploadDate: '2024-01-01',
      description: 'Comprehensive guide to employee benefits',
      downloadCount: 89,
      isCompanyDocument: true
    },
    {
      id: '6',
      name: 'Performance Review - Q4 2023',
      type: 'pdf',
      category: 'performance',
      size: '0.5 MB',
      uploadDate: '2024-01-18',
      description: 'Quarterly performance review document',
      downloadCount: 2,
      isCompanyDocument: false
    },
    {
      id: '7',
      name: 'Training Certificate - AWS',
      type: 'pdf',
      category: 'certifications',
      size: '0.7 MB',
      uploadDate: '2024-01-12',
      description: 'AWS Cloud Practitioner Certification',
      downloadCount: 1,
      isCompanyDocument: false
    },
    {
      id: '8',
      name: 'Emergency Procedures',
      type: 'pdf',
      category: 'company-policies',
      size: '1.8 MB',
      uploadDate: '2024-01-01',
      description: 'Office emergency procedures and contact information',
      downloadCount: 34,
      isCompanyDocument: true
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'personal', label: 'Personal Documents' },
    { value: 'company-policies', label: 'Company Policies' },
    { value: 'certifications', label: 'Certifications' },
    { value: 'benefits', label: 'Benefits' },
    { value: 'performance', label: 'Performance' },
    { value: 'training', label: 'Training Materials' }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-8 w-8 text-orange-600" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-8 w-8 text-green-600" />;
      default:
        return <File className="h-8 w-8 text-gray-600" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'personal':
        return 'bg-orange-100 text-orange-800';
      case 'company-policies':
        return 'bg-purple-100 text-purple-800';
      case 'certifications':
        return 'bg-green-100 text-green-800';
      case 'benefits':
        return 'bg-orange-100 text-orange-800';
      case 'performance':
        return 'bg-red-100 text-red-800';
      case 'training':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (document) => {
    // In a real app, this would trigger the actual download
    console.log('Downloading:', document.name);
  };

  const handleView = (document) => {
    // In a real app, this would open the document viewer
    console.log('Viewing:', document.name);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-600">Access your personal and company documents</p>
        </div>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Document Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Personal Docs</p>
              <p className="text-2xl font-bold text-green-600">
                {documents.filter(d => !d.isCompanyDocument).length}
              </p>
            </div>
            <Folder className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Company Docs</p>
              <p className="text-2xl font-bold text-purple-600">
                {documents.filter(d => d.isCompanyDocument).length}
              </p>
            </div>
            <Folder className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Size</p>
              <p className="text-2xl font-bold text-orange-600">
                {(documents.reduce((total, doc) => total + parseFloat(doc.size), 0)).toFixed(1)} MB
              </p>
            </div>
            <FileText className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-600'}`}
              >
                <div className="h-4 w-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-600'}`}
              >
                <div className="h-4 w-4 flex flex-col space-y-0.5">
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                  <div className="bg-current h-0.5 rounded"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getFileIcon(document.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{document.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{document.description}</p>
                  
                  <div className="mt-3 flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(document.category)}`}>
                      {document.category.replace('-', ' ')}
                    </span>
                    {document.isCompanyDocument && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        Company
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3 text-sm text-gray-500">
                    <p>Size: {document.size}</p>
                    <p>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</p>
                    <p>Downloads: {document.downloadCount}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleView(document)}
                    className="text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDownload(document)}
                    className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
                <span className="text-xs text-gray-500 uppercase">{document.type}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(document.type)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{document.name}</div>
                        <div className="text-sm text-gray-500">{document.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(document.category)}`}>
                      {document.category.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {document.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(document.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(document)}
                        className="text-orange-600 hover:text-orange-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(document)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-500">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'No documents available.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyDocuments;