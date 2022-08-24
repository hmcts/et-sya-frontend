const backLink: HTMLAnchorElement | null = document.querySelector('.govuk-back-link');
const bannerBackLink: HTMLAnchorElement | null = document.querySelector('.govuk-notification-banner__link');

if (backLink) {
  backLink.onclick = function (e) {
    e.preventDefault();
    history.go(-1);
  };
}

if (bannerBackLink) {
  bannerBackLink.onclick = function (e) {
    e.preventDefault();
    history.go(-1);
  };
}
