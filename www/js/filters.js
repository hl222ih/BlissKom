blissKom.filter('stringToArray', function() {
    return function(myString) {
        //return myString.match(/(.*?)(?:, ?|$)/g);
        var myArray = [];
        if (myString) {
            myArray = myString.split(/, ?/);
        }
        return myArray;
    };
});