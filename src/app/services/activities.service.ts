import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ActivityShortDTO } from '../../Models/activities.model';
@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private readonly apiUrl = 'http://localhost:8080/activities';
  activity:any;

  private activitiesPayloadSubject = new BehaviorSubject<any|null>(null);
  public activitiesPayload$ = this.activitiesPayloadSubject.asObservable();

  constructor(private http: HttpClient) {}



  public getJoinedActivities():Observable<any>{
      //console.log('Hit get joined activities');
        return this.http.get<any>(`${this.apiUrl}`).pipe(
                tap((respone) =>{
                  this.activitiesPayloadSubject.next(respone);
                })
              );;
  }


  public getActivityDetails(id:string|null):Observable<any>{
    //console.log('Hit the activitty details');
    this.activity = this.http.get<any>(`${this.apiUrl}/${id}`);
    return this.activity;
  }
  public setActivity(activity:any){
    return this.activity = activity;
  }
  public getIsUserPartOfActivity(activityId:string):Observable<any>{
    return this.http.get(`${this.apiUrl}/${activityId}/joined`);
  }

  public generateNewInviteToken(activityId:string|null):Observable<any>{
    return this.http.post(`${this.apiUrl}/${activityId}/newtoken`,{})
  }

  public updateActivity(activityId:string|null, payload):Observable<any>{
    return this.http.patch(`${this.apiUrl}/${activityId}`,payload)
  }
  public deleteActivity(activityId:string|null):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${activityId}`);
  }
  public createActivity(payload:any){
    return this.http.post(`${this.apiUrl}`,payload);
  }
  public joinActivity(inviteToken:string){
    return this.http.post(`${this.apiUrl}/join/${inviteToken}`,{})
  }
  public leaveActivity(activityId:string|null):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${activityId}/members/leave`);
  }
  public kickFromActivity(activityId:string|null , memberId:string|null):Observable<any>{
    return this.http.delete(`${this.apiUrl}/${activityId}/members/kick`,{
       body: { id:memberId},
       headers: {
        'Content-Type': 'application/json'
      }});
  }
  public changeConfirmation(activityId:string|null){
    return this.http.patch(`${this.apiUrl}/${activityId}/confirmation`,{});
  }

  public createTask(activityId:string | null, payload:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/${activityId}/tasks`,payload);
  }
  public updateTask( activityId:string |null, payload:any){
    return this.http.patch(`${this.apiUrl}/${activityId}/tasks/${payload.id}`,payload);
  }
  public deleteTask( activityId:string |null, payload:any){
    return this.http.delete(`${this.apiUrl}/${activityId}/tasks/${payload.id}`);
  }

  public createAssign( activityId:string | null, taskId){
    return this.http.post(`${this.apiUrl}/${activityId}/tasks/${taskId}/assignment`,{});
  }
  public deleteAssign( activityId:string | null, taskId:string|null){
    return this.http.delete(`${this.apiUrl}/${activityId}/tasks/${taskId}/assignment`,{});
  }
  public updateAssignStatus( activityId:string | null, taskId: string|null){
    return this.http.patch(`${this.apiUrl}/${activityId}/tasks/${taskId}/assignment`,{});
  }
  public updateMemberRole(activityId:string | null, payload):Observable<any>{
    return this.http.patch(`${this.apiUrl}/${activityId}/members`,payload);

  }
}
