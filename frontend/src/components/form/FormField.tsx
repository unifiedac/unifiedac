import { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
}

export function FormField({ label, helperText, id, ...props }: FormFieldProps) {
  return (
    <label htmlFor={id} style={{ display: 'grid', gap: 6, marginBottom: 12 }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <input id={id} {...props} style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
      {helperText ? <small style={{ color: '#666' }}>{helperText}</small> : null}
    </label>
  );
}
