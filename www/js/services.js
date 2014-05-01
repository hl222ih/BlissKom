blissKom.factory("glossFactory", function() {       
    //Constructor for GlossSubUnit objects.
    //If the inserted data object includes erronous properties, they will be neglected.
    //If the inserted data object lacks some properties, the corresponding properties
    //will become undefined.
    GlossSubUnit = function(data) {
        this.filename = data.filename;
        this.text = data.text;
        this.comment = data.comment;
    };

    //Constructor for GlossUnit objects.
    //If the inserted data object includes erronous properties, they will be neglected.
    //If the inserted data object lacks some properties, the corresponding properties
    //will be undefined.
    GlossUnit = function(data) {
        this.filename = data.filename;
        this.glossSubUnitsLeft = this.createArrayOfGlossSubUnits(data.glossSubUnitsLeft);
        this.glossSubUnitsRight = this.createArrayOfGlossSubUnits(data.glossSubUnitsRight);
        this.glossText = data.glossText;
        this.glossId = data.glossId;
        this.text = data.text;
        this.partOfSpeech = data.partOfSpeech;
        this.comment = data.comment;
        this.pageLinkUrl = data.pageLinkUrl;
        this.backgroundColor = data.backGroundColor ? data.backGroundColor : '#FFFFFF';
    };

    GlossUnit.prototype = {
        isPageLink: !!this.pageUrl, //returns true if pageUrl is truthy
        hasModifiedText: this.glossText !== this.text,
        createArrayOfGlossSubUnits: function(arrayData) {
            var glossSubUnits = [],
                i = 0;

            if (arrayData) {
                for (; i < arrayData.length ; i = i+1) {
                    glossSubUnits.push(new GlossSubUnit(arrayData[i]));
                }
            }
            return glossSubUnits;
        }
    };

    //factory's all functions
    return { 
        //testfunktion.
        createGlossUnit: function(data) { 
            return new GlossUnit(data); 
        }
    };
});
