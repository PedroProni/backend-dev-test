import { Router } from 'express';
import { index, create, show, update, remove } from '@application/controllers/user.controller';

const router = Router();

router.get('/', index);
router.post('/', create);
router.get('/:id', show);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;