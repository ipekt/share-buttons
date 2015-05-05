/*jslint browser: true*/
/*global CustomEvent*/
var mergeobjects = require('./util/mergeobjects.js');

function bindEvent(buttonEl, provider, options) {
  if (buttonEl.addEventListener) {
    buttonEl.addEventListener('click', function (ev) {
      // if we're opening a new window then cancel default behaviour
      // but we'll let IE8 fallback to a default link
      if (options.newWindow === true && ev.preventDefault) {
        ev.preventDefault();
        ev.stopPropagation();
        window.open(ev.currentTarget.href, undefined, options.newWindowSettings);
      } // end if newWindow

      // if there's a callback for sharing trigger it with some data
      options.onShare({
        provider: provider ? provider.id : options.defaultProviderId
      });
    }, false);
  }
}

function updateDOM(buttonEl, provider, defaultoptions, useroptions) {
  var settings = defaultoptions || {}, countEl = buttonEl.querySelector(settings.countSelector);

  // merge in options set by provider 
  settings = mergeobjects(settings, provider.options);

  // merge in options set by user via initialisation
  settings = mergeobjects(settings, useroptions);

  // merge in options set by user via the element
  try {
    settings = mergeobjects(settings, JSON.parse(buttonEl.dataset.sharebutton));
  } catch (ignore) {}

  bindEvent(buttonEl, provider, settings);

  // only fetch the count if there's a DOM element for it to go in
  if (countEl) {
    provider.fetchCount(buttonEl, function (count) {
      // update the count element with the number
      countEl.innerHTML = count;
      buttonEl.className += ' ' + settings.loadedClass;

      settings.onFetch({
        'provider': provider,
        'count': count
      });
    });
  }
}

module.exports = {
  updateDOM: updateDOM
};
