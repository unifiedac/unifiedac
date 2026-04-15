import { prisma } from '../../lib/prisma';
import { ResourceService } from '../_shared/resource.service';
import type { z } from 'zod';
import { createSchema, updateSchema } from './exports.validation';

export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;

class ExportsService extends ResourceService<CreateInput, UpdateInput> {
  constructor() {
    super('export');
  }

  async opportunitiesCsv(auditId?: string) {
    const opportunities = await (prisma as any).opportunity.findMany({
      where: auditId ? { auditId } : undefined,
      orderBy: [{ auditId: 'asc' }, { createdAt: 'asc' }],
    });

    const headers = ['id', 'auditId', 'title', 'description', 'impact', 'effort', 'owner', 'status'];
    const escape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`;

    const rows = opportunities.map((opportunity: any) =>
      [
        opportunity.id,
        opportunity.auditId,
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

export const exportsService = new ExportsService();
