import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Injectable({
	providedIn: 'root'
})
export class ValidationService {
	pattern_isDecimal: any = /^(\d+)?([.]\d{0,9})?$/;
	pattern_integer: any = /^[0-9]{1,20}$/;
	constructor() { }

	DateValidation(startdate: string, enddate: string) {
		return (formGroup: FormGroup) => {
			const start_date_control = formGroup.controls[startdate];
			const end_date_control = formGroup.controls[enddate];
			if (start_date_control.value != null && start_date_control.value != '' && end_date_control.value != null && end_date_control.value != '') {
				if (new Date(start_date_control.value) > new Date(end_date_control.value)) {
					start_date_control.setErrors({ isInvalid: true });
				} else {
					start_date_control.setErrors(null);
				}
			}
		}
	}

	CostValidation(firstprice: string, secondprice: string) {
		return (formGroup: FormGroup) => {
			const firstprice_control = formGroup.controls[firstprice];
			const secondprice_control = formGroup.controls[secondprice];
			if (firstprice_control.value != null && firstprice_control.value != '' && secondprice_control.value != null && secondprice_control.value != '') {
				if (this.isDecimal(firstprice_control.value) && this.isDecimal(firstprice_control.value)) {
					if (parseFloat(firstprice_control.value) < parseFloat(secondprice_control.value)) {
						firstprice_control.setErrors({ isInvalid: true });
					} else {
						firstprice_control.setErrors(null);
					}
				}
			}
		}
	}

	CompareValidation(firstprice: string, secondprice: string) {
		return (formGroup: FormGroup) => {
			const firstprice_control = formGroup.controls[firstprice];
			const secondprice_control = formGroup.controls[secondprice];
			if (firstprice_control.value != null && firstprice_control.value != '' && secondprice_control.value != null && secondprice_control.value != '') {
				if (this.isNumber(firstprice_control.value) && this.isNumber(firstprice_control.value)) {
					if (parseInt(firstprice_control.value) < parseInt(secondprice_control.value)) {
						firstprice_control.setErrors({ isInvalid: true });
					} else {
						firstprice_control.setErrors(null);
					}
				}
			}
		}
	}

	isDecimal(number) {
		number = number.toString();
		if (number.match(this.pattern_isDecimal)) {
			return true;
		}
		return false;
	}

	isNumber(number) {
		number = number.toString();
		if (number.match(this.pattern_integer)) {
			return true;
		}
		return false;
	}
}

