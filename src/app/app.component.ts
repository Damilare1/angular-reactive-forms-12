import { Component, ViewChildren, ElementRef } from "@angular/core";
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from "@angular/forms";

import { Observable, fromEvent, merge } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  userForm: FormGroup;
  status: string;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: [""],
      lastName: [""],
      email: [""],
      address: this.fb.group({
        lineOne: [""],
        lineTwo: [""],
        city: [""],
        state: [""],
        country: [""],
      }),
    });

    this.userForm.valueChanges.subscribe(() => {
      const { dirty, pristine, valid, errors, invalid, value } = this.userForm;
      this.status = JSON.stringify({
        dirty,
        pristine,
        valid,
        errors,
        invalid,
        value,
      });
    });
  }

  onSubmit() {
    let { value } = this.userForm;
    console.log(value);
  }
}
