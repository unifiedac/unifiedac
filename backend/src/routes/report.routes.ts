import { Router } from 'express';
import { chromium } from 'playwright';
import { reportService } from '../services/report.service';
import { AuditRecommendation, ReportSectionKey, SavedAuditData } from '../types/report';

interface GenerateBody {
  auditData: SavedAuditData;
  recommendations: AuditRecommendation[];
}

interface SectionUpdateBody {
  content: string;
}

const router = Router();

router.post('/audits/:auditId/report/generate', (req, res) => {
  const { auditId } = req.params;
  const { auditData, recommendations } = req.body as GenerateBody;

  if (!auditData || !recommendations) {
    res.status(400).json({ message: 'auditData and recommendations are required' });
    return;
  }

  const report = reportService.generateFromAudit(auditId, auditData, recommendations);
  res.status(201).json(report);
});

router.get('/audits/:auditId/report', (req, res) => {
  const report = reportService.getReport(req.params.auditId);

  if (!report) {
    res.status(404).json({ message: 'Report not found' });
    return;
  }

  res.json(report);
});

router.get('/audits/:auditId/report/sections', (req, res) => {
  res.json(reportService.listSections(req.params.auditId));
});

router.patch('/audits/:auditId/report/sections/:sectionKey', (req, res) => {
  const { auditId, sectionKey } = req.params;
  const { content } = req.body as SectionUpdateBody;

  if (typeof content !== 'string') {
    res.status(400).json({ message: 'content must be a string' });
    return;
  }

  const section = reportService.upsertSection(auditId, sectionKey as ReportSectionKey, content);

  if (!section) {
    res.status(404).json({ message: 'Section not found for report' });
    return;
  }

  res.json(section);
});

router.post('/audits/:auditId/report/sections/:sectionKey/reset', (req, res) => {
  const { auditId, sectionKey } = req.params;
  const { auditData, recommendations } = req.body as GenerateBody;

  if (!auditData || !recommendations) {
    res.status(400).json({ message: 'auditData and recommendations are required' });
    return;
  }

  const section = reportService.resetSectionToGenerated(
    auditId,
    sectionKey as ReportSectionKey,
    auditData,
    recommendations,
  );

  if (!section) {
    res.status(404).json({ message: 'Section not found for report' });
    return;
  }

  res.json(section);
});

router.get('/audits/:auditId/report/export/print', (req, res) => {
  const report = reportService.getReport(req.params.auditId);

  if (!report) {
    res.status(404).json({ message: 'Report not found' });
    return;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(reportService.toPrintHtml(report));
});

router.get('/audits/:auditId/report/export/pdf', async (req, res) => {
  const report = reportService.getReport(req.params.auditId);

  if (!report) {
    res.status(404).json({ message: 'Report not found' });
    return;
  }

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.setContent(reportService.toPrintHtml(report), { waitUntil: 'domcontentloaded' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '16mm', right: '14mm', bottom: '16mm', left: '14mm' },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.auditId}-final-report.pdf"`);
    res.send(pdf);
  } finally {
    await browser.close();
  }
});

export default router;
