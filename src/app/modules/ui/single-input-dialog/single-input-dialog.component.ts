import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { HelperService } from '../../../services/helper.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-single-input-dialog',
  templateUrl: './single-input-dialog.component.html',
  styleUrls: ['./single-input-dialog.component.scss']
})
export class SingleInputDialogComponent implements OnInit {

  columnSetForm: FormGroup;
	dialogTitle: string = "Add Column Set Name";
  submitted: boolean = false;
  dialogData:any;


  constructor(
		private _helper: HelperService,
		private _formBuilder: FormBuilder,
		public _dialogRef: MatDialogRef<SingleInputDialogComponent>,
		public _formDirective: FormGroupDirective,
    public _snackBar: MatSnackBar,
    private _hotkeysService: HotkeysService,
    @Inject(MAT_DIALOG_DATA) public _dialogData: any   

  ) {
		this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
			this.ManageColumnSetName();
			return false; // Prevent bubbling
		}));
    this.validateForm();
    console.log(this._dialogData);

   }

  validateForm() {
		this.columnSetForm = this._formBuilder.group({
			columnSetName: [null, Validators.required]
    });
  }
	get f() {
		return this.columnSetForm.controls;
	}
  ManageColumnSetName() {
    if (this.columnSetForm.invalid) {
			this.submitted = false;
    }else{
			this.submitted = true;
      this._dialogRef.close(this.columnSetForm.value);	
    }		
  }
  onNoClick(): void {
		this._dialogRef.close(false);
	}

  ngOnInit() {
    this.dialogData = this._dialogData;
    if(this.dialogData && this.dialogData.data && this.dialogData.data!=''){
      this.columnSetForm.setValue({
        columnSetName: this.dialogData.data
      });
    }
    
		// if (this.dialogData.columnSetId) {
		// 	this.iSaveColumnSet = true;
		// }
  }

}
