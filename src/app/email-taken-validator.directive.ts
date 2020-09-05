import { Directive } from '@angular/core';
import { AsyncValidator, AbstractControl, ValidationErrors, NG_ASYNC_VALIDATORS } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Directive({
  selector: '[appEmailTakenValidator]',
  providers: [
      { provide: NG_ASYNC_VALIDATORS, useExisting: EmailTakenValidatorDirective, multi: true },
  ]
})
export class EmailTakenValidatorDirective implements AsyncValidator {

  constructor(
    private http: HttpClient,
  ) { }

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const body = {
      campaignUuid: '46aa3270-d2ee-11ea-a9f0-e9a68ccff42a',
      data: {
          email: ctrl.value
      }
    };
    return new Promise((resolve) => {
      this.http.post<any>('https://api.raisely.com/v3/check-user', body).subscribe(
        result => {
          if (result.data.status === 'OK') {
            resolve(null);
          } else {
            resolve({emailTaken: true});
          }
        }, error => {
          resolve({emailTakenConnectionError: true});
      });
    });
  }

}
