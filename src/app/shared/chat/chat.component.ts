import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ChatMessage} from '../../../Models/chat-message.model'
import { GroupsService } from '../../services/groups.service';
@Component({
  selector: 'app-chat',
  imports: [NgFor, FormsModule, CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  @Input() groupId!: string;  // Group ID
  public messages: ChatMessage[] = [];
  public message: string = '';
  public username: string = 'User'; // Get the actual username from your auth service
  public loggedUser: string ='';
  constructor(private chatService: ChatService,
    private userService: UserService,
    private groupService:GroupsService
  ) {}
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.chatService.connectAndSubscribe(this.groupId);
    this.loggedUser= this.userService.getCurrentUsername()!;

    this.groupService.getPastMessages(this.groupId).subscribe(data=>{
      this.chatService.loadPastMessages(data.chatMessages);
    }
    );

    this.username = this.userService.getCurrentUsername()!;
    
    this.chatService.getMessages().subscribe(messages =>{
      this.messages = messages;
    })
  }

  send() {
    this.chatService.sendMessage(this.groupId, this.username,this.message);
    this.message = '';
  }

  private scrollToBottom():void{
    const element = this.messagesContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
    console.log(element.scrollTop, element.scrollHeight);
  }
}