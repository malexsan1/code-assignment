import React from 'react';

import styles from '../styles/form-input.module.scss';

interface FormInputProps extends Partial<HTMLInputElement> {
  id: string;
  label: string;
  ref?: React.Ref<any>;
}

const FormInput: React.FC<FormInputProps> = React.forwardRef(({ id, label, type }, ref) => {
  return (
    <div className={styles.formInput}>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={id} ref={ref} type={type} />
    </div>
  );
});

export default FormInput;
