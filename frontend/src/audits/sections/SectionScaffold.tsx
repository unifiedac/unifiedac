import { PropsWithChildren } from 'react';

export function SectionScaffold({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <section style={{ display: 'grid', gap: 12 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      {children}
    </section>
  );
}
