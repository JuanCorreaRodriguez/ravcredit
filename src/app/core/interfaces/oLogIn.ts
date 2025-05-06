import {WritableSignal} from "@angular/core";

export enum eAuthActions {
  delete = "delete",
  auth = "auth"
}

export enum eAuthType {
  auth = "auth",
  login = "login",
  idle = ""
}

export interface iAuthConfig {
  title: string;
  desc: string;
  data: boolean;
}

export const cAuthConfig: iAuthConfig = {
  title: "",
  desc: "",
  data: true,
}

export interface iLogIn {
  username: WritableSignal<string>
  password: WritableSignal<string>

  login(credentials: oAuth, destination: string): Promise<void>

  success(): void
}

export interface oAuth {
  username: string,
  password: string
}

export interface oAuthRes {
  status: number
  data: {}
}
