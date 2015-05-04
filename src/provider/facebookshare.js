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
