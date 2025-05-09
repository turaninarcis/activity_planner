import { AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { UserService } from '../../services/user.service';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ChatMessage} from '../../../Models/chat-message.model'
import { GroupsService } from '../../services/groups.service';
import { DetailsPayload } from '../../../Models/details-payload.model';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
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
  public image:File | null = null;
  public imageExists:boolean = false;
  public imageUrl?:string|null = null;
  public imagePreview:string|null = null;
  skipNextScroll = false;
  expandedImage: string | null = null;

  userDetails!:DetailsPayload|null;
  constructor(private chatService: ChatService,
    private userService: UserService,
    private groupService:GroupsService,
    private http:HttpClient
  ) {}
  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
  ngAfterViewChecked(): void {
    if (this.skipNextScroll) {
      this.skipNextScroll = false;  // reset the flag
      return;
    }

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
      setTimeout(() => this.scrollToBottom(), 0);
    })
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.image=file;
      this.imageExists=true;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result?.toString() || '';
        //.log(this.imagePreview);
      };
      reader.readAsDataURL(file);
    }

    (event.target as HTMLInputElement).files=null;
  }



  removeSelectedFile(){
    this.imageExists = false;
    this.image=null;
    this.imageUrl=null;
    setTimeout(()=>{
      this.imagePreview=null;
    },300)
    console.log(this.image);
  }
  async send() {

    if(this.image==null && this.message=="") return;

    let imageUrl: string | null = null;

    if (this.image) {
      const formData = new FormData();
      formData.append('image', this.image);
  
      try {
        const res = await firstValueFrom(this.http
          .post<{ imageUrl: string }>('http://localhost:8080/chat/upload', formData));
          this.imageUrl=res.imageUrl;
          console.log(imageUrl);
      } catch (error) {
        console.error('Image upload failed:', error);
        return;
      }
    }


    this.chatService.sendMessage(this.groupId, this.loggedUser!,this.message, this.imageUrl!);
    this.message = '';
    this.removeSelectedFile();
  }

  private scrollToBottom():void{
    const element = this.messagesContainer.nativeElement;
    element.scrollTop = element.scrollHeight;
  }


  isNewDate(currentIndex: number): boolean {
    if (currentIndex === 0) return true; // always show date before first message
  
    const currentDate = new Date(this.messages[currentIndex].sendDateTime).toDateString();
    const previousDate = new Date(this.messages[currentIndex - 1].sendDateTime).toDateString();
  
    return currentDate !== previousDate;
  }

  openImageModal(url: string) {
    this.expandedImage = url;
    this.skipNextScroll = true;
  }
  
  closeImageModal() {
    this.expandedImage = null;
    this.skipNextScroll = true;
  }
}