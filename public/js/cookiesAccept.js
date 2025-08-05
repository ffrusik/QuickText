window.addEventListener('DOMContentLoaded', function () {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');

  if (!document.cookie.includes('cookiesAccepted=true')) {
    banner.classList.add('visible'); // show banner with animation
  }

  acceptBtn.addEventListener('click', function () {
    // Store the cookie
    document.cookie = 'cookiesAccepted=true; max-age=' + 60 * 60 * 24 * 365 + '; path=/';
    banner.classList.remove('visible'); // hide the banner
  });
});