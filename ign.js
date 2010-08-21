/*
    IGN Translator - Parses IGN articles and creates Zotero-based metadata
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

TARGET = "^http://.*\\.ign\\.com/";

PUB_TITLE = "IGN";
XPATH_TITLE = '//h1[@class="headline"]';
XPATH_PAGES = '//div[@class="ui-page-list clear"]/ul/li[last()-1]';
XPATH_DATE = '//h2[@class="publish-date"]/text()';
RE_DATE = /(.*)/;
XPATH_AUTHORS = '//div[@class="hdr-sub byline"]/a';
RE_AUTHORS = /(.*)/;

function detectWeb(doc, url) {
    if (url.match(/articles/))
        return "newspaperArticle";
}

function xpath_string(doc, xpath) {
    var res = doc.evaluate(xpath, doc, null, XPathResult.STRING_TYPE, null);
    if (!res || !res.stringValue)
        return null;
    return Zotero.Utilities.trim(res.stringValue);
}

function xpre(doc, xpath, reg) {
    var xpmatch = xpath_string(doc, xpath);
    return reg.exec(xpmatch)[1];
}

function scrape(doc, url) {
	var newItem = new Zotero.Item("newspaperArticle");
	newItem.publicationTitle = PUB_TITLE;
	newItem.url = doc.location.href;
    
    newItem.title = xpath_string(doc, XPATH_TITLE);
    newItem.pages = xpath_string(doc, XPATH_PAGES);
    newItem.date = xpre(doc, XPATH_DATE, RE_DATE);
    
    //authors
    var author_text = xpre(doc, XPATH_AUTHORS, RE_AUTHORS);
    var authors = [];
    if (author_text.indexOf(" and ") != -1)
        authors = author_text.split(" and ");
    else if (author_text.indexOf(";") != -1)
        authors = author_text.split(";");
    else
        authors.push(author_text);
    for (var i in authors)
        newItem.creators.push(Zotero.Utilities.cleanAuthor(authors[i], "author"));
    
    // attach html
    newItem.attachments.push({title:PUB_TITLE+" Snapshot", mimeType:"text/html", url:doc.location.href, snapshot:true});
    
    newItem.complete();
}

function doWeb(doc, url) {
	scrape(doc, url);
}