import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes'; // Import app routes
import { AuthService } from './services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MasterService } from './services/master.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from './services/utility.service';
import { WebcamModule } from 'ngx-webcam';

@NgModule({
  declarations: [
    AppComponent // Declare AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
     WebcamModule,
    RouterModule.forRoot(routes),
    NgbModule // Initialize the root routes
  ],
  providers:[AuthService,
MasterService,
UtilityService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
