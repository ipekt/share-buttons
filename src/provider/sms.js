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
