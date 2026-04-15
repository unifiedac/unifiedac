import { TextareaHTMLAttributes } from 'react';

interface TextareaBlockProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextareaBlock({ label, id, ...props }: TextareaBlockProps) {
  return (
    <label htmlFor={id} style={{ display: 'grid', gap: 6, marginBottom: 16 }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      <textarea id={id} {...props} style={{ minHeight: 110, padding: 8, borderRadius: 6, border: '1px solid #ccc' }} />
    </label>
  );
}
