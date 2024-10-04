import { FacebookLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';


// export const linkedInAuthConfig: AuthConfig = {
//   issuer: 'https://www.linkedin.com',
//   redirectUri: window.location.origin + '/auth/linkedin/callback',
//   clientId: '868w6zijo3wvc4', // Replace with LinkedIn client ID
//   responseType: 'code',
//   scope: 'r_liteprofile r_emailaddress',
//   showDebugInformation: true,
// };


const linkedInAuthConfig: AuthConfig = {
  clientId: '868w6zijo3wvc4',
  redirectUri: window.location.origin + '/liveAngularApp/',
  loginUrl: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
  responseType: 'code',
  scope: 'r_emailaddress r_liteprofile',
  requireHttps: false, // Set to true in production
  showDebugInformation: true,
};
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
    private http:HttpClient,
    private oauthService: OAuthService
  ){
    console.log(linkedInAuthConfig);
    
    this.configureOAuth();
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.getFacebookPages(user.authToken)
      console.log("sncjsbvk",user);
      this.loggedIn = (user != null);
    });
  }
  getFacebookPages(accessToken: string): void {
this.http.get(`https://graph.facebook.com/v12.0/me/accounts?access_token=${accessToken}`).subscribe((res:any)=>{
  console.log(res);
  
})

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
  signout(): void {
    this.authService.signOut();
  }
  loginWithLinkedIn() {
    console.log("djcdkhv");
    
    this.oauthService.initImplicitFlow();
  }

  handleLinkedInCallback() {
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        const userInfo = this.oauthService.getIdentityClaims();
        console.log('Logged in user info:', userInfo);
      }
    });
  }
  private configureOAuth(): void {
    // this.oauthService.configure(linkedInAuthConfig);
    // this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.configure(linkedInAuthConfig);
      this.oauthService.tryLogin();
  }
}
