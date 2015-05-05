/*jslint browser: true*/
var mergeobjects = require('./util/mergeobjects.js'),
  updateDOM = require('./sharebutton.js').updateDOM;

var Sharebuttons = function (options) {
  this.userOptions = options;
  this.settings = mergeobjects(this.defaults, options || {});
  this.providers = [];
};

Sharebuttons.prototype = {

  defaults: {
    'selector': '[data-sharebutton]', // default selector to use to get the links
    'loadedClass': 'is-loaded', // class applied to the share button once the count is fetched
    'countSelector': '[data-sharecount]', // selector for the child element that contains the count number
    'newWindow': true, // determines whether a new window should be opened
    'newWindowSettings': 'width=520,height=420,resizable=yes,scrollbars=yes', // settings passed to window.open
    'defaultProviderId': 'unknown', // if there is no provider plugin, the ID will default to this
    'onShare': function () { return; }, // This callback is dispatched after a share button is clicked on
    'onFetch': function () { return; }
  },

  init: function () {
    this.prepButtons(document.querySelectorAll(this.settings.selector), this.providers);
    return this;
  },

  updateSettings: function (options) {
    this.userOptions = mergeobjects(this.userOptions, options || {});
    this.settings = mergeobjects(this.settings, options || {});
  },

  addProviders: function (providers) {
    var i;
    for (i = 0; i < providers.length; i = i + 1) {
      this.providers.push(providers[i]);
    }
  },

  jsonp: require('./util/jsonp.js'),

  urlParams: require('./util/urlvars.js'),

  prepButtons: function (buttons, providers) {
    var i;
    // loop through buttons and update the DOM with provider info
    for (i = 0; i < buttons.length; i = i + 1) {
      updateDOM(buttons[i], this.findProvider(buttons[i], providers), this.settings, this.userOptions);
    }
  },

  findProvider: function (button, providers) {
    var i, validProvider;

    // loop through the providers and see if the button matches any of them
    for (i = 0; i < providers.length; i = i + 1) {

      // if the provider has a neededBy method, use that to determine if the provider is needed on this button
      // if that fails, fall back onto the standard way of checking
      if ((providers[i].neededBy && providers[i].neededBy(button)) || (providers[i].id && this.basicProviderVerification(button, providers[i].id))) {
        validProvider = providers[i];
      }
    }
    return validProvider;
  },

  basicProviderVerification: function (button, id) {
    var returnVal = false;
    if (button.hostname.indexOf(id) !== -1) {
      returnVal = true;
    }
    return returnVal;
  }
};

module.exports = Sharebuttons;
