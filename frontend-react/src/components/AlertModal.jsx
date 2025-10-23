import React from 'react';
import Modal from './Modal';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import './AlertModal.css';

const AlertModal = ({ 
  isOpen, 
  onClose, 
  type = 'success', 
  title, 
  message,
  autoClose = false,
  autoCloseDuration = 3000 
}) => {
  // Auto close functionality
  React.useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDuration, onClose]);

  // Get icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="alert-modal-icon success" />;
      case 'error':
        return <FaTimesCircle className="alert-modal-icon error" />;
      case 'warning':
        return <FaExclamationCircle className="alert-modal-icon warning" />;
      case 'info':
        return <FaInfoCircle className="alert-modal-icon info" />;
      default:
        return <FaCheckCircle className="alert-modal-icon success" />;
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title}
      maxWidth="440px"
      showCloseButton={true}
    >
      <div className={`alert-modal-content ${type}`}>
        <div className="alert-modal-icon-wrapper">
          {getIcon()}
        </div>
        <p className="alert-modal-message">{message}</p>
      </div>
    </Modal>
  );
};

export default AlertModal;
