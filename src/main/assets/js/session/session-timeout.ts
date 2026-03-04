import axios, { AxiosResponse } from 'axios';
import moment from 'moment';

import { PageUrls, languages } from '../../../definitions/constants';
import * as i18nWelsh from '../../../resources/locales/cy/translation/template.json';
import * as i18n from '../../../resources/locales/en/translation/template.json';
import { focusToGovUKErrorDiv } from '../set-focus';

export default class SessionTimeout {
  public sessionExpirationTime: string;
  public sessionTimeoutCountdown: number;
  public bufferSessionExtension: number = 5 * 60 * 1000; //length of time modal will appear
  private sessionTimeout: number;
  private modalTimeout: number;
  private modalCountdown: number;
  private atTimerCountdown: number;
  private isLoggedIn: HTMLInputElement = null;
  private extendSessionElement: HTMLElement = null;
  private modalElement: HTMLElement = null;
  private modalOverlayElement: HTMLElement = null;
  private modalCountdownElement: HTMLElement = null;
  private srAnnouncerElement: HTMLElement = null;
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
    this.modalCountdownElement = document.querySelector('#timer');
    this.extendSessionElement = document.querySelector('#extend-session');
    this.srAnnouncerElement = document.querySelector('#sr-announcer');
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
      this.startModalCountdown();
      this.openModal();
    }, this.sessionTimeoutCountdown - (this.bufferSessionExtension + 1));
  };

  stopCounters = (): void => {
    clearTimeout(this.sessionTimeout);
    clearTimeout(this.modalTimeout);
    clearInterval(this.modalCountdown);
    clearInterval(this.atTimerCountdown);
  };

  resetModalMessage = (): void => {
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

  buildAtTimerMessage = (translations: typeof i18n, minutes: number): string => {
    return `${translations.sessionTimeout.modal.title}. ${translations.sessionTimeout.modal.body[0]} ${minutes} ${translations.sessionTimeout.modal.body[1]} ${translations.sessionTimeout.modal.instruction}`;
  };

  announceToScreenReader = (message: string): void => {
    // Clear the live region first, then set new content after a short delay.
    // This forces screen readers to detect a change and announce the updated message.
    this.srAnnouncerElement.textContent = '';
    window.setTimeout(() => {
      this.srAnnouncerElement.textContent = message;
    }, 200);
  };

  startModalCountdown = (): void => {
    let count = 0;
    let minutes = 5;
    let seconds = '00';
    const isWelsh = this.extendSessionElement.innerHTML.includes(i18nWelsh.sessionTimeout.modal.extend);
    const translations = isWelsh ? i18nWelsh : i18n;

    // Set the initial screen reader message on the dialog
    this.modalElement.setAttribute('aria-label', this.buildAtTimerMessage(translations, minutes));

    this.modalCountdown = window.setInterval(() => {
      minutes = moment.duration(this.bufferSessionExtension - count).minutes();
      seconds = moment
        .duration(this.bufferSessionExtension - count)
        .seconds()
        .toLocaleString('en-GB', { minimumIntegerDigits: 2 });
      this.modalCountdownElement.innerHTML = `${translations.sessionTimeout.modal.body[0]} ${minutes} ${translations.sessionTimeout.modal.minuteLabel} ${seconds} ${translations.sessionTimeout.modal.secondLabel}`;
      count += 1000;
    }, 1000);

    // Screen reader announces every minute to keep users informed
    this.atTimerCountdown = window.setInterval(() => {
      minutes = moment.duration(this.bufferSessionExtension - count).minutes();
      this.announceToScreenReader(this.buildAtTimerMessage(translations, minutes));
    }, 60000);
  };

  openModal = (): void => {
    this.modalElement.removeAttribute('aria-hidden');
    this.modalOverlayElement.removeAttribute('aria-hidden');
    this.previousFocusedElement = document.activeElement as HTMLElement;
    this.disableScroll();
    this.body.addEventListener('keydown', this.keyDownEventListener);
    // Delay focus to give Safari VoiceOver time to process aria-hidden removal
    window.setTimeout(() => {
      this.modalElement.focus();
    }, 100);
    // Also announce via live region as a fallback for Safari
    const ariaLabel = this.modalElement.getAttribute('aria-label');
    if (ariaLabel) {
      this.announceToScreenReader(ariaLabel);
    }
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
    let redirectUrl = PageUrls.HOME + languages.ENGLISH_URL_PARAMETER;
    if (this.extendSessionElement.innerHTML.includes(i18nWelsh.sessionTimeout.modal.extend)) {
      redirectUrl = PageUrls.HOME + languages.WELSH_URL_PARAMETER;
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
