import React from 'react';

const DashboardCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-orange-500 text-orange-600 bg-orange-50',
    green: 'bg-green-500 text-green-600 bg-green-50',
    purple: 'bg-purple-500 text-purple-600 bg-purple-50',
    orange: 'bg-orange-500 text-orange-600 bg-orange-50',
    gray: 'bg-gray-500 text-gray-600 bg-gray-50'
  };

  const [bgColor, textColor, lightBg] = colorClasses[color]?.split(' ') || colorClasses.blue.split(' ');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`h-12 w-12 rounded-lg ${lightBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`h-6 w-6 ${textColor}`} />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">{trend}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;