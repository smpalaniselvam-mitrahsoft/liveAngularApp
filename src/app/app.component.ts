import { FacebookLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';


// export const linkedInAuthConfig: AuthConfig = {
//   issuer: 'https://www.linkedin.com',
//   redirectUri: window.location.origin + '/auth/linkedin/callback',
//   clientId: '868w6zijo3wvc4', // Replace with LinkedIn client ID
//   responseType: 'code',
//   scope: 'r_liteprofile r_emailaddress',
//   showDebugInformation: true,
// };


const linkedInAuthConfig: any = {
  issuer: 'https://correct-issuer-url',
  clientId: '868w6zijo3wvc4',
  redirectUri: `${window.location.origin}/liveAngularApp/`,
  loginUrl: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenEndpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
  responseType: 'code',
  scope: 'openid profile email', // Updated scopes
  requireHttps: false, // Set to true in production
  clientSecret:'WPL_AP1.6Nge6cjEUWW2JYVg./tEdvw=='
};

// environment.ts
export const environment = {
  instagram: {
    clientId: '1689039378550118',
    redirectUri: `${window.location.origin}/liveAngularApp/`,
    authUrl: 'https://api.instagram.com/oauth/authorize',
    responseType: 'token',
    scope: 'user_profile,user_media',
  },
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'liveAngularApp';
  public userProfile:any
  public user: any;
  public loggedIn: boolean | undefined;
  constructor(
    private authService: SocialAuthService,
    private http:HttpClient,
    private oauthService: OAuthService,
    private route: ActivatedRoute,
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
    this.http.get(`https://graph.facebook.com/v12.0/me/accounts?access_token=${accessToken}`).subscribe((res: any) => {
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
  ngOnInit(): void {

    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        const userInfo = this.oauthService.getIdentityClaims();
        console.log('Logged in user info:', userInfo);
      }
    });

    this.route.queryParams.subscribe((params:any) => {
      const code = params['code'];
      console.log("code",params);
      
      if (code) {
        // Exchange authorization code for access token
        // this.authService.exchangeCodeForToken(code).subscribe(
        //   (response: any) => {
        //     const accessToken = response.access_token;
        //     console.log('Access Token:', accessToken);
        //     // Store the access token (e.g., in localStorage)
        //     localStorage.setItem('linkedin_access_token', accessToken);
        //   },
        //   error => {
        //     console.error('Error exchanging code for token:', error);
        //   }
        // );
      }
    });
  
  }
  loginWithLinkedIn() {
    this.oauthService.initImplicitFlow();
  }
  

  handleLinkedInCallback() {
    
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      console.log(this.oauthService.hasValidAccessToken());
      if (this.oauthService.hasValidAccessToken()) {
          // Get user info from LinkedIn;
          
          this.getUserInfo();
      }
  });
  
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
      if (this.oauthService.hasValidAccessToken()) {
        const userInfo = this.oauthService.getIdentityClaims();
        console.log('Logged in user info:', userInfo);
      }
    });
  }


  getUserInfo() {
    const accessToken = this.oauthService.getAccessToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });

    this.http.get('https://api.linkedin.com/v2/me', { headers })
        .subscribe(
            (userData) => {
                console.log('Logged in user data:', userData);
                // Process user data as needed
            },
            (error) => {
                console.error('Error fetching user data:', error);
            }
        );
}

  private configureOAuth(): void {
    // this.oauthService.configure(linkedInAuthConfig);
    // this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.configure(linkedInAuthConfig);
      this.oauthService.tryLogin();
      console.log(this.oauthService.getAccessToken())
      this.handleLinkedInCallback()
  }


  loginWithInstagram() {
    const authUrl = `${environment.instagram.authUrl}?client_id=${environment.instagram.clientId}&redirect_uri=${environment.instagram.redirectUri}&response_type=${environment.instagram.responseType}&scope=${environment.instagram.scope}`;
    
    window.location.href = authUrl;
  }

  handleAuthCallback() {
    const urlParams = new URLSearchParams(window.location.hash);
    const accessToken = urlParams.get('#access_token');
    if (accessToken) {
      // Save the access token for further API requests
      localStorage.setItem('instagram_access_token', accessToken);
    }
  }
}
