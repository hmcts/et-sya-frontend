import axios, { AxiosResponse } from 'axios';
import moment from 'moment';

import { PageUrls, languages } from '../../../definitions/constants';
import * as i18nWelsh from '../../../resources/locales/cy/translation/template.json';
import * as i18n from '../../../resources/locales/en/translation/template.json';
import { focusToGovUKErrorDiv } from '../set-focus';

export default class SessionTimeout {
  public sessionExpirationTime: string;
  public sessionTimeoutCountdown: number;
  // TODO revert back to this after testing
  // public bufferSessionExtension: number = 5 * 60 * 1000; //length of time modal will appear
  public bufferSessionExtension: number = 30 * 1000; //length of time modal will appear
  private sessionTimeout: number;
  private modalTimeout: number;
  private modalCountdown: number;
  private isLoggedIn: HTMLInputElement = null;
  private extendSessionElement: HTMLElement = null;
  private modalElement: HTMLElement = null;
  private modalOverlayElement: HTMLElement = null;
  private modalCountdownElement: HTMLElement = null;
  private focusableElements: NodeListOf<Element> = null;
  private firstFocusableElement: HTMLElement = null;
  private lastFocusableElement: HTMLElement = null;
  private previousFocusedElement: HTMLElement = null;
  private scrollPosition: number = null;
  private body: HTMLElement = null;

  constructor() {
    this.init = this.init.bind(this);
    this.modalElement = document.querySelector('#timeout-modal');
    this.modalOverlayElement = document.querySelector('#modal-overlay');
    this.modalCountdownElement = document.querySelector('#dialog-description');
    this.extendSessionElement = document.querySelector('#extend-session');
    this.isLoggedIn = document.querySelector('#isLoggedIn');
    this.body = document.querySelector('body');
    this.focusableElements = this.modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    this.firstFocusableElement = this.focusableElements[0] as HTMLElement;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] as HTMLElement;
  }

  init(): void {
    this.addListeners();
    void this.extendSession();
    focusToGovUKErrorDiv();
  }

  addListeners = (): void => {
    if (this.extendSessionElement) {
      this.extendSessionElement.addEventListener('click', this.extendSession);
    }
  };

  removeListeners = (): void => {
    if (this.extendSessionElement) {
      this.extendSessionElement.removeEventListener('click', this.extendSession);
    }
  };

  startCounter = (): void => {
    const sessionExpirationTimeMoment = moment(this.sessionExpirationTime);
    this.sessionTimeoutCountdown = sessionExpirationTimeMoment.diff(moment());
    this.sessionTimeout = window.setTimeout(() => {
      this.signOut();
    }, this.sessionTimeoutCountdown);
    this.modalTimeout = window.setTimeout(() => {
      this.openModal();
      this.startModalCountdown();
    }, this.sessionTimeoutCountdown - (this.bufferSessionExtension + 1));
  };

  stopCounters = (): void => {
    clearTimeout(this.sessionTimeout);
    clearTimeout(this.modalTimeout);
    clearInterval(this.modalCountdown);
  };

  resetModalMessage = (): void => {
    this.modalCountdownElement.innerHTML = i18n.sessionTimeout.modal.info;

    if (this.extendSessionElement.innerHTML.includes(i18nWelsh.sessionTimeout.modal.extend)) {
      this.modalCountdownElement.innerHTML = i18nWelsh.sessionTimeout.modal.info;
    } else {
      this.modalCountdownElement.innerHTML = i18n.sessionTimeout.modal.info;
    }
  };

  restartCounters = (): void => {
    this.stopCounters();
    this.startCounter();
    this.resetModalMessage();
  };

  startModalCountdown = (): void => {
    let count = 0;
    let minutes = 2;
    let seconds = '00';
    this.modalCountdown = window.setInterval(() => {
      minutes = moment.duration(this.bufferSessionExtension - count).minutes();
      seconds = moment
        .duration(this.bufferSessionExtension - count)
        .seconds()
        .toLocaleString('en-GB', { minimumIntegerDigits: 2 });
      if (this.extendSessionElement.innerHTML.includes(i18nWelsh.sessionTimeout.modal.extend)) {
        this.modalCountdownElement.innerHTML = `${i18nWelsh.sessionTimeout.modal.body[0]} ${minutes}:${seconds} ${i18nWelsh.sessionTimeout.modal.body[1]}`;
      } else {
        this.modalCountdownElement.innerHTML = `${i18n.sessionTimeout.modal.body[0]} ${minutes}:${seconds} ${i18n.sessionTimeout.modal.body[1]}`;
      }
      count += 1000;
    }, 1000);
  };

  openModal = (): void => {
    this.modalElement.removeAttribute('aria-hidden');
    this.modalOverlayElement.removeAttribute('aria-hidden');
    this.previousFocusedElement = document.activeElement as HTMLElement;
    this.firstFocusableElement.focus();
    this.disableScroll();
    this.body.addEventListener('keydown', this.keyDownEventListener);
  };

  disableScroll = (): void => {
    this.scrollPosition = window.pageYOffset;
    this.body.style.overflow = 'hidden';
    this.body.style.position = 'fixed';
    this.body.style.width = '100%';
    this.body.style.top = `-${this.scrollPosition}px`;
  };

  enableScroll = (): void => {
    this.body.style.removeProperty('overflow');
    this.body.style.removeProperty('position');
    this.body.style.removeProperty('width');
    window.scrollTo(0, this.scrollPosition);
  };

  closeModal = (): void => {
    this.modalElement.setAttribute('aria-hidden', 'true');
    this.modalOverlayElement.setAttribute('aria-hidden', 'true');

    document.querySelector('body').removeEventListener('keydown', this.keyDownEventListener);
    if (this.previousFocusedElement) {
      this.previousFocusedElement.focus();
    }
    this.enableScroll();
  };

  signOut(): void {
    let redirectUrl = '';
    if (this.extendSessionElement.innerHTML.includes(i18nWelsh.sessionTimeout.modal.extend)) {
      redirectUrl = PageUrls.HOME + languages.WELSH_URL_PARAMETER;
    } else {
      redirectUrl = PageUrls.HOME + languages.ENGLISH_URL_PARAMETER;
    }
    window.location.assign('/logout?redirectUrl=' + redirectUrl);
  }

  extendSession = (): Promise<void> => {
    focusToGovUKErrorDiv();
    if (
      this.isLoggedIn !== null &&
      this.isLoggedIn !== undefined &&
      this.isLoggedIn.value !== null &&
      this.isLoggedIn.value !== '' &&
      this.isLoggedIn.value !== undefined &&
      this.isLoggedIn.value === 'true'
    ) {
      return axios
        .get('/extend-session')
        .then((response: AxiosResponse): void => {
          this.sessionExpirationTime = response.data.timeout;
          this.restartCounters();
          this.closeModal();
          focusToGovUKErrorDiv();
        })
        .catch(() => {
          this.removeListeners();
          this.stopCounters();
          focusToGovUKErrorDiv();
        });
    }
  };

  keyDownEventListener = (event: KeyboardEvent): void => {
    if (event.key === 'Tab') {
      event.preventDefault();
      if (!this.modalElement.contains(document.activeElement) || this.focusableElements.length === 1) {
        this.firstFocusableElement.focus();
        return;
      }
      if (event.shiftKey) {
        if (document.activeElement === this.firstFocusableElement) {
          this.lastFocusableElement.focus();
        }
      } else {
        if (document.activeElement === this.lastFocusableElement) {
          this.firstFocusableElement.focus();
        }
      }
    }
  };
}
