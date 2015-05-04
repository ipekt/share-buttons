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
