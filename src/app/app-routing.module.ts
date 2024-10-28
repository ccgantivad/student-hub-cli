import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectSelectionComponent } from './components/subject-selection/subject-selection.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ClassmatesComponent } from './components/classmates/classmates.component';
import { StudentRecordsComponent } from './components/student-records/student-records.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'subject-selection', component: SubjectSelectionComponent, canActivate: [AuthGuard] },
  { path: 'student-records', component: StudentRecordsComponent, canActivate: [AuthGuard] },
  { path: 'classmates', component: ClassmatesComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
