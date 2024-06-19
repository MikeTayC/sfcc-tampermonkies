/**
 * 
// @name         SFCC BM Order Search resize
// @namespace    http://tampermonkey.net/
// @version      v2.0.0
// @description  Ensures the BM order search query builder is always the size of the current window - regardless of the number of columns in the search results table
// @author       You
// @match        https://*.demandware.net/on/demandware.store/Sites-Site/default/ViewOrderList_52*
// @match        https://*.commercecloud.salesforce.com/on/demandware.store/Sites-Site/default/ViewOrderList_52*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.salesforce.com
// @require      file:///Users/miketay/Volumes/Tools/sfcc-tampermonkies/sfcc/bm-ordersearch-resize.user.js
// @grant        none
* 
*/

(function () {
    "use strict";

    // Order Search table
    var orderSearch = [
        document.querySelector("#C"),
        document.querySelector("#D"),
        document.querySelector("#E"),
    ];

    // aligns the window width and order search query table
    function detectWidth(els) {
        els?.forEach((el) => {
            if (!el) return;
            var myWidth = 0;
            if (typeof window.innerWidth == "number") {
                myWidth = window.innerWidth;
            } else {
                myWidth = document.documentElement.clientWidth;
            }
            el.style.width = myWidth - 50 + "px";
        });
    }

    window.onload = function () {
        detectWidth(orderSearch);
    };
    window.onresize = function () {
        detectWidth(orderSearch);
    };
})();
