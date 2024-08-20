import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
// import { MatSnackBar } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

import { HelperService } from '../../../../services/helper.service';
import { ValidationService } from '../../../../services/validation/validation.service';
// import { ConnectionService } from 'ng-connection-service';
// import { MatInput } from '@angular/material/input';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface PageData {
	_editData: {
		data: []
	}
}

@Component({
	selector: 'app-item-inventory-manage',
	templateUrl: './item-inventory-manage.component.html',
	styleUrls: ['./item-inventory-manage.component.scss']
})
export class ItemInventoryManageComponent implements OnInit {

	moduleName: string = '';
	displayModuleName: string = 'Inventory';
	moduleAPI: string = '';
	moduleLink: string = '';
	myForm: FormGroup;
	submitted: boolean = false;
	message: string;
	editData: any = [];
	backupEditData: any = [];
	dialogTitle: string = "Inventory";
	isDisabled: boolean = false;
	btnCreateTxt: string = "Save";
	btnUpdateTxt: string = "Update";
	isSelectBox: boolean = false;
	isbtnLoaderShow = false;
	IsAnotherChecked: boolean = false;
	isOnline: boolean = true;
	receivedData: any;
	SellingRuleList: any = [];

	constructor(
		private _formBuilder: FormBuilder,
		public _formDirective: FormGroupDirective,
		public _validation: ValidationService,
		public _helper: HelperService,
		public _hotkeysService: HotkeysService,
		public _dialogRef: MatDialogRef<ItemInventoryManageComponent>,
		@Inject(MAT_DIALOG_DATA) public _editData: any
	) {
		this.validateForm();
		this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
			this.doManage();
			return false; // Prevent bubbling
		}));
	}

	getSellingRuleList(isSelectionRequired: number = 0) {
		this._helper.apiGet(`itemapis/poslist/?colname=ItemSellingRule&`).subscribe(
			data => {
				if (data.status == 1) {
					this.SellingRuleList = data.result;
				}
				// if (isSelectionRequired != 0) {
				// 	this.myForm.controls['selling_rule_id'].setValue(this.TobeselectedValue);
				// }
			},
			error => console.log(error)
		);
	}

	validateForm() {
		this.myForm = this._formBuilder.group({
			selling_rule_id: [null],
			min_inventory_level: [0, [Validators.pattern(this._validation.pattern_integer)]],
			max_inventory_level: [0, [Validators.pattern(this._validation.pattern_integer)]],
			desired_inventory_level: [0, [Validators.pattern(this._validation.pattern_integer)]],
		}, {
			validator: [
				this._validation.CompareValidation('max_inventory_level', 'min_inventory_level')
			]
		});
	}

	get f() {
		return this.myForm.controls;
	}

	doManage() {
		this.btnCreateTxt = "Please Wait..";
		this.submitted = true;
		if (this.f.max_inventory_level.errors != null) {
			if (this.f.max_inventory_level.errors.isInvalid) {
				this._helper.notify({ message: "Max inventory level should be greater than min inventory level.", messageType: 0 });
				return;
			}
		}
		if (this.myForm.invalid) {
			this.btnCreateTxt = "Save";
			this.isDisabled = false;
			return;
		}
		else {
			this.isbtnLoaderShow = true;
			let showInventoryData = "Selling Rule, Tax, Min Inventory Level, Max Inventory Level, Desired Inventory Level";

			let sellingRule: string = '';
			if (this.myForm.value['selling_rule_id'] != '' && this.myForm.value['selling_rule_id'] != null) {
				sellingRule = 'Selling Rule';
				let sellingRuleId: number = this.myForm.value['selling_rule_id'];
				this.SellingRuleList.forEach((value) => {
					if (value.id == sellingRuleId) {
						sellingRule += ': ' + value.text;
					}
				})
			}

			let tax: string = '';
			// , Tax

			let minInventoryLevel: string = '';
			if (this.myForm.value['min_inventory_level'] != '' && this.myForm.value['min_inventory_level'] != null) {
				minInventoryLevel = ', Min Inventory Level';
				minInventoryLevel += ': ' + this.myForm.value['min_inventory_level'];
			}

			let maxInventoryLevel: string = '';
			if (this.myForm.value['max_inventory_level'] != '' && this.myForm.value['max_inventory_level'] != null) {
				maxInventoryLevel = ', Max Inventory Level';
				maxInventoryLevel += ': ' + this.myForm.value['max_inventory_level'];
			}

			let desiredInventoryLevel: string = '';
			if (this.myForm.value['desired_inventory_level'] != '' && this.myForm.value['desired_inventory_level'] != null) {
				desiredInventoryLevel = ', Desired Inventory Level';
				desiredInventoryLevel += ': ' + this.myForm.value['desired_inventory_level'];
			}

			showInventoryData = sellingRule + tax + minInventoryLevel + maxInventoryLevel + desiredInventoryLevel;

			this._dialogRef.close({ label: showInventoryData, data: this.myForm.value });
		}
	}

	ngOnInit() {
		this.editData = this._editData.data;
		if (typeof this.editData.selling_rule_id != 'undefined') {
			// console.log('this.editData', this.editData);
			this.myForm.setValue({
				selling_rule_id: this.editData.selling_rule_id,
				min_inventory_level: this.editData.min_inventory_level,
				max_inventory_level: this.editData.max_inventory_level,
				desired_inventory_level: this.editData.desired_inventory_level,
			});
		}
		this.getSellingRuleList();
	}

}
