import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { GroupsComponent } from './pages/groups/groups.component';
import { ActivitiesComponent } from './pages/activities/activities.component';
import { UserComponent } from './pages/user/user.component';
import { DetailsComponent } from './pages/user/details/details.component';
import { UpdateComponent } from './pages/user/update/update.component';
import { ActivityComponent } from './pages/activity/activity.component';
import { ActivityUpdateComponent } from './pages/activity/update/update.component';
import { ActivityDetailsComponent } from './pages/activity/activity-details/activity-details.component';
import { CreateActivityComponent } from './pages/create-activity/create-activity.component';
import { GroupComponent } from './pages/group/group.component';
import { GroupDetailsComponent } from './pages/group/group-details/group-details.component';
import { GroupUpdateComponent } from './pages/group/group-update/group-update.component';
import { CreateGroupComponent } from './pages/create-group/create-group.component';

export const routes: Routes = [
    {path:'register', component: RegisterComponent, canActivate: [guestGuard]},
    {path:'login', component: LoginComponent, canActivate: [guestGuard]},
    {
        path:'home', component: HomeComponent, canActivate: [authGuard]
    },
    {
        path:'groups', component: GroupsComponent, canActivate:[authGuard]
    },
    {
        path:'activities', component: ActivitiesComponent, canActivate:[authGuard]
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
            {path:"", component: ActivityDetailsComponent},
            {path:"edit", component: ActivityUpdateComponent},
        ]
    },
    {   path:'group/:id',
        component: GroupComponent,
        canActivate: [authGuard],
        children:[
            {path:"", component: GroupDetailsComponent},
            {path:"edit", component: GroupUpdateComponent},
        ]
    },
    {path:'create-activity', component: CreateActivityComponent},
    {path:'create-group', component: CreateGroupComponent},
    {path:'', redirectTo:'login', pathMatch: 'full'},
    {path: '**', redirectTo:'login'}
];
