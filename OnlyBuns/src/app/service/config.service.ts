import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _api_url = 'http://localhost:8080/api';
  private _auth_url = 'http://localhost:8082/auth';
  private _user_url = this._api_url + '/users';
  private _login_url = this._user_url + '/login';
  private _logout_url=this._user_url + '/logout'; 
  private _posts_url=this._api_url+'/posts'
  private _profile_url=this._user_url+'/getUserByName';
  private _posts_image_url=this._posts_url + '/images';

  get login_url(): string {
    return this._login_url;
  }

  get prifile_url():string{
    return this._profile_url;
  }

  get logout_url(): string {
    return this._logout_url;
  }

  private _whoami_url = this._api_url + '/whoami';

  get whoami_url(): string {
    return this._whoami_url;
  }

  private _users_url = this._user_url + '/all';

  get users_url(): string {
    return this._users_url;
  }

  private _foo_url = this._api_url + '/foo';

  get foo_url(): string {
    return this._foo_url;
  }

  private _signup_url = this._user_url + '/register';
  private _verify_url = this._user_url + '/verify';

  get signup_url(): string {
    return this._signup_url;
  }

  get verify_url(): string {
    return this._verify_url;
  }
  get posts_url():string{
    return this._posts_url;
  }
  
  get posts_image_url():string{
    return this._posts_image_url;
  }

}
