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
