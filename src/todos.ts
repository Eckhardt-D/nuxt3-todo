import Joi from "joi";
import { Todo } from "@prisma/client";
import { v4 as uuid } from "uuid";
import { connect } from "../database";
import { UserModel } from "./users";

export const TodoModel = connect().todo;

export interface TodosListByUserIdOptions {
  id: string;
}

const todosListByUserIdOptionsSchema = Joi.object({
  id: Joi.string().required(),
}).required();

export interface TodosAddOptions {
  userId: string;
  label: string;
}

const todosAddOptionsSchema = Joi.object({
  userId: Joi.string().required(),
  label: Joi.string().max(255).required(),
}).required();

export interface TodosDeleteByIdOptions {
  id: string;
}

const todosDeleteByIdOptionsSchema = Joi.object({
  id: Joi.string().required(),
}).required();

export interface TodosUpdateByIdOptions {
  id: string;
  label?: string;
  done?: boolean;
}

const todosUpdateByIdOptionsSchema = Joi.object({
  id: Joi.string().required(),
  label: Joi.string().max(255).optional(),
  done: Joi.bool().optional(),
}).required();

export class Todos {
  async listByUserId(options: TodosListByUserIdOptions) {
    const params = (await todosListByUserIdOptionsSchema.validateAsync(
      options
    )) as TodosListByUserIdOptions;

    const items = await UserModel.findFirst({
      where: { id: params.id },
    }).todos();

    if (items === null) {
      return undefined;
    }

    return items;
  }

  async add(options: TodosAddOptions): Promise<Todo | undefined> {
    const params = (await todosAddOptionsSchema.validateAsync(
      options
    )) as TodosAddOptions;

    const user = await UserModel.findFirst({ where: { id: params.userId } });

    if (user === null) {
      return undefined;
    }

    return await TodoModel.create({
      data: {
        id: uuid(),
        label: params.label,
        ownerId: params.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async deleteById(options: TodosDeleteByIdOptions): Promise<boolean> {
    const params = (await todosDeleteByIdOptionsSchema.validateAsync(
      options
    )) as TodosDeleteByIdOptions;

    try {
      await TodoModel.delete({ where: { id: params.id } });
      return true;
    } catch (_) {
      return false;
    }
  }

  async updateById(options: TodosUpdateByIdOptions): Promise<Todo> {
    const params = (await todosUpdateByIdOptionsSchema.validateAsync(
      options
    )) as TodosUpdateByIdOptions;

    let data: any = {};

    if (params.done) {
      data.done = params.done;
    }

    if (params.label) {
      data.label = params.label;
    }

    return await TodoModel.update({ where: { id: params.id }, data });
  }
}
