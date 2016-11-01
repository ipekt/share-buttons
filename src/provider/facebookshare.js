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
    JSONP.get('https://graph.facebook.com/', {
      id: parseLink(button).params.u
    }, function (result) {
      callback(result.share.share_count);
    });
  }
};
