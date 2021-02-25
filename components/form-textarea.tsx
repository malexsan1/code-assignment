import React from 'react';

import styles from '../styles/form-input.module.scss';

interface FormInputProps extends Partial<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  ref?: React.Ref<any>;
}

const FormTextarea: React.FC<FormInputProps> = React.forwardRef(({ id, label, error }, ref) => {
  return (
    <div className={styles.formInput}>
      <label htmlFor={id}>{label}</label>
      <textarea id={id} name={id} ref={ref} />
      <span>{error}</span>
    </div>
  );
});

export default FormTextarea;
