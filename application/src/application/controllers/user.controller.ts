import { Request, Response } from 'express';
import { UserService } from '@application/services/user.service';
import { UserRepository } from '@domain/repositories/user.repository';
import jsonwebtoken from 'jsonwebtoken';

const userService = new UserService(new UserRepository());

const index = async (req: Request, res: Response) => {
  try {
    const users = await userService.index();
    res.json(users);
  } catch (e) {
    handleErrors(e, res);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user = await userService.create(req.body);
    if ('email' in user) {
      const token = jsonwebtoken.sign({ email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
      res.status(201).json({ token });
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (e) {
    handleErrors(e, res);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await userService.login(req.body.email, req.body.password, req.body.token);
    if ('email' in user) {
      const token = jsonwebtoken.sign({ email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json(user);
    }
  }
  catch (e) {
    handleErrors(e, res);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await userService.show(req.params.id);
    res.json(user);
  } catch (e) {
    handleErrors(e, res);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    res.json(user);
  } catch (e) {
    handleErrors(e, res);
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    await userService.remove(req.params.id);
    res.status(200).json({ "message": "User deleted successfully" });
  } catch (e) {
    handleErrors(e, res);
  }
};

function handleErrors(error: any, res: Response) {
  if(error.errorResponse.code === 11000) {
    res.status(404).json({ error: "User Already exists" })
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export { index, create, login, show, update, remove };