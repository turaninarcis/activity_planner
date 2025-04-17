import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { GroupsComponent } from './pages/home/groups/groups.component';
import { ActivitiesComponent } from './pages/home/activities/activities.component';
import { UserComponent } from './pages/user/user.component';
import { DetailsComponent } from './pages/user/details/details.component';
import { UpdateComponent } from './pages/user/update/update.component';
import { ActivityComponent } from './pages/activity/activity.component';


export const routes: Routes = [
    {path:'register', component: RegisterComponent, canActivate: [guestGuard]},
    {path:'login', component: LoginComponent, canActivate: [guestGuard]},
    {
        path:'home', 
        component: HomeComponent, 
        canActivate: [authGuard], 
        children:[
            {path:"groups",component: GroupsComponent},
            {path:"activities",component: ActivitiesComponent}
        ]
    },
    {
        path:'user', 
        component: UserComponent, 
        canActivate: [authGuard], 
        children:[
            {path:"",component: DetailsComponent},
            {path:"update",component: UpdateComponent}
        ]
    },
    {
        path:'activity/:id', 
        component: ActivityComponent, 
        canActivate: [authGuard], 
        children:[
        ]
    },
    {path:'', redirectTo:'login', pathMatch: 'full'},
    {path: '**', redirectTo:'login'}
];
