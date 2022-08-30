import axios, { AxiosResponse } from 'axios';
import moment from 'moment';

//import { paths } from '../app/paths';
import * as i18n from '../../../resources/locales/en/translation/template.json';

export default class SessionTimeout {
  public sessionExpirationTime: string;
  public sessionTimeoutCountdown: number;
  // public bufferSessionExtension: number = 2 * 60 * 1000;
  public bufferSessionExtension: number = 30 * 1000; //length of time modal will appear
  private sessionTimeout: number;
  private modalTimeout: number;
  private modalCountdown: number;
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
    console.log('modal element is ', this.modalElement);
    this.modalOverlayElement = document.querySelector('#modal-overlay');
    this.modalCountdownElement = document.querySelector('#dialog-description');
    this.extendSessionElement = document.querySelector('#extend-session');
    console.log('extend session element is ', this.extendSessionElement);

    this.body = document.querySelector('body');
    console.log('body is ', this.body);

    this.focusableElements = this.modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    this.firstFocusableElement = this.focusableElements[0] as HTMLElement;
    this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1] as HTMLElement;
  }

  init(): void {
    console.log('####### begin init, add listeners ##############');
    this.addListeners();
    void this.extendSession();
  }

  addListeners = (): void => {
    if (this.extendSessionElement) {
      this.extendSessionElement.addEventListener('click', this.extendSession);
    }
    console.log('listeners added');
  };

  removeListeners = (): void => {
    if (this.extendSessionElement) {
      this.extendSessionElement.removeEventListener('click', this.extendSession);
    }
    console.log('listeners removed');
  };

  startCounter = (): void => {
    console.log('start counter is executing');
    const sessionExpirationTimeMoment = moment(this.sessionExpirationTime);
    this.sessionTimeoutCountdown = sessionExpirationTimeMoment.diff(moment());
    console.log('call to /session-ended is set to trigger in ' + this.sessionTimeoutCountdown + ' milliseconds');
    this.sessionTimeout = window.setTimeout(() => {
      this.signOut();
    }, this.sessionTimeoutCountdown);
    this.modalTimeout = window.setTimeout(() => {
      console.log('setting modal to open 2 min before session timeout..');
      this.openModal();
      this.startModalCountdown();
    }, this.sessionTimeoutCountdown - (this.bufferSessionExtension + 1));
  };

  stopCounters = (): void => {
    console.log('stopping counters');
    clearTimeout(this.sessionTimeout);
    clearTimeout(this.modalTimeout);
    clearInterval(this.modalCountdown);
  };

  resetModalMessage = (): void => {
    this.modalCountdownElement.innerHTML = i18n.sessionTimeout.modal.info;
  };

  restartCounters = (): void => {
    this.stopCounters();
    this.startCounter();
    this.resetModalMessage();
  };

  startModalCountdown = (): void => {
    console.log('start modal countdown');
    let count = 0;
    let minutes = 2;
    let seconds = '00';
    this.modalCountdown = window.setInterval(() => {
      minutes = moment.duration(this.bufferSessionExtension - count).minutes();
      seconds = moment
        .duration(this.bufferSessionExtension - count)
        .seconds()
        .toLocaleString('en-GB', { minimumIntegerDigits: 2 });
      console.log('set interval - minutes', minutes);
      console.log('set interval - seconds', seconds);

      this.modalCountdownElement.innerHTML = `${i18n.sessionTimeout.modal.body[0]} ${minutes}:${seconds} ${i18n.sessionTimeout.modal.body[1]}`;
      count += 1000;
    }, 1000);
  };

  openModal = (): void => {
    console.log('open modal beginning');
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
    console.log('signout begins');
    window.location.assign('/logout?redirectUrl=/');
  }

  extendSession = (): Promise<void> => {
    console.log('###############');
    console.log('extend session');
    console.log('###############');

    return axios
      .get('/extend-session')
      .then((response: AxiosResponse): void => {
        console.log('begin axios get extend session');

        this.sessionExpirationTime = response.data.timeout;
        console.log('session expiration time is from request is ', this.sessionExpirationTime);
        this.restartCounters();
        this.closeModal();
      })
      .catch(e => {
        console.log('caught error in extend session request');
        console.log('error is ', e);
        this.removeListeners();
        this.stopCounters();
      });
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
