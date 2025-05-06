import {UntypedFormControl, Validators} from "@angular/forms";

export const groupLogIn = {
  username: new UntypedFormControl('',
    Validators.required),
  password: new UntypedFormControl('',
    [Validators.required, Validators.minLength(6)]),
};
