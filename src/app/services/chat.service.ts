import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Client, IMessage, Stomp} from '@stomp/stompjs';
import { ChatMessage } from '../../Models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private client!: Client;
  public messages$ = new BehaviorSubject<any[]>([]) ;
  private connected = false;  // Flag to track connection status
  token:string='';
  constructor() { 
  }

  connectAndSubscribe(groupId:string){
    this.token = localStorage.getItem('jwt_token')!;

    // Create a Stomp client
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws?token='+ this.token,  // WebSocket URL (STOMP broker)
      reconnectDelay: 5000,  // Reconnect delay in ms
      debug: (str) => console.log(str),  // Log connection status
      onConnect: () => { 
        //console.log('Connected to WebSocket');
        this.connected = true;  // Mark connection as established
        this.subscribeToGroup(groupId);
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame.headers['message']);
      },
      onWebSocketError: (error) => {
        console.error('[WebSocket Error]', error);
      },
    });

    // Activate the client to establish connection
    this.client.activate();


  }

  // Subscribe to a specific group's messages
  public subscribeToGroup(groupId: string): void {
    if (this.connected) {
      this.client.subscribe(`/topic/group/${groupId}`, (message: IMessage) => {
        console.log('Websocket message received', message.body);
        const chatMessage = JSON.parse(message.body);  // Parse message
        const currentMessages = this.messages$.value;
        this.messages$.next([...currentMessages, chatMessage]);  // Update message list
        console.log(`Received message: ${JSON.stringify(chatMessage)}`);

      });
    } else {
      console.error('STOMP client is not connected yet');
    }
  }

  // Send a message to a group
  public sendMessage(groupId: string,senderName:string, message: string, image:string|null): void {
    const chatMessage = { message:message, image:image , senderName:senderName, groupId:groupId}; // Example message object
    console.log(JSON.stringify(chatMessage));
    this.client.publish({
      destination: `/app/sendMessage`,  // Send to appropriate group endpoint
      body: JSON.stringify(chatMessage)  // Send the message as JSON
    });
  }



  public getMessages() {
    return this.messages$.asObservable();  // Expose as observable
  }

  // Disconnect from the WebSocket (clean up when no longer needed)
  public disconnect() {
    if (this.client && this.client.connected) {
      this.client.deactivate();
    }
  }

  public loadPastMessages(messages: ChatMessage[]) {
    this.messages$.next(messages);  // load them once
  }
}
