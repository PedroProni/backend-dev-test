import { Router } from 'express';
import { TwoFactorAuthService } from '@application/services/2fa.service';
import { UserRepository } from '@domain/repositories/user.repository';
import authMiddleware from '@application/middleware/auth';

const router = Router();
const twoFactorAuthService = new TwoFactorAuthService(new UserRepository());

router.post('/:id/enable', authMiddleware, async (req, res) => {
  const { id } = req.params; 
  const result = await twoFactorAuthService.enable2FA(id);
  res.json(result);
});

router.post('/:id/verify', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params; 
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ error: 'Token is required' });
      return;
    }
    const result = await twoFactorAuthService.verify2FA(id, token);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/:id/disable', authMiddleware, async (req, res) => {
  const { id } = req.params; 
  const result = await twoFactorAuthService.disable2FA(id);
  res.json(result);
});

export default router;