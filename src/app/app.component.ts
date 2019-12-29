import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { parsePhoneNumberFromString, ParseError, AsYouType } from 'libphonenumber-js';

import { AppService } from './app.component.service';
import { ICountry } from './app.component.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  selectedCountry: any = 'US';
  selectedPhoneNumber: any;
  countries: any[];
	register: FormGroup;

  constructor(private fb: FormBuilder, private appService: AppService){}

  ngOnInit(): void {
    this.fetchCountryList();
    this.initForm();
  }

  private fetchCountryList(): void {
    this.appService.getCountries().subscribe((res: ICountry[]) => {
			this.countries = res;
		}, error => error);
  }

  private initForm(): void{
    this.register = this.fb.group({
			phone: ['', [Validators.required, this._validatePhoneNumberInput.bind(this)]]
		});
  }

  _validatePhoneNumberInput(c: AbstractControl): object {
    let inputValue: string = c.value.toString();
    let phoneNumber: any = parsePhoneNumberFromString(inputValue, this.selectedCountry);
    if(phoneNumber){
      if(phoneNumber.isValid()){
        return null;
      } else {
        return {
          phoneNumber: {
            valid: false
          }
        }
      }
    } else {
      return {
        phoneNumber: {
          valid: false
        }
      }
    }
	}

  resetPhoneNumber(event: any): void {
		this.register.controls['phone'].setValue('');
	}

  formatPhoneNumber(event: any): void {
		let inputValue: any = this.register.controls['phone'].value;
		let phoneNumber: any = parsePhoneNumberFromString(inputValue, this.selectedCountry);
		if(phoneNumber){
			this.selectedPhoneNumber = phoneNumber.number;
			this.register.controls['phone'].setValue(phoneNumber.formatInternational());
		}
	}
}
