import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationModal = ({ isOpen, onClose, type = 'info', title, message }) => {
  if (!isOpen) return null;

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const { icon: Icon, bgColor, iconColor, buttonColor } = config[type];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center`}>
              <Icon size={32} className={iconColor} />
            </div>
          </div>
          
          {title && <h2 className="text-xl font-bold text-gray-800 text-center mb-2">{title}</h2>}
          <p className="text-gray-600 text-center mb-6">{message}</p>
          
          <button
            onClick={onClose}
            className={`w-full px-4 py-2 ${buttonColor} text-white rounded-lg transition-colors font-semibold`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
