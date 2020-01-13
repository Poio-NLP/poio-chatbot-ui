import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { mergeMap, catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { ChatMessage } from './chat-message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  rasaUrl = environment.rasaUrl;

  constructor(private httpClient: HttpClient) {}

  public initRasaChat(user: string): Observable<any> {
    const trackerEventsUrl = `${this.rasaUrl}/conversations/${user}/tracker/events`;
    return this.httpClient
      .post(trackerEventsUrl, {
        event: 'restart'
      })
      .pipe(
        mergeMap(() =>
          this.httpClient.post(trackerEventsUrl, {
            event: 'action',
            name: 'action_listen'
          })
        ),
        catchError(this.handleError)
      );
  }

  public sendMessage(user: string, message: string): Observable<ChatMessage[]> {
    const rasaMessageUrl = `${this.rasaUrl}/webhooks/rest/webhook`;
    return this.httpClient
      .post<ChatMessage[]>(rasaMessageUrl, {
        sender: user,
        message
      })
      .pipe(
        map((responseMessages: any[]) =>
          responseMessages.map(m => {
            return { isBot: true, text: m.text };
          })
        ),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(
      'Sorry, I could not reach my back-end; please try again later.'
    );
  }
}
