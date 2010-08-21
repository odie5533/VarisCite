/*
    VarisCite - Zotero translator-based citation generation
    Copyright (C) 2010 odie5533

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

Zotero = function() {};
Zotero.Utilities = function() {};
Zotero.Utilities.cleanAuthor = function(author, type, useComma) {
    const allCapsRe = /^[A-Z\u0400-\u042f]+$/;
    
    if(typeof(author) != "string") {
        throw "cleanAuthor: author must be a string";
    }
    
    author = author.replace(/^[\s\.\,\/\[\]\:]+/, '');
    author = author.replace(/[\s\,\/\[\]\:\.]+$/, '');
    author = author.replace(/  +/, ' ');
    if(useComma) {
        // Add spaces between periods
        author = author.replace(/\.([^ ])/, ". $1");
        
        var splitNames = author.split(/, ?/);
        if(splitNames.length > 1) {
            var lastName = splitNames[0];
            var firstName = splitNames[1];
        } else {
            var lastName = author;
        }
    } else {
        var spaceIndex = author.lastIndexOf(" ");
        var lastName = author.substring(spaceIndex+1);
        var firstName = author.substring(0, spaceIndex);
    }
    
    if(firstName && allCapsRe.test(firstName) &&
            firstName.length < 4 &&
            (firstName.length == 1 || lastName.toUpperCase() != lastName)) {
        // first name is probably initials
        var newFirstName = "";
        for(var i=0; i<firstName.length; i++) {
            newFirstName += " "+firstName[i]+".";
        }
        firstName = newFirstName.substr(1);
    }
    
    return {firstName:firstName, lastName:lastName, creatorType:type};
}
Zotero.Utilities.trim = function(s) {
    s = s.replace(/^\s+/, "");
    return s.replace(/\s+$/, "");
}

Zotero.Item = function (type) {
    this.creators = [];
    this.attachments = [];
};

function vcInit() {
    // ensure the Zotero translator finished loading
    if (typeof(detectWeb) == 'undefined')
        return setTimeout(vcInit, 10);
    if (detectWeb(document, location.href)) {
        // here we could set custom handlers for .complete() calls
        Zotero.Item.prototype.complete = function () {
            chrome.extension.sendRequest(this);
        };
        doWeb(document, location.href);
    }
}
vcInit();
