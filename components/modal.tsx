import React, { useCallback } from 'react';
import ReactDOM from 'react-dom';

import styles from '../styles/modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose(): void;
  children: React.ReactNode;
}

const ROOT_CLASS = 'modal_root';

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.className.includes(ROOT_CLASS)) {
        return;
      }
      onClose();
    },
    [onClose],
  );

  return isOpen
    ? ReactDOM.createPortal(
        <div onClick={handleClose} className={`${ROOT_CLASS} ${styles.modal}`}>
          {children}
        </div>,
        document.body,
      )
    : null;
}
