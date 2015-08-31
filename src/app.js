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
  require('./provider/whatsapp.js')
]);
