import {eRoles} from "../interfaces/oGlobal";
import {oUser} from "../interfaces/oUser";
import {UntypedFormControl, Validators} from "@angular/forms";

export const cUser: oUser = {
  name: "",
  id: "",
  username: "",
  password: "",
  access_token: "",
  role: eRoles.Consultant
}

export class BuilderUserForm {
  public static UserForm(user: oUser) {
    let role = eRoles.Consultant
    if (user.role) role = user.role
    const form = {
      id: new UntypedFormControl(user.id),
      name: new UntypedFormControl(user.name, Validators.required),
      username: new UntypedFormControl(user.username, Validators.required),
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
      pass_con: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
      role: new UntypedFormControl(role, Validators.required),
    }
    return form
  }

  public static UserEditedFactory(user: oUser) {
    const o: Partial<oUser> = {}

    if (user.name != "") o["name"] = user.name
    if (user.username != "") o["username"] = user.username
    if (user.role) o["role"] = user.role

    o["id"] = user.id

    return o
  }

  public static UserCreateFactory(user: oUser) {
    const o: Partial<oUser> = {}

    if (user.name != "") o["name"] = user.name
    if (user.username != "") o["username"] = user.username
    if (user.role) o["role"] = user.role
    if (user.password) o["password"] = user.password

    o["id"] = user.id

    return o
  }
}
