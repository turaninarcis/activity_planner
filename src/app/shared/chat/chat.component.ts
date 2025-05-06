import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ChatMessage} from '../../../Models/chat-message.model'
import { GroupsService } from '../../services/groups.service';
import { DetailsPayload } from '../../../Models/details-payload.model';
@Component({
  selector: 'app-chat',
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  @Input() groupId!: string;  // Group ID
  public messages: ChatMessage[] = [];
  public message: string = '';
  public loggedUser?: string ='';
  userDetails!:DetailsPayload|null;
  constructor(private chatService: ChatService,
    private userService: UserService,
    private groupService:GroupsService
  ) {}
  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.chatService.connectAndSubscribe(this.groupId);

    this.groupService.getPastMessages(this.groupId).subscribe(data=>{
      this.chatService.loadPastMessages(data.chatMessages);
    }
    );

    this.userService.userDetails$.subscribe({
      next: (res) => {
        this.userDetails=res;
        this.loggedUser=res?.username;
      }
    });
    
    this.chatService.getMessages().subscribe(messages =>{
      this.messages = messages;
    })
  }

  send() {
    this.chatService.sendMessage(this.groupId, this.loggedUser!,this.message);
    this.message = '';
  }

  private scrollToBottom():void{
    const element = this.messagesContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
    console.log(element.scrollTop, element.scrollHeight);
  }

  isNewDate(currentIndex: number): boolean {
    if (currentIndex === 0) return true; // always show date before first message
  
    const currentDate = new Date(this.messages[currentIndex].sendDateTime).toDateString();
    const previousDate = new Date(this.messages[currentIndex - 1].sendDateTime).toDateString();
  
    return currentDate !== previousDate;
  }
}