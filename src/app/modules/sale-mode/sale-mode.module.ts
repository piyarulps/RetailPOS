import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared.module';

import { SaleModeRoutes } from './sale-mode.routes';

import { TerminalComponent } from './terminal/terminal.component';
import { CustomerManageComponent } from './dialogs/customer-manage/customer-manage.component';


@NgModule({
	declarations: [
		TerminalComponent,
		CustomerManageComponent
	],
	imports: [
		SharedModule,
		RouterModule.forChild(SaleModeRoutes),
	],
	entryComponents: [
		CustomerManageComponent
	],
	exports: []
})
export class SaleModeModule { }
