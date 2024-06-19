/**
 * 
// ==UserScript==
// @name         SFCC BM - system object type priority
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  try to take over the world!
// @author       You
// @match        https://*.commercecloud.salesforce.com/on/demandware.store/Sites-Site/default/ViewSystemObjectTypeList-Start*
// @match        https://*.demandware.net/on/demandware.store/Sites-Site/default/ViewSystemObjectTypeList-Start*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=salesforce.com
// @require      file:///Users/miketay/Volumes/Tools/sfcc-tampermonkies/sfcc/bm-system-obj-type-priority.user.js
// @grant        none
// ==/UserScript==
 * 
 */

(function () {
    "use strict";
    const S = "#bm_content_column table td.top > table:nth-child(6) > tbody";
    const T = ".table_detail_link";
    const P = ["SitePreferences", "Product", "Order"];

    var sys = document.querySelector(S);
    sys.firstElementChild.after(
        ...sys
            .childElements()
            .filter((el) => P.indexOf(el?.querySelector(T)?.innerHTML) !== -1)
    );
})();
