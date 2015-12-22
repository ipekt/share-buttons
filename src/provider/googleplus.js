module.exports = {
    id: 'googleplus',

    neededBy: function (button) {
        var returnVal = false;
        if (button.href.indexOf('plus.google.com/share') !== -1) {
            returnVal = true;
        }
        return returnVal;
    }
};
