blissKom.controller("MainCtrl", function($scope, $firebase, glossFactory) { 
       // $scope.init().updateNavigationPage(2);
        $scope.greeting = "hello world!";
        $scope.items = {
            1: {
                name: '1',
                type: 'type1'
            },
            2: {
                name: '2',
                type: 'type2'
            },
            4: {
                name: '5',
                type: 'type4'
            }
        };
        $scope.updateNavigationPage = function(pageId) {
            if (pageId === 2) {
            switchStyleSheet(pageId);
            $scope.unitStyles = "#unit1 {width: 30%; height: 30%; left: 1%; top: 1%;}";

            $scope.glossUnits = [
                //new GlossUnit(
                glossFactory.createGlossUnit({
                    filename: 'hej.svg',
                    glossSubUnitsLeft: [new GlossSubUnit({ filename: 'vad.svg', comment: ''})], //valbart 
                    glossSubUnitsRight: [],
                    glossText: 'hej-blabla',
                    glossId: 12,
                    text: 'hej',
                    comment: ''
                }),
                //new GlossUnit(
                glossFactory.createGlossUnit({
                    filename: 'heta.svg',
                    glossSubUnitsLeft: [],
                    glossSubUnitsRight: [new GlossSubUnit({ filename: 'du.svg', comment: ''})],
                    glossText: 'heta-blabla',
                    glossId: 16,
                    text: 'heta',
                    comment: ''
                }),
               //new GlossUnit(
                glossFactory.createGlossUnit({
                    filename: 'heta.svg',
                    glossSubUnitsLeft: [],
                    glossSubUnitsRight: [new GlossSubUnit({ filename: 'du.svg', comment: ''})],
                    glossText: 'egen-heta-blabla',
                    glossId: 1039,
                    text: 'heta',
                    partOfSpeech: 'verb',
                    comment: 'kategori',
                    pageLinkUrl: 'some state'
                })];
            } else {
                $scope.glossUnits = [ glossFactory.createGlossUnit({filename: 'du.svg', glossSubUnitsLeft: [{filename: 'test.svg'}]}), glossFactory.createGlossUnit({filename: 'du.svg'}), glossFactory.createGlossUnit({filename: 'hej.svg'}) ];
            }
            
        };
        $scope.updateNavigationPage();
        $scope.testColor = "purple";
        
        var myBlissRef = new Firebase('https://incandescent-fire-1738.firebaseio.com/bliss');
        var auth = new FirebaseSimpleLogin(myBlissRef, function() {
            auth.createUser("test3@test.com", "test", function(error, user) {
                if (!error) {
                    console.log('User Id: ' + user.uid + ', Email: ' + user.email);
                } else {
                    console.log("creation failed");
                }
//                auth.login('password', {
//                    email: 'test@test.com',
//                    password: 'test'
//                });
                //auth.login('password', { email: 'test2@test.com', password: "test" });
                myBlissRef.once('value', function(dataSnapshot) {
                    $scope.mySnapShot = dataSnapshot;
                    $scope.blissObjects = $scope.mySnapShot.val();
                    localStorage.setItem('testObject3', JSON.stringify($scope.blissObjects));
                });
            });
        });
        //$scope.blissObjects = $firebase(myBlissRef);
    });


//flytta denna...
function switchStyleSheet(pageId) {
    var sheet = document.getElementById('pageStyle');
    if (sheet)
    {
        sheet.innerHTML = "";
        var unitStyles = getPageCssSettings(pageId);
        for (var i = 0; i < unitStyles.length; i++) {
            sheet.innerHTML += "#unit" + unitStyles[i].position + " {\n";
            sheet.innerHTML += "display: block;\nposition: absolute;\n";
            sheet.innerHTML += "left: " + unitStyles[i].left + "%;\n";        
            sheet.innerHTML += "top: " + unitStyles[i].top + "%;\n";     
            sheet.innerHTML += "width: " + unitStyles[i].width + "%;\n";     
            sheet.innerHTML += "height: " + unitStyles[i].height + "%;\n";  
            sheet.innerHTML += "background: red; border: 1px solid blue;\n";
            sheet.innerHTML += "}\n";
        }
    }
};

//flytta denna...
function getPageCssSettings(pageId) {
    var unitStyles = [];
    //lite testdata
    unitStyles.push({position: 1, width: 10, height: 10, left: 1, top: 1});
    unitStyles.push({position: 2, width: 10, height: 10, left: 11, top: 11});
    unitStyles.push({position: 3, width: 10, height: 10, left: 22, top: 22});
    unitStyles.push({position: 4, width: 10, height: 10, left: 33, top: 33});
    unitStyles.push({position: 5, width: 20, height: 20, left: 44, top: 44});
    return unitStyles;
}