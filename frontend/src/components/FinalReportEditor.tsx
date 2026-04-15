import React, { useMemo, useState } from 'react';
import '../styles/final-report.css';

export interface ReportSectionView {
  key: string;
  title: string;
  order: number;
  content: string;
  generated: boolean;
}

interface FinalReportEditorProps {
  auditId: string;
  initialSections: ReportSectionView[];
  onGenerateFromData: () => Promise<ReportSectionView[]>;
  onSave: (sections: ReportSectionView[]) => Promise<void>;
  onPrintFriendly: () => void;
  onDownloadPdf: () => Promise<void>;
}

export function FinalReportEditor({
  auditId,
  initialSections,
  onGenerateFromData,
  onSave,
  onPrintFriendly,
  onDownloadPdf,
}: FinalReportEditorProps) {
  const [sections, setSections] = useState<ReportSectionView[]>(initialSections);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to finalize report.');

  const sortedSections = useMemo(() => [...sections].sort((a, b) => a.order - b.order), [sections]);

  const updateSection = (key: string, content: string) => {
    setSections((previous) =>
      previous.map((section) =>
        section.key === key
          ? {
              ...section,
              content,
              generated: false,
            }
          : section,
      ),
    );
  };

  const runAction = async (action: string, fn: () => Promise<void>) => {
    setBusyAction(action);
    try {
      await fn();
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <article className="final-report-shell">
      <header className="report-header">
        <div>
          <p className="report-kicker">Final Report Editor</p>
          <h1>Advisory Narrative — Audit {auditId}</h1>
          <p className="report-subtitle">
            Curate a polished, consulting-style report with section-by-section narrative editing.
          </p>
        </div>
        <div className="report-actions">
          <button
            type="button"
            disabled={busyAction !== null}
            onClick={() =>
              runAction('generate', async () => {
                const generated = await onGenerateFromData();
                setSections(generated);
                setStatusMessage('Draft regenerated from latest audit data.');
              })
            }
          >
            {busyAction === 'generate' ? 'Generating…' : 'Generate from data'}
          </button>
          <button
            type="button"
            disabled={busyAction !== null}
            onClick={() =>
              runAction('save', async () => {
                await onSave(sections);
                setStatusMessage('Saved all report narratives.');
              })
            }
          >
            {busyAction === 'save' ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            className="ghost"
            disabled={busyAction !== null}
            onClick={() => {
              onPrintFriendly();
              setStatusMessage('Opened print-friendly preview in a new tab.');
            }}
          >
            Print-friendly
          </button>
          <button
            type="button"
            className="ghost"
            disabled={busyAction !== null}
            onClick={() =>
              runAction('pdf', async () => {
                await onDownloadPdf();
                setStatusMessage('PDF download started.');
              })
            }
          >
            {busyAction === 'pdf' ? 'Preparing PDF…' : 'Download PDF'}
          </button>
        </div>
      </header>

      <p className="report-status" aria-live="polite">
        {statusMessage}
      </p>

      <section className="report-grid">
        {sortedSections.map((section) => (
          <section className="report-card" key={section.key}>
            <div className="report-card-header">
              <h2>{section.title}</h2>
              <span className={section.generated ? 'badge generated' : 'badge custom'}>
                {section.generated ? 'Generated default' : 'Edited'}
              </span>
            </div>
            <textarea
              value={section.content}
              onChange={(event) => updateSection(section.key, event.target.value)}
              rows={9}
            />
          </section>
        ))}
      </section>
    </article>
  );
}
