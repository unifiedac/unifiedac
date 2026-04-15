import { prisma } from '../../lib/prisma';
import { HttpError } from '../../middleware/error-handler';

export class ResourceService<TCreate extends object, TUpdate extends object> {
  constructor(private readonly modelName: string) {}

  private model() {
    return (prisma as unknown as Record<string, any>)[this.modelName];
  }

  async list() {
    return this.model().findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getById(id: string) {
    const entity = await this.model().findUnique({ where: { id } });
    if (!entity) throw new HttpError(404, `${this.modelName} not found`);
    return entity;
  }

  create(payload: TCreate) {
    return this.model().create({ data: payload });
  }

  async update(id: string, payload: TUpdate) {
    await this.getById(id);
    return this.model().update({ where: { id }, data: payload });
  }

  async delete(id: string) {
    await this.getById(id);
    await this.model().delete({ where: { id } });
    return { ok: true };
  }
}
