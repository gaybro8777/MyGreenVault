import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { TextMaskModule } from 'angular2-text-mask';

import { AlertComponent } from './components/alert/alert.component';
import { CloseComponent } from './components/close/close.component';
import { DisplayOptionsComponent } from './components/display-options/display-options.component';
import { EmailComponent } from './components/email/email.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { HeaderComponent } from './components/header/header.component';
import { JobStatusChipComponent } from './components/job-status-chip/job-status-chip.component';
import { LoadingComponent } from './components/loading/loading.component';
import { OmniSearchComponent } from './components/omni-search/omni-search.component';
import { SideNavLinkComponent } from './components/side-nav-link/side-nav-link.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { CamelCaseToRegularPipe } from './pipes/camel-case-to-regular';
import { EmptyPipe } from './pipes/empty/empty.pipe';
import { FilterJobPipe } from './pipes/filter-job/filter-job.pipe';
import { JobStatusNumberToTitlePipe } from './pipes/job-status-number-to-title/job-status-number-to-status-title.pipe';
import { KeysPipe } from './pipes/object-keys.pipe';
import { HeaderService } from './services/header/header.service';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { PlantsNavigationService } from './services/navigation.plants';
import { NotificationService } from './services/notification/notification.service';
import { SearchService } from './services/search/search.service';
import { SideNavService } from './services/side-nav/side-nav.service';
import { TokenService } from './services/token/token.service';
import { PlantProfilePipe } from './pipes/plant-profile/plant-profile.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TextMaskModule,
    NgbModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      confirmButtonType: 'primary'
    })
  ],
  declarations: [
    HeaderComponent,
    LoadingComponent,
    KeysPipe,
    CamelCaseToRegularPipe,
    EmptyPipe,
    ToasterComponent,
    SideNavComponent,
    SideNavLinkComponent,
    DisplayOptionsComponent,
    JobStatusNumberToTitlePipe,
    FilterJobPipe,
    JobStatusChipComponent,
    AlertComponent,
    OmniSearchComponent,
    CloseComponent,
    EmailComponent,
    FileUploadComponent,
    PlantProfilePipe
  ],
  providers: [
    NotificationService,
    SideNavService,
    TokenService,
    HeaderService,
    LocalStorageService,
    SearchService,
    PlantsNavigationService,
    PlantProfilePipe
  ],
  exports: [
    HeaderComponent,
    LoadingComponent,
    KeysPipe,
    CamelCaseToRegularPipe,
    JobStatusNumberToTitlePipe,
    EmptyPipe,
    ToasterComponent,
    SideNavComponent,
    ConfirmationPopoverModule,
    DisplayOptionsComponent,
    JobStatusChipComponent,
    FilterJobPipe,
    AlertComponent,
    CloseComponent,
    EmailComponent,
    TextMaskModule,
    FileUploadComponent,
    PlantProfilePipe
  ]
})
export class SharedModule {}
