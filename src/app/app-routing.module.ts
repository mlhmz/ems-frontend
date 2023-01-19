import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { EmployeeEditorComponent } from './employee-editor/employee-editor.component';
import { EmployeeListComponent } from "./employee-list/employee-list.component";
import { QualificationDetailsComponent } from './qualification-details/qualification-details.component';
import { QualificationEditorComponent } from './qualification-editor/qualification-editor.component';
import { QualificationListComponent } from './qualification-list/qualification-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/employee', pathMatch: 'full' },
  { path: 'employee', component: EmployeeListComponent },
  { path: 'employee/editor', component: EmployeeEditorComponent },
  { path: 'employee/editor/:id', component: EmployeeEditorComponent },
  { path: 'employee/:id', component: EmployeeDetailsComponent },
  { path: 'qualification/:id', component: QualificationDetailsComponent },
  { path: 'qualification/editor/:id', component: QualificationEditorComponent },
  { path: 'qualification', component: QualificationListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
