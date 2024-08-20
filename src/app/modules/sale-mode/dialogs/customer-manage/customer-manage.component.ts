import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { MatInput } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HelperService } from '../../../../services/helper.service';

@Component({
	selector: 'app-customer-manage',
	templateUrl: './customer-manage.component.html',
	styleUrls: ['./customer-manage.component.scss']
})
export class CustomerManageComponent implements OnInit {

	// @ViewChild(FormGroupDirective) formGroupDirective: FormGroupDirective;
	// addModuleForm: FormGroup;
	// submitted: boolean = false;

	constructor(
		private _formBuilder: FormBuilder,
		private _helper: HelperService,
		public _dialogRef: MatDialogRef<CustomerManageComponent>,
		@Inject(MAT_DIALOG_DATA) public _dialogData: any
	) { }

	ngOnInit() {
	}

}
