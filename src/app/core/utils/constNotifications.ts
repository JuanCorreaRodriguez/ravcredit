import {UntypedFormControl, Validators} from "@angular/forms";
import {eRoles} from "../interfaces/oGlobal";

export const groupNotificationsForm = {
  username: new UntypedFormControl('', Validators.required),
  password: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
  pass_con: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
  role: new UntypedFormControl(eRoles.Consultant, Validators.required),
};

