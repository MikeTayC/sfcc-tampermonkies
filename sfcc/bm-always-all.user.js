/** 
// @name         SFCC BM - Always all
// @namespace    http://tampermonkey.net/
// @version      v2.0.0
// @description  auto click "All" in search based modules
// @author       You
// @match        https://*.demandware.net/on/demandware.store/Sites-Site
// @match        https://*.demandware.net/on/demandware.store/Sites-Site/*
// @match        https://*.demandware.net/on/demandware.store/Sites-Site?*
// @match        https://*.commercecloud.salesforce.com/on/demandware.store/Sites-Site
// @match        https://*.commercecloud.salesforce.com/on/demandware.store/Sites-Site/*
// @match        https://*.commercecloud.salesforce.com/on/demandware.store/Sites-Site?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.salesforce.com
// @grant        none
// @require      file:///Users/miketay/Volumes/Tools/sfcc-tampermonkies/sfcc/bm-always-all.user.js
*/

(function () {
    "use strict";

    const NEVERALL = [
        "/on/demandware.store/Sites-Site/default/ViewOrderList_52-Dispatch",
        "/on/demandware.store/Sites-Site/default/ViewReplicationProcessList-List",
        "/on/demandware.store/Sites-Site/default/ViewReplicationProcessList-Dispatch",
        "/on/demandware.store/Sites-Site/default/ViewCodeReplicationProcessList-List",
        "/on/demandware.store/Sites-Site/default/ViewCodeReplicationProcessList-Dispatch",
    ];

    const alwaysAll = () => {
        if (NEVERALL.indexOf(window.location.pathname) === -1) {
            document.querySelectorAll("button").forEach((button) => {
                if (button.innerText === "All") {
                    button.click();
                }
            });
        }
    };

    alwaysAll();
})();
