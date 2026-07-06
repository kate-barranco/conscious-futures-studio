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

  var year = new Date().getFullYear();

  placeholder.className = 'shared-footer';
  placeholder.innerHTML =
    '<div class="shared-footer-inner">' +
      '<a href="' + homeHref + '" class="shared-footer-logo"><img src="' + root + 'shared/assets/logo-white-full.png" alt="Conscious Futures"></a>' +
      '<ul class="shared-footer-links">' + linksHtml + '</ul>' +
      '<p class="shared-footer-copy">&copy; ' + year + ' Conscious Futures, LLC.</p>' +
    '</div>';
})();
