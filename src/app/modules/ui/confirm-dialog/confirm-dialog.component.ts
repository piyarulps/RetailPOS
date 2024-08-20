import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
	selector: 'app-confirm-dialog',
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

	dialogData: any = {
		message: ""
	};

	constructor(
		public dialogRef: MatDialogRef<ConfirmDialogComponent>,
		private _hotkeysService: HotkeysService,
		@Inject(MAT_DIALOG_DATA) public _dialogData: any
	) {
		this._hotkeysService.add(new Hotkey('enter', (event: KeyboardEvent): boolean => {
			this.onYesClick();
			return false; // Prevent bubbling
		}));
	}

	onYesClick(): void {
		this.dialogRef.close(true);
	}

	onNoClick(): void {
		this.dialogRef.close(false);
	}

	ngOnInit() {
		this.dialogData = this._dialogData;
	}

}
