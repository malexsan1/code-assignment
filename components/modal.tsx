import React from 'react';

import styles from '../styles/modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose(): void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return isOpen ? <div className={styles.modal}>{children}</div> : null;
}
