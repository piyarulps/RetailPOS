import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatCheckboxModule, MatExpansionModule, MatSnackBarModule, MatDialogModule, MatInputModule, MatFormFieldModule, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatTabsModule, MatIconModule, MatChipsModule, MatMenuModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatProgressSpinnerModule, MatTreeModule, MatRippleModule } from '@angular/material';
import { FormGroupDirective } from '@angular/forms';
import { ConnectionServiceModule } from 'ng-connection-service';
import { HotkeyModule } from 'angular2-hotkeys';
import { NgxCurrencyModule } from 'ngx-currency';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { GrdFilterPipe } from '../pipes/grd-filter.pipe';
import { HighlightPipe } from '../pipes/highlight.pipe';
import { ReversePipe } from '../pipes/reverse.pipe';

import { Globals } from '../globals';

// services
import { DialogsService } from '../services/dialogs.service';

// ui
import { ConfirmDialogComponent } from './ui/confirm-dialog/confirm-dialog.component';
import { SingleInputDialogComponent } from './ui/single-input-dialog/single-input-dialog.component';
import { ContactDetailsDialogComponent } from './ui/contact-details-dialog/contact-details-dialog.component';

@NgModule({
	declarations: [
		HighlightPipe,
		ReversePipe,
		ConfirmDialogComponent,
		ConfirmDialogComponent,
		SingleInputDialogComponent,
		GrdFilterPipe,
		ContactDetailsDialogComponent,
	],
	imports: [
		CommonModule,
		RouterModule,
		NgSelectModule,
		FormsModule,
		ReactiveFormsModule,
		ConnectionServiceModule,
		MatTableModule,
		MatSortModule,
		MatButtonModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatSelectModule,
		MatCheckboxModule,
		MatExpansionModule,
		MatSnackBarModule,
		MatDialogModule,
		MatInputModule,
		MatFormFieldModule,
		MatTabsModule,
		MatIconModule,
		MatChipsModule,
		MatMenuModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatProgressSpinnerModule,
		MatTreeModule,
		MatRadioModule,
		HotkeyModule.forRoot(),
		NgxCurrencyModule,
		MatRippleModule,
		DragDropModule,
	],
	providers: [
		DatePipe,
		DecimalPipe,
		Globals,
		FormGroupDirective,
		DialogsService,
		{ provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } }
	],
	entryComponents: [
		ConfirmDialogComponent,
		ContactDetailsDialogComponent,
		SingleInputDialogComponent,
	],
	exports: [
		HighlightPipe,
		ReversePipe,
		GrdFilterPipe,
		DatePipe,
		DecimalPipe,
		CommonModule,
		RouterModule,
		NgSelectModule,
		FormsModule,
		ReactiveFormsModule,
		ConnectionServiceModule,
		MatTableModule,
		MatSortModule,
		MatButtonModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatSelectModule,
		MatCheckboxModule,
		MatExpansionModule,
		MatSnackBarModule,
		MatDialogModule,
		MatInputModule,
		MatFormFieldModule,
		MatTabsModule,
		MatIconModule,
		MatChipsModule,
		MatMenuModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatProgressSpinnerModule,
		MatTreeModule,
		MatRadioModule,
		HotkeyModule,
		NgxCurrencyModule,
		MatRippleModule,
		DragDropModule,
	]
})
export class SharedModule { }
