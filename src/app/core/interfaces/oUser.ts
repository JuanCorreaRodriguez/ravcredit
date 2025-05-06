import {eRoles} from "./oGlobal";
import {WritableSignal} from "@angular/core";

export interface iUser {
  pUser: oUser

  getAllUsers(): void

  editUser(user: oUser): void

  deleteUser(user: oUser): void
}

export interface oUser {
  id: string
  username: string,
  name: string,
  password: string,
  role: eRoles,
  lastLogin?: number
  createdAt?: number,
  access_token: string
}

export interface iServiceUser {
  users: WritableSignal<oUser[]>

  getAllUsersServer(): void

  createUser(o: oUser): void

  updateUser(o: oUser): void

  deleteUser(id: string): void
}
