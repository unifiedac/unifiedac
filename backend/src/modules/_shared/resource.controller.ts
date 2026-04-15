import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { idParamSchema } from './resource.validation';
import { ResourceService } from './resource.service';

export class ResourceController<TCreate extends object, TUpdate extends object> {
  constructor(
    private readonly service: ResourceService<TCreate, TUpdate>,
    private readonly createSchema: ZodType<TCreate>,
    private readonly updateSchema: ZodType<TUpdate>,
  ) {}

  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.service.list();
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const data = await this.service.getById(id);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = this.createSchema.parse(req.body);
      const data = await this.service.create(payload);
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const payload = this.updateSchema.parse(req.body);
      const data = await this.service.update(id, payload);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = idParamSchema.parse(req.params);
      const data = await this.service.delete(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}
