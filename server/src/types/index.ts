import { Request } from 'express';
import { IUser } from '../models/User.model';

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown;
}
