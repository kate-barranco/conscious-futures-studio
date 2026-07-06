/* Shared footer — single source of truth.
   Usage: <div id="site-footer-placeholder"></div>
          <script src="shared/footer.js"></script> (path relative to each page's own depth) */
(function () {
  var placeholder = document.getElementById('site-footer-placeholder');
  if (!placeholder) return;

  var scriptEl = document.currentScript;
  var root = scriptEl.getAttribute('src').replace(/shared\/footer\.js.*$/, '');
  var homeHref = root === '' ? './' : root;

  var links = [
    { label: 'Home', href: homeHref },
    { label: 'About', href: root + 'about/' },
    { label: 'Our Lens', href: root + 'our-lens/' },
    { label: 'Portfolio', href: root + 'portfolio/' },
    { label: 'Ideas & Recognition', href: root + 'ideas/' },
    { label: 'Resource Library', href: root + 'resources/' },
    { label: 'Contact', href: root + 'contact/' }
  ];

  var linksHtml = links.map(function (l) {
    return '<li><a href="' + l.href + '">' + l.label + '</a></li>';
  }).join('');

  var socials = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/conscious-futures-studio/', icon: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>' }
  ];

  var socialsHtml = socials.map(function (s) {
    return '<a href="' + s.href + '" class="shared-footer-social" target="_blank" rel="noopener" aria-label="' + s.label + '">' + s.icon + '</a>';
  }).join('');

  var year = new Date().getFullYear();

  placeholder.className = 'shared-footer';
  placeholder.innerHTML =
    '<div class="shared-footer-inner">' +
      '<a href="' + homeHref + '" class="shared-footer-logo"><img src="' + root + 'shared/assets/logo-white-full.png" alt="Conscious Futures"></a>' +
      '<ul class="shared-footer-links">' + linksHtml + '</ul>' +
      '<div class="shared-footer-socials">' + socialsHtml + '</div>' +
      '<p class="shared-footer-copy">&copy; ' + year + ' Conscious Futures, LLC.</p>' +
    '</div>';
})();
