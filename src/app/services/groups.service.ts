import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private readonly apiUrl = 'http://localhost:8080/groups';

  constructor(
    private http:HttpClient
  ) { }

    public getJoinedGroups():Observable<any>{
        //console.log('Hit get joined groups');
          return this.http.get<any>(`${this.apiUrl}`);
    }
    public getGroupDetails(groupId:string|null):Observable<any>{
      //console.log('Hit get groupDetails');
        return this.http.get<any>(`${this.apiUrl}/${groupId}`);
  }
  public getNewInviteToken(groupId:string|null):Observable<any>{
      return this.http.patch<any>(`${this.apiUrl}/${groupId}/newtoken`,{});
  }
  public updateGroup(groupId:string|null, payload):Observable<any>{
    //console.log('Hit updategroup');
    return this.http.patch<any>(`${this.apiUrl}/${groupId}`,payload);
  }
  public createGroup(payload):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}`,payload);
  }
  public joinGroup(inviteToken:string):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/invite/${inviteToken}`,{});
  }
  public deleteGroup(groupId:string):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${groupId}`);
  }
  public leaveGroup(groupId:string):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${groupId}/members/leave`);
  }
  public kickFromGroup(groupId:string, memberId:string):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${groupId}/members/${memberId}/kick`);
  }
  public updateMemberRole(groupId:string, payload:any):Observable<any>{
    return this.http.patch<any>(`${this.apiUrl}/${groupId}/members`,payload);

  }

  public getPastMessages(groupId:string):Observable<any>{
    return this.http.get<any>(`http://localhost:8080/groups/${groupId}/messages`);
  }
}
