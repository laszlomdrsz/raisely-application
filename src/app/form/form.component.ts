import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  submittedStatus = '';
  submitLoading = false;
  submitErrorMessage = '';

  applicationData: any;

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void {
    this.applicationData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };
    this.submittedStatus = '';
    this.submitErrorMessage = '';
  }

  submitForm(form): void {
    if (!form.form.valid) { return; }
    this.submitLoading = true;
    const body = {
      campaignUuid: '46aa3270-d2ee-11ea-a9f0-e9a68ccff42a',
      data: this.applicationData
    };
    this.http.post<any>('https://api.raisely.com/v3/signup', body).subscribe(
        result => {
          this.submitLoading = false;
          this.submittedStatus = 'SUCCESS';
        }, error => {
          this.submitLoading = false;
          this.submitErrorMessage = error.error.errors[0].message;
          this.submittedStatus = 'FAIL';
      });
  }

  getErrorText(control, patternType?): string {
    if (!control || !control.errors) { return ''; }
    if (control.errors.required) { return 'This field is required'; }
    if (control.errors.emailTaken) { return 'This email address is already taken. Please choose a different one!'; }
    if (control.errors.emailTakenConnectionError) { return 'We had a connection error and could not validate your email address. Please try again a bit later!'; }
    if (control.errors.minlength) { return `This field needs to be at least ${control.errors.minlength.requiredLength} characters long`; }
    if (control.errors.pattern && patternType === 'email') { return 'This field needs to be a valid email address'; }
    if (control.errors.pattern && patternType === 'password') {
      return 'Please use at least one number, one lowercase and one uppercase letter';
    }
  }

}
