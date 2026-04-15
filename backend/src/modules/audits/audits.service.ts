import { prisma } from '../../lib/prisma';
import { HttpError } from '../../middleware/error-handler';
import { ResourceService } from '../_shared/resource.service';
import type { z } from 'zod';
import { createSchema, updateSchema } from './audits.validation';

export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;

export class AuditsService extends ResourceService<CreateInput, UpdateInput> {
  constructor() {
    super('audit');
  }

  async duplicateAudit(id: string) {
    const source = await prisma.audit.findUnique({
      where: { id },
      include: {
        workflows: true,
        taskBreakdowns: true,
        painPoints: true,
        dataReadiness: true,
        scoring: true,
        recommendations: true,
        reportSections: true,
      },
    });

    if (!source) throw new HttpError(404, 'Audit not found');

    const duplicated = await prisma.audit.create({
      data: {
        name: `${source.name} (Copy)`,
        description: source.description,
        departmentId: source.departmentId,
        workflowId: source.workflowId,
        status: 'draft',
      },
    });

    return duplicated;
  }

  async opportunitiesCsv(auditId: string) {
    const opportunities = await (prisma as any).opportunity.findMany({
      where: { auditId },
      orderBy: { createdAt: 'asc' },
    });

    const headers = ['id', 'title', 'description', 'impact', 'effort', 'owner', 'status'];
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

    const rows = opportunities.map((opportunity: any) =>
      [
        opportunity.id,
        opportunity.title,
        opportunity.description,
        opportunity.impact,
        opportunity.effort,
        opportunity.owner,
        opportunity.status,
      ]
        .map(escape)
        .join(','),
    );

    return [headers.join(','), ...rows].join('\n');
  }
}

export const auditsService = new AuditsService();
