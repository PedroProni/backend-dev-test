import { Request, Response } from 'express';
import { UserService } from '@application/services/user.service';
import { UserRepository } from '@domain/repositories/user.repository';

const userService = new UserService(new UserRepository());

const index = async (req: Request, res: Response) => {
  try {
    const users = await userService.index();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await userService.show(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const success = await userService.remove(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export { index, create, show, update, remove };