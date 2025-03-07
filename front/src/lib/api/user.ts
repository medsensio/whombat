import { AxiosInstance } from "axios";

import * as schemas from "@/lib/schemas";
import type * as types from "@/lib/types";

import { GetMany, Page, downloadContent } from "./common";

const DEFAULT_ENDPOINTS = {
  get: "/api/v1/users/detail/",
  getMany: "/api/v1/users/",
  create: "api/v1/users/",
  delete: "api/v1/users/delete/",
  me: "/api/v1/users/me",
  update: "/api/v1/users/me",
  first: "/api/v1/users/first/",
};

export function registerUserAPI(
  instance: AxiosInstance,
  endpoints: typeof DEFAULT_ENDPOINTS = DEFAULT_ENDPOINTS,
) {
  async function get(id: string): Promise<types.User> {
    const { data } = await instance.get(endpoints.get, {
      params: { user_id: id },
    });
    return schemas.UserSchema.parse(data);
  }

  async function getMany(
    query: types.GetMany & types.UserFilter,
  ): Promise<types.Page<types.User>> {
    const params = GetMany(schemas.UserFilterSchema).parse(query);
    const { data } = await instance.get(endpoints.getMany, { params });
    return Page(schemas.UserSchema).parse(data);
  }

  async function create(data: types.UserCreate): Promise<types.User> {
    const body = schemas.UserCreateSchema.parse(data);
    const { data: res } = await instance.post(endpoints.create, body);
    return schemas.UserSchema.parse(res);
  }

  async function deleteUser(user: types.User): Promise<types.User> {
    const { data } = await instance.delete(endpoints.delete, {
      params: { user_id: user.id },
    });
    return schemas.UserSchema.parse(data);
  }

  async function getActiveUser(): Promise<types.User> {
    let response = await instance.get(endpoints.me);
    return schemas.UserSchema.parse(response.data);
  }

  async function updateActiveUser(data: types.UserUpdate): Promise<types.User> {
    let body = schemas.UserUpdateSchema.parse(data);
    let response = await instance.patch(endpoints.update, body);
    return schemas.UserSchema.parse(response.data);
  }

  async function createFirstUser(data: types.UserCreate): Promise<types.User> {
    let body = schemas.UserCreateSchema.parse(data);
    let response = await instance.post(endpoints.first, body);
    return schemas.UserSchema.parse(response.data);
  }

  return {
    get,
    getMany,
    create,
    delete: deleteUser,
    me: getActiveUser,
    update: updateActiveUser,
    first: createFirstUser,
  } as const;
}
