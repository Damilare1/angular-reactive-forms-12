import {
  Component,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  Validators,
} from '@angular/forms';

import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChildren(FormControlName, { read: ElementRef }) formControls: ElementRef[];
  formObj: {};
  userForm: FormGroup;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: {
    [key: string]: { [key: string]: string | { [key: string]: string } };
  };
  constructor(private fb: FormBuilder) {
    this.validationMessages = {
      firstName: {
        required: "Please enter your first name"
      },
      lastName: {
        required: "Please enter your first name"
      },
      email: {
        required: "Please enter your first name",
        email: "Please enter a valid email password"
      },
      lineOne: {
        required: "Please enter your first name",
      },
      lineTwo: {
        required: "Please enter your first name",
      },
      city: {
        required: "Please enter your first name",
      },
      state: {
        required: "Please enter your first name",
      },
      country: {
        required: "Please enter your first name",
      }
    };
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      address: this.fb.group({
        lineOne: ['', [Validators.required]],
        lineTwo: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required, Validators.email]],
        country: ['', [Validators.required]],
      }),
    });
  }

  ngAfterViewInit(): void {
    const addBlurs: Observable<
      any
    >[] = this.formControls.map((formControl: ElementRef) =>
      fromEvent(formControl.nativeElement, 'blur')
    );
    merge(this.userForm.valueChanges, ...addBlurs)
      .pipe(debounceTime(800))
      .subscribe((value) => {
        this.displayMessage = this.invalidItems(
          this.userForm
        );
      });
  }

  invalidItems(container: FormGroup): { [key: string]: string } {
    const messages = {};
    for (const controlKey in container.controls) {
        const c = container.controls[controlKey];
        if (c instanceof FormGroup) {
          const childMessages = this.invalidItems(c);
          Object.assign(messages, childMessages);
        } else {
          if (this.validationMessages[controlKey]) {
            messages[controlKey] = '';
            if ((c.dirty || c.touched) && c.errors) {
              Object.keys(c.errors).map(messageKey => {
                if (this.validationMessages[controlKey][messageKey]) {
                  messages[controlKey] += this.validationMessages[controlKey][messageKey] + ' ';
                }
              });
          }
        }
      }
    }
    return messages;
  }


  onSubmit() {
    let { formObj } = this;
    let { value } = this.userForm;
    const sth = JSON.stringify({ ...formObj, business: value });
    try {
      localStorage.setItem('form', sth);
    } catch {
      (e) => console.log(e);
    }
  }

}
