/* Shared navigation — single source of truth.
   Usage: <div id="site-nav-placeholder" data-theme="dark-bg" data-current="home"></div>
          <script src="shared/nav.js"></script> (path relative to each page's own depth)
   data-theme: "dark-bg" (light text, default) or "light-bg" (dark text)
   data-current: home | about | our-lens | portfolio | ideas | resources | contact */
(function () {
  var placeholder = document.getElementById('site-nav-placeholder');
  if (!placeholder) return;

  var scriptEl = document.currentScript;
  var root = scriptEl.getAttribute('src').replace(/shared\/nav\.js.*$/, '');
  var homeHref = root === '' ? './' : root;

  var theme = placeholder.getAttribute('data-theme') === 'light-bg' ? 'light-bg' : 'dark-bg';
  var current = (placeholder.getAttribute('data-current') || '').toLowerCase();
  var logo = theme === 'light-bg' ? 'logo-black-full.png' : 'logo-white-full.png';

  var links = [
    { label: 'Home', href: homeHref, key: 'home' },
    { label: 'About', href: root + 'about/', key: 'about' },
    { label: 'Our Lens', href: root + 'our-lens/', key: 'our-lens' },
    { label: 'Portfolio', href: root + 'portfolio/', key: 'portfolio' },
    { label: 'Ideas & Recognition', href: root + 'ideas/', key: 'ideas' },
    { label: 'Resource Library', href: root + 'resources/', key: 'resources' },
    { label: 'Contact', href: root + 'contact/', key: 'contact' }
  ];

  var linksHtml = links.map(function (l) {
    return '<li><a href="' + l.href + '"' + (l.key === current ? ' class="active"' : '') + '>' + l.label + '</a></li>';
  }).join('');

  placeholder.className = 'shared-nav ' + (theme === 'light-bg' ? 'shared-nav--light' : 'shared-nav--dark');
  placeholder.innerHTML =
    '<nav class="shared-nav-bar">' +
      '<a href="' + homeHref + '" class="shared-nav-logo"><img src="' + root + 'shared/assets/' + logo + '" alt="Conscious Futures"></a>' +
      '<button class="shared-nav-toggle" aria-label="Toggle menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '<ul class="shared-nav-links">' + linksHtml + '</ul>' +
    '</nav>';

  var bar = placeholder.querySelector('.shared-nav-bar');
  var toggle = placeholder.querySelector('.shared-nav-toggle');
  toggle.addEventListener('click', function () {
    var open = bar.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
