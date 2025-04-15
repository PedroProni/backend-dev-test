import { Request, Response } from 'express';
import { UserService } from '@application/services/user.service';
import { UserRepository } from '@domain/repositories/user.repository';
import { IUser } from '@domain/entities/user.entity';

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
    res.status(201).json(user);
  } catch (e) {
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

export { index, create, show, update, remove };