// src/components/Modal.jsx

import React from 'react';
import styles from './modal.module.css';

function Modal({ isOpen, onClose, children }) {
  // If the modal is not open, render nothing.
  if (!isOpen) {
    return null;
  }

  // Stop click events inside the modal from closing it
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // The dark, semi-transparent overlay that covers the page
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* The main content container of the modal */}
      <div className={styles.modalContent} onClick={handleContentClick}>
        {/* The close button in the top-right corner */}
        <button className={styles.closeButton} onClick={onClose}>
          &times; {/* This is the 'X' symbol */}
        </button>
        {/* The actual content (e.g., the AddRun form) goes here */}
        {children}
      </div>
    </div>
  );
}

export default Modal;