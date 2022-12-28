import { UserRole } from '@mathemon/common/models/user';
import { setToken } from '@mathemon/turbo-client/rest/init';
import store from '@mathemon/turbo-client/store';
import jwtDecode from 'jwt-decode';
import { action, computed, makeAutoObservable } from 'mobx';

import { generateToken, renewToken } from '../api/auth';

const TOKEN_RENEWAL_FREQUENCY = 60 * 60 * 1000;
const TOKEN_STORAGE_KEY = 'token';

export interface LoggedUser {
  username: string;
  id: string;
  role: UserRole;
}

export class AuthStore {
  public token?: string;
  protected loggedUser?: LoggedUser;
  protected rememberMe = false;
  private renewalInterval?: NodeJS.Timeout;

  constructor() {
    try {
      makeAutoObservable(this);
      let token = store(true).getItem(TOKEN_STORAGE_KEY);
      if (token) {
        this.rememberMe = true;
      } else {
        token = store(false).getItem(TOKEN_STORAGE_KEY);
      }

      if (token) {
        this.setToken(token);
        renewToken().then(this.setToken);
      }
    } catch (err) {
      console.error(err);
    }
  }

  private stopRenewal = () => {
    if (this.renewalInterval) {
      clearInterval(this.renewalInterval);
    }
  };

  private startRenewal = () => {
    this.stopRenewal();

    this.renewalInterval = setInterval(async () => {
      try {
        const token = await renewToken();
        this.setToken(token);
      } catch (err) {
        console.error(err);
      }
    }, TOKEN_RENEWAL_FREQUENCY);
  };

  public signIn = async (email: string, password: string, rememberMe: boolean) => {
    try {
      this.setRememberMe(rememberMe);
      const token = await generateToken(email, password);

      this.setToken(token);
      return true;
    } catch (err) {
      return false;
    }
  };

  public signOut = () => {
    this.setToken(undefined);
  };

  @action
  private setToken = (token?: string) => {
    setToken(token);
    if (token) {
      const { id, username, role } = jwtDecode<LoggedUser>(token);

      this.token = token;
      this.loggedUser = {
        id,
        username,
        role,
      };

      store(this.rememberMe).setItem(TOKEN_STORAGE_KEY, token);
      this.startRenewal();
    } else {
      this.token = undefined;
      this.loggedUser = undefined;
      store(this.rememberMe).removeItem(TOKEN_STORAGE_KEY);
      this.stopRenewal();
    }
  };

  @action
  public setRememberMe = (rememberMe: boolean) => {
    this.rememberMe = rememberMe;
  };

  @computed
  public get user() {
    return this.loggedUser ? { ...this.loggedUser } : undefined;
  }

  @computed
  public get signedIn() {
    return !!this.loggedUser;
  }

  @computed
  public get role() {
    return this.loggedUser && this.loggedUser.role;
  }
}
