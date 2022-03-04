import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
	providedIn: 'root'
})
export class SocketService {

  documentListRequest:any = null;
  documentViewRequest:any = null;

  constructor(private socket: Socket) {
    socket.on('requestAPIKey', this.onRequestAPIKey);

    socket.on('documentsList', this.onDocumentsList);
    socket.on('document', this.onDocument);
  }

  onRequestAPIKey() {
    console.log('requestedAPIKey');
  }

  sendAPIKey(key:string) {
    this.socket.emit('sendAPIKey', key);
  }

  sendLogout() {
    this.socket.emit('logout');
  }

  sendChatMessage(message: string) {
    this.socket.emit('sendChatMessage', message);
  }

  onNewChatMessage() {
    // Message: sender: string, message: string, time: number
    // Display the chat message
    return this.socket.fromEvent('newChatMessage');
    // How to use:
    // this.socketService.onNewChatMessage().subscribe((data: any) => this.movies = data)
  }

  postComment(comment:string, line:number) {
    this.socket.emit('postComment', comment, line);
  }

  onNewComment() {
    // Message: sender: string, message: string, line:number, time: number
    // Display the chat message
    return this.socket.fromEvent('newChatMessage');
    // How to use:
    // this.socketService.onNewComment().subscribe((data: any) => this.movies = data)
  }

  // These might get removed but I'll keep them for now
  getDocumentsList() {
    if (this.documentListRequest != null) {
      return this.documentListRequest;
    }
    this.socket.emit('requestDocumentsList');
    this.documentListRequest = new Promise<string>(() => { });
    return this.documentListRequest;
  }

  onDocumentsList(data:string) {
    if (this.documentListRequest == null) return;
    this.documentListRequest.resolve(data);
    this.documentListRequest = null;
  }

  viewDocument(documentID:string) {
    if (this.documentViewRequest != null) {
      return this.documentViewRequest;
    }
    this.socket.emit('viewDocument', documentID);
    this.documentViewRequest = new Promise<string>(() => { });
    return this.documentViewRequest;
  }

  onDocument(data:string, error:boolean) {
    if (this.documentViewRequest == null) return;
    if (error) {
      this.documentViewRequest.reject(data);
    } else {
      this.documentViewRequest.resolve(data);
    }
    this.documentViewRequest = null;
  }

  endViewingDocument() {
    this.socket.emit('endViewingDocument');
  }
}