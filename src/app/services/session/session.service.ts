import { Injectable } from '@angular/core';
import * as moment from 'moment';


@Injectable()
export class SessionService {

  private store;
  private webStorage: boolean;
  private lastAccess: Date;
  private timeExpiration = 0; // 1000 * 60 * 15; //15 min

  constructor() {
    this.webStorage = typeof(Storage) !== 'undefined';
    if (this.webStorage) {
      this.store = localStorage;
    } else {
      this.store = {};
    }
  }

  private checkValid() {
    if (this.timeExpiration > 0) {
      const now = moment();
      const date = moment(this.lastAccess);
      if (date.diff(now) > this.timeExpiration) {
        // EXPIRED!
      } else {
        this.lastAccess = new Date();
      }
    }
  }

  get(key) {
    this.checkValid();
    if (this.webStorage) {
      const val = this.store.getItem(key);
      try {
        return JSON.parse(val);
      } catch (ex) {
        return this.store.getItem(key)
      }
    } else {
      return this.store[key];
    }
  }

  set(key, value) {
    this.checkValid();
    if (this.webStorage) {
      this.store.setItem(key, JSON.stringify(value));
    } else {
      this.store[key] = value;
    }
  }

  remove(key) {
    this.checkValid();
    if (this.webStorage) {
      this.store.removeItem(key);
    } else {
      delete this.store[key];
    }
  }

  clear() {
    this.checkValid();
    if (this.webStorage) {
      this.remove('receiverList');
      this.remove('accountList');
      this.remove('purposeList');
      this.remove('linkInfo');
    } else {
      this.store = {};
    }
  }

}
