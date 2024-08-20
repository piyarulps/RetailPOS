import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './modules/login/login.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ObEntryComponent } from './modules/ob-entry/ob-entry.component';

// admin-mode
// import { BrandsComponent } from './modules/admin-mode/brands/brands.component';
// import { SizesComponent } from './modules/admin-mode/sizes/sizes.component';
// import { ItemsComponent } from './modules/admin-mode/items/items.component';
// import { ItemGroupsComponent } from './modules/admin-mode/item-groups/item-groups.component';
// import { ManufacturersComponent } from './modules/admin-mode/manufacturers/manufacturers.component';
// import { SuppliersComponent } from './modules/admin-mode/suppliers/suppliers.component';
// import { ServiceprovidersComponent } from './modules/admin-mode/serviceproviders/serviceproviders.component';
// import { ItemsManageComponent } from './modules/admin-mode/items/items-manage/items-manage.component';
// import { SellingRuleComponent } from './modules/admin-mode/selling-rule/selling-rule.component';
// import { BusinessUnitComponent } from './modules/admin-mode/business-unit/business-unit.component';
// import { UnitofmeasurementComponent } from './modules/admin-mode/unitofmeasurement/unitofmeasurement.component';
// import { SiteComponent } from './modules/admin-mode/site/site.component';
// import { LocationComponent } from './modules/admin-mode/location/location.component';
// import { MerchandisingComponent } from './modules/admin-mode/merchandising/merchandising.component';
// import { PosdepartmentComponent } from './modules/admin-mode/posdepartment/posdepartment.component';

// sale-mode
// import { TerminalComponent } from './modules/sale-mode/terminal/terminal.component';

const routes: Routes = [
	{
		path: "login",
		component: LoginComponent,
		data: {
			moduleName: 'myLogin'
		}
	},
	{
		path: "dashboard",
		component: DashboardComponent,
		data: {
			moduleName: 'myDashboard'
		},
		canActivate: [AuthGuard]
	},
	{
		path: "ob-entry",
		component: ObEntryComponent,
		canActivate: [AuthGuard]
	},
	// {
	// 	path: "sale-mode/terminal",
	// 	component: TerminalComponent,
	// 	data: {
	// 		moduleName: 'myTerminal'
	// 	},
	// 	canActivate: [AuthGuard]
	// },
	{
		path: "sale-mode",
		loadChildren: "./modules/sale-mode/sale-mode.module#SaleModeModule"
	},
	// {
	// 	path: "admin-mode/brands",
	// 	component: BrandsComponent,
	// 	data: {
	// 		moduleName: 'Brands'
	// 	},
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/sizes",
	// 	component: SizesComponent,
	// 	data: {
	// 		moduleName: 'Sizes'
	// 	},
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/items",
	// 	component: ItemsComponent,
	// 	data: {
	// 		moduleName: 'Items'
	// 	},
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/item-groups",
	// 	component: ItemGroupsComponent,
	// 	data: {
	// 		moduleName: 'GroupSelectItem'
	// 	},
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/items/manage",
	// 	component: ItemsManageComponent,
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/manufacturers",
	// 	component: ManufacturersComponent,
	// 	data: {
	// 		moduleName: 'Manufacturer'
	// 	},
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/suppliers",
	// 	component: SuppliersComponent,
	// 	data: {
	// 		moduleName: 'Supplier'
	// 	},
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/serviceproviders",
	// 	component: ServiceprovidersComponent,
	// 	data: {
	// 		moduleName: 'ServiceProvider'
	// 	},
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/merchandising",
	// 	component: MerchandisingComponent,
	// 	data: {
	// 		moduleName: 'merchandise_group_add_edit'
	// 	},
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/posdepartment",
	// 	component: PosdepartmentComponent,
	// 	data: {
	// 		moduleName: 'POSDepartment'
	// 	},
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/sellingrule",
	// 	component: SellingRuleComponent,
	// 	data: {
	// 		moduleName: 'ItemSellingRule'
	// 	},
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/businessunit",
	// 	component: BusinessUnitComponent,
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/unitofmeasurement",
	// 	component: UnitofmeasurementComponent,
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/site",
	// 	component: SiteComponent,
	// 	canActivate: [AuthGuard]
	// },
	// {
	// 	path: "admin-mode/location",
	// 	component: LocationComponent,
	// 	canActivate: [AuthGuard]
	// },
	{
		path: "admin-mode",
		loadChildren: "./modules/admin-mode/admin-mode.module#AdminModeModule"
	},
	// otherwise redirect to home
	// { path: '**', redirectTo: 'dashboard' }
	{ path: '**', redirectTo: 'login' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule]
})
export class AppRoutingModule { }
