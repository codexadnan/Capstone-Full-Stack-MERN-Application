import { useId } from 'react';

export default function Select({ label, options, error, placeholder, className = '', ...rest }) {
  const id = useId();
  return (
    <div className={`field ${error ? 'field-invalid' : ''} ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <select id={id} aria-invalid={Boolean(error)} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value;
          const text = typeof option === 'string' ? option : option.label;
          return <option key={value} value={value}>{text}</option>;
        })}
      </select>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
