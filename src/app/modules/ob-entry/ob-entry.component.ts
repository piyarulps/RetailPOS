import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

import { HelperService } from '../../services/helper.service';
import { Globals } from '../../globals';
import { Router } from '@angular/router';

@Component({
	selector: 'app-ob-entry',
	templateUrl: './ob-entry.component.html',
	styleUrls: ['./ob-entry.component.scss']
})
export class ObEntryComponent implements OnInit {

	@ViewChild('openingBalanceInput') openingBalanceInputField: ElementRef;

	message: string;
	isDisabled: boolean = false;
	isbtnLoaderShow = false;
	myForm: FormGroup;
	submitted: boolean = false;

	constructor(
		public _helper: HelperService,
		private _formBuilder: FormBuilder,
		public _hotkeysService: HotkeysService,
		public _globals: Globals,
		private _router: Router,
	) {
		this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
			this.doManage();
			return false; // Prevent bubbling
		}));
		this.validateForm();
	}

	ignoreFocus(event) {
		// console.log('ignoreFocus event', event);
		event.stopImmediatePropagation();
		event.preventDefault();
	}

	enterAccessCode(enteredDigit: string) {
		let temp = this.f.default_balance.value;
		if (this.f.default_balance.value != null) {
			temp += enteredDigit;
		}
		else {
			temp = enteredDigit;
		}
		this.f.default_balance.setValue(temp);
		// console.log('default_balance.value', this.f.default_balance.value);
	}


	removeAccessCode() {
		this.f.default_balance.setValue(null);
	}

	doManage() {
		if (this.isDisabled) return;
		if (this.myForm.invalid) {
			this.submitted = true;
		}
		else {
			if (this.myForm.controls.default_balance.value == 0) {
				this.submitted = true;
				this._helper.notify({ message: 'Opening balance should be greater than 0.', messageType: 0 });
				return;
			}
			else if (!this._globals.REGEXP_DECIMAL.test(this.myForm.controls.default_balance.value) || this.countDecimals(this.myForm.controls.default_balance.value) > 2) {
				this.submitted = true;
				this.myForm.controls.default_balance.setErrors({ pattern: true });
				return;
			}
			this.submitted = false;
			this.isDisabled = true;
			this._helper.apiPostLocal({ default_balance: this.myForm.controls.default_balance.value }, 'pos-signon').subscribe(
				res => {
					if (res.message) {
						this._helper.notify({ message: res.message, messageType: res.status });
					}
					if (res.status == 1 && res.result) {
						let signOnData: any = res.result;
						localStorage.setItem('signOnData', JSON.stringify(signOnData));
						this._router.navigate(['sale-mode/terminal']);
						// this._dialogRef.close({ status: true });
						setTimeout(() => {
							this.myForm.controls.default_balance.setValue(null);
						}, 500);
					}
					this.isDisabled = false;
					// console.log('res', res);
				},
				error => console.log('error', error)
			);
		}
	}

	countDecimals(value) {
		if (Math.floor(value) === value) return 0;
		return value.toString().split(".")[1].length || 0;
	}

	get f() {
		return this.myForm.controls;
	}

	validateForm() {
		this.myForm = this._formBuilder.group({
			default_balance: [null, [Validators.required]]
		});
	}

	ngOnInit() {
		setTimeout(() => {
			this.openingBalanceInputField.nativeElement.focus();
		}, 500);

		this._helper.setTitle({ section: 'ob-entry', title: `Opening Balance - ${this._globals.APP_NAME}` });
	}

}
