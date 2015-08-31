/*global describe, it, expect, beforeEach, afterEach*/
var Sharebuttons = require('../src/sharebuttons.js'),
  sharebuttons = new Sharebuttons();

sharebuttons.addProviders([
  require('../src/provider/facebookshare.js'),
  require('../src/provider/facebooklike.js'),
  require('../src/provider/mailto.js'),
  require('../src/provider/reddit.js'),
  require('../src/provider/sms.js'),
  require('../src/provider/stumbleupon.js'),
  require('../src/provider/twitter.js'),
  require('../src/provider/whatsapp.js')
]);

describe('sharebuttons', function () {
  var body = document.getElementsByTagName('body')[0], createElement, clickElement, testSharebutton;

  createElement = function (href) {
    var el = document.createElement('a');

    el.href = href;
    el.setAttribute('data-sharebutton', 'data-sharebutton');

    return el;
  };

  clickElement = function (el) {
    // set up and event to simulate a mouse click
    var myEvt = document.createEvent('MouseEvents');
    myEvt.initEvent('click');

    // simulate a click
    el.dispatchEvent(myEvt);
  };

  testSharebutton = function (name, url, cb) {
    var el = createElement(url);

    body.appendChild(el);

    sharebuttons.updateSettings({
      'onShare': function (result) {
        expect(result.provider).toBe(name);
        body.removeChild(el);
        cb();
      }
    });

    // initialise sharebuttons
    sharebuttons.init();
    clickElement(el);
  };

  // facebook like
  it('should return result of facebooklike with facebook like URL', function (done) {
    testSharebutton('facebooklike', 'https://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.finder.com.au', function () {
      done();
    });
  });

  // facebook share
  it('should return result of facebookshare with facebook share URL', function (done) {
    testSharebutton('facebookshare', 'https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.finder.com.au', function () {
      done();
    });
  });

  // mailto
  it('should return result of mailto with a mailto URL', function (done) {
    testSharebutton('mailto', 'mailto:someone@somewhere.com', function () {
      done();
    });
  });

  // reddit
  it('should return result of reddit with a reddit URL', function (done) {
    testSharebutton('reddit', 'http://www.reddit.com/submit?url=http%3A%2F%2Fwww.finder.com.au&amp;title=Finder', function () {
      done();
    });
  });

  // sms
  it('should return result of sms with a sms URL', function (done) {
    testSharebutton('sms', 'sms://', function () {
      done();
    });
  });

  // twitter
  it('should return result of twitter with a twitter URL', function (done) {
    testSharebutton('twitter', 'https://twitter.com/intent/tweet?text=Twitter%20Text&amp;url=http%3A%2F%2Fwww.finder.com.au%2F&amp;via=findercomau&amp;original_referer=', function () {
      done();
    });
  });

  // whatsapp
  it('should return result of whatsapp with a whats app URL', function (done) {
    testSharebutton('whatsapp', 'whatsapp://send?text=hiya', function () {
      done();
    });
  });
});
