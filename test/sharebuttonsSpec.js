/*global describe, it, expect, beforeEach, afterEach*/
var Sharebuttons = require('../src/sharebuttons.js'), sharebuttons = new Sharebuttons();

sharebuttons.addProviders([
  require('../src/provider/example.js')
]);

describe('sharebuttons', function () {
  var body = document.getElementsByTagName('body')[0],
    elem,
    countEl,
    linkEl,
    template = '<a data-sharebutton href="http://www.example.com">My Link <span data-sharecount>Not Loaded</span></a>';

  beforeEach(function () {
    // create element to hold the links
    elem = document.createElement('div');
    elem.innerHTML = template;

    // append the template to the body
    body.appendChild(elem);

    // find the element that will get the counter
    countEl = elem.querySelector('[data-sharecount]');
    linkEl = elem.querySelector('[data-sharebutton]');
  });

  afterEach(function () {
    linkEl.removeEventListener('shareCountLoaded');
    body.removeChild(elem);
  });

  it('should update counter with a number', function (done) {
    sharebuttons.updateSettings({
      'onFetch': function () {
        expect(countEl.innerText).not.toBe('Not Loaded');
        done();
      }
    });
    sharebuttons.init();
  });

  it('should include the name of the provider when used', function (done) {

    // set up and event to simulate a mouse click
    var myEvt = document.createEvent('MouseEvents');
    myEvt.initEvent('click');

    sharebuttons.updateSettings({
      'onShare': function (result) {
        result = result || {};
        expect(result.provider).toBe('example');
        done();
      }
    });

    // initialise sharebuttons
    sharebuttons.init();

    // simulate a click
    linkEl.dispatchEvent(myEvt);
  });
});
