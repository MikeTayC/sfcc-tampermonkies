/**
// @name         ActMgr little helpers
// @namespace    http://tampermonkey.net/
// @version      v2.0.0
// @description  Save state when using dropdowns and such; push my account to the front of the line on /UserAdmin; auto select client on /APIAdmin
// @author       You
// @match        https://account.demandware.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=demandware.com
// @grant        none
// @require      file:///Users/miketay/Volumes/Tools/sfcc-tampermonkies/sfcc/actmgr-lil-helps.user.js
*/

(function () {
    "use strict";
    const ME = "michael.tay@blueacornici.com";
    const MEQ = `[title="${ME}"]`;
    const TRQ = "#organizationUsers > table > tbody > tr:nth-child(1)";
    const CID = "b9795956-677b-435a-8851-b09e109a7f79";
    const CIDQ = `option[value="${CID}"]`;

    const USER_ADMIN = "/UserAdmin";
    const API_ADMIN = "/APIAdmin";

    // Your code here...
    if (window.history) {
        var myOldUrl = window.location.href;
        window.addEventListener("hashchange", function () {
            window.history.replaceState({}, null, myOldUrl);
        });
    }

    if (window.location.pathname?.indexOf(USER_ADMIN) !== -1) {
        var m = document.querySelector(MEQ)?.closest("tr")?.cloneNode(true);
        if (m) {
            console.log(
                `${USER_ADMIN} helper - Pushing user to top of the list`
            );

            var trq = document.querySelector(TRQ)?.closest("tr")?.before(m);
        }
    } else if (window.location.pathname?.indexOf(API_ADMIN) !== -1) {
        if (!window.location.search) {
            var o = document.querySelector(CIDQ);
            if (o && !o.selected) {
                console.log(
                    `${API_ADMIN} helper - preselecting favorite client on first load`
                );

                o.selected = true;
                window.filterListPage();
            }
        }
    }
})();
