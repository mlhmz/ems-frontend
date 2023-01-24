import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { QualificationListComponent } from './qualification-list/qualification-list.component';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { QualificationDetailsComponent } from './qualification-details/qualification-details.component';
import { EmployeeEditorComponent } from './employee-editor/employee-editor.component';
import { QualificationEditorComponent } from './qualification-editor/qualification-editor.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { StatusBarComponent } from './status-bar/status-bar.component';
import { ConfirmableDeleteComponent } from './confirmable-delete/confirmable-delete.component';
import { initializeKeycloak } from './security/app.init';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    QualificationListComponent,
    NavigationBarComponent,
    EmployeeDetailsComponent,
    QualificationDetailsComponent,
    EmployeeEditorComponent,
    QualificationEditorComponent,
    NotFoundComponent,
    StatusBarComponent,
    ConfirmableDeleteComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule, KeycloakAngularModule],
  providers: [
    CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
