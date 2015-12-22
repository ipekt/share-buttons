(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*jslint browser: true*/
var Sharebuttons = require('./sharebuttons.js');

window.sharebuttons = new Sharebuttons();

window.sharebuttons.addProviders([
  require('./provider/facebookshare.js'),
  require('./provider/facebooklike.js'),
  require('./provider/mailto.js'),
  require('./provider/reddit.js'),
  require('./provider/sms.js'),
  require('./provider/stumbleupon.js'),
  require('./provider/twitter.js'),
  require('./provider/whatsapp.js'),
  require('./provider/googleplus.js')
]);

},{"./provider/facebooklike.js":2,"./provider/facebookshare.js":3,"./provider/mailto.js":4,"./provider/reddit.js":5,"./provider/sms.js":6,"./provider/stumbleupon.js":7,"./provider/twitter.js":8,"./provider/whatsapp.js":9,"./provider/googleplus.js":10,"./sharebuttons.js":12}],2:[function(require,module,exports){
var parseLink = require('../util/parselink.js'),
  JSONP = require('../util/jsonp.js');

module.exports = {
  id: 'facebooklike',

  neededBy: function (button) {
    var returnVal = false;
    if (button.href.indexOf('facebook.com/plugins/like') !== -1) {
      returnVal = true;
    }
    return returnVal;
  },

  fetchCount: function (button, callback) {
    JSONP.get('https://graph.facebook.com/fql', {
      q: decodeURIComponent('SELECT like_count FROM link_stat WHERE url="' + parseLink(button).params.href) + '"'
    }, function (result) {
      var total = 0;
      if (result && result.data && result.data[0]) {
        total = result.data[0].like_count || 0;
      }
      callback(total);
    });
  }
};

},{"../util/jsonp.js":13,"../util/parselink.js":15}],3:[function(require,module,exports){
var parseLink = require('../util/parselink.js'),
  JSONP = require('../util/jsonp.js');

module.exports = {
  id: 'facebookshare',

  neededBy: function (button) {
    var returnVal = false;
    if (button.href.indexOf('facebook.com/sharer/sharer') !== -1) {
      returnVal = true;
    }
    return returnVal;
  },

  fetchCount: function (button, callback) {
    JSONP.get('https://graph.facebook.com/fql', {
      q: decodeURIComponent('SELECT share_count FROM link_stat WHERE url="' + parseLink(button).params.u) + '"'
    }, function (result) {
      var total = 0;
      if (result && result.data && result.data[0]) {
        total = result.data[0].share_count || 0;
      }
      callback(total);
    });
  }
};

},{"../util/jsonp.js":13,"../util/parselink.js":15}],4:[function(require,module,exports){
module.exports = {
  id: 'mailto',

  options: {
    'newWindow': false
  },

  neededBy: function (button) {
    var returnVal = false;
    if (button.href.indexOf('mailto') !== -1) {
      returnVal = true;
    }
    return returnVal;
  }
};

},{}],5:[function(require,module,exports){
module.exports = {
  id: 'reddit'
};

},{}],6:[function(require,module,exports){
module.exports = {
  id: 'sms',

  neededBy: function (button) {
    var returnVal = false;
    if (button.href.indexOf('sms') !== -1) {
      returnVal = true;
    }
    return returnVal;
  }
};

},{}],7:[function(require,module,exports){
module.exports = {
  id: 'stumbleupon'
};

},{}],8:[function(require,module,exports){
var parseLink = require('../util/parselink.js'),
  JSONP = require('../util/jsonp.js');

module.exports = {
  id: 'twitter',
  fetchCount: function (button, callback) {
    JSONP.get('https://cdn.api.twitter.com/1/urls/count.json', {
      url: decodeURIComponent(parseLink(button).params.url)
    }, function (result) {
      callback(result.count);
    });
  }
};

},{"../util/jsonp.js":13,"../util/parselink.js":15}],9:[function(require,module,exports){
module.exports = {
  id: 'whatsapp',

  neededBy: function (button) {
    var returnVal = false;
    if (button.href.indexOf('whatsapp') !== -1) {
      returnVal = true;
    }
    return returnVal;
  }
};

},{}],10:[function(require,module,exports){
  module.exports = {
    id: 'googleplus',

    neededBy: function (button) {
      var returnVal = false;
      if (button.href.indexOf('plus.google.com/share') !== -1) {
        returnVal = true;
      }
      return returnVal;
    }
  };

},{}],11:[function(require,module,exports){
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

},{"./util/mergeobjects.js":14}],12:[function(require,module,exports){
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

},{"./sharebutton.js":11,"./util/jsonp.js":13,"./util/mergeobjects.js":14,"./util/urlvars.js":16}],13:[function(require,module,exports){
module.exports = (function () {
  var counter = 0,
    head,
    window = this,
    config = {};

  function load(url, pfnError) {
    var script = document.createElement('script'),
      done = false;
    script.src = url;
    script.async = true;

    var errorHandler = pfnError || config.error;
    if (typeof errorHandler === 'function') {
      script.onerror = function (ex) {
        errorHandler({
          url: url,
          event: ex
        });
      };
    }

    script.onload = script.onreadystatechange = function () {
      if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
        done = true;
        script.onload = script.onreadystatechange = null;
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      }
    };

    if (!head) {
      head = document.getElementsByTagName('head')[0];
    }
    head.appendChild(script);
  }

  function encode(str) {
    return encodeURIComponent(str);
  }

  function jsonp(url, params, callback, callbackName) {
    var query = (url || '').indexOf('?') === -1 ? '?' : '&',
      key;

    callbackName = (callbackName || config.callbackName || 'callback');
    var uniqueName = callbackName + "_json" + (++counter);

    params = params || {};
    for (key in params) {
      if (params.hasOwnProperty(key)) {
        query += encode(key) + "=" + encode(params[key]) + "&";
      }
    }

    window[uniqueName] = function (data) {
      callback(data);
      try {
        delete window[uniqueName];
      } catch (e) {

      }
      window[uniqueName] = null;
    };

    load(url + query + callbackName + '=' + uniqueName);
    return uniqueName;
  }

  function setDefaults(obj) {
    config = obj;
  }
  return {
    get: jsonp,
    init: setDefaults
  };
}());

},{}],14:[function(require,module,exports){
/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
module.exports = function (obj1, obj2) {
  var obj3 = {},
    attrname;
  for (attrname in obj1) {
    obj3[attrname] = obj1[attrname];
  }
  for (attrname in obj2) {
    obj3[attrname] = obj2[attrname];
  }
  return obj3;
};

},{}],15:[function(require,module,exports){
var urlvars = require('./urlvars.js');

module.exports = function (link) {
  return {
    host: link.hostname,
    href: link.href,
    params: urlvars(link.href)
  };
};

},{"./urlvars.js":16}],16:[function(require,module,exports){
module.exports = function (href) {
  var vars = [],
    hash,
    i,
    hashes = href.slice(href.indexOf('?') + 1).split('&');
  for (i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
};

},{}]},{},[1]);
