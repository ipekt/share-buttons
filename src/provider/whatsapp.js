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
