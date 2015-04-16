/*jslint browser: true*/
var Sharebuttons = require('./sharebuttons.js');

window.sharebuttons = new Sharebuttons();

sharebuttons.addProviders([
  require('./provider/facebook.js'),
  require('./provider/twitter.js'),
  require('./provider/stumbleupon.js'),
  require('./provider/reddit.js')
]);
