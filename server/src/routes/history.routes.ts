import { Router } from 'express';
import { getHistory } from '../controllers/history.controller';

export const historyRouter = Router();

// Public route: no auth required
historyRouter.get('/', getHistory);
