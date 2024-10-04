import { FacebookLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'liveAngularApp';
  public userProfile:any
  public user: any;
  public loggedIn: boolean | undefined;
  constructor(
    private authService: SocialAuthService,
  ){
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.getFacebookPages(user.authToken)
      console.log("sncjsbvk",user);
      this.loggedIn = (user != null);
    });
  }
  getFacebookPages(accessToken: string): void {
    const url = `https://graph.facebook.com/v12.0/me/accounts?access_token=${accessToken}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log('Facebook Pages: ', data);
        // Handle the pages data as needed
      })
      .catch(error => {
        console.error('Error fetching pages: ', error);
      });
  }
  signInWithFB(event:string='Facebook'): void {
    if(event=='Facebook'){
      const loginOptions = { scope: 'pages_show_list,pages_read_engagement' };
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
  }
}
