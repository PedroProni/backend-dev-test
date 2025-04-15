import { Router } from 'express';
import { index, create, login, show, update, remove } from '@application/controllers/user.controller';
import authMiddleware from '@application/middleware/auth'

const router = Router();

router.get('/', authMiddleware, index);
router.post('/', create);
router.post('/login', login);
router.get('/:id', authMiddleware, show);
router.put('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, remove);

export default router;