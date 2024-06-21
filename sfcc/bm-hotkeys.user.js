/**
 * 
// @name         SFCC BM Hotkeys
// @namespace    http://tampermonkey.net/
// @version      v2.0.0
// @description  Ensures the BM order search query builder is always the size of the current window - regardless of the number of columns in the search results table
// @author       You
// @match        https://*.demandware.net/on/demandware.store/Sites-Site
// @match        https://*.demandware.net/on/demandware.store/Sites-Site/*
// @match        https://*.demandware.net/on/demandware.store/Sites-Site?*
// @match        https://*.commercecloud.salesforce.com/on/demandware.store/Sites-Site
// @match        https://*.commercecloud.salesforce.com/on/demandware.store/Sites-Site/*
// @match        https://*.commercecloud.salesforce.com/on/demandware.store/Sites-Site?*
// @match        https://*.demandware.net/on/demandware.servlet/webdav/*
// @match        https://*.commercecloud.salesforce.com/on/demandware.servlet/*
// @require      file:///Users/miketay/Volumes/Tools/sfcc-tampermonkies/sfcc/bm-hotkeys.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.salesforce.com
// @grant        none
* 
*/

const ENABLE_CONSOLE = false;
const META_KEY = ["ctrlKey", "metaKey", "shiftKey", "altKey"];
// var META_KEY = false;

const META_CODES = ["Control", "Meta", "Alt", "Shift"];

const META_TAB_KEY = "altKey";
const INPUTS = [
    "form > div > input", //Jobs
    "#dw-search-10 > input", // preference group search
    "#dw-search-13 > input", // preference search
    "#OrderSearchForm2_SimpleSearchTerm", // order simple search
    "#holder > h1 > span.search-container > input", // impex file search
    "#WFSimpleSearch_NameOrID", // product simple search
    ".infobox_item .inputfield_en", // Metadata list - system object types attribute list search
    'input[name="WFURLRedirectSearch_SearchTerm"]', // url redirects input
];

const SELECTORS = {
    DWEASE: "span.dwithease.bm-toolbar-icon",
    DWEASE_SEARCH: "input.dw-search",
};

const IGNORE_TYPES = ["INPUT", "TEXTAREA", "SELECT"];

const log = (logged) => {
    if (ENABLE_CONSOLE) {
        console.log(logged);
    }
};
function redirect(ev, url) {
    if (ev[META_TAB_KEY]) {
        window.open(url, "_blank").focus();
    } else {
        window.location.href = url;
    }
}

const hotKeyPress = (ev) => {
    try {
        // Don't rewrite hotkeys or send to iframe if the active element is an input
        log(ev.target.tagName);
        if (
            ev &&
            ev.target &&
            IGNORE_TYPES.indexOf(ev.target.tagName) === -1 &&
            !ev.target.classList?.contains("ql-editor") &&
            !(META_CODES.indexOf(ev.code) !== -1) &&
            !(ev.ctrlKey || ev.metaKey || ev.shiftKey)
        ) {
            //             if (META_KEY?.length > 0) {
            //                 var r = META_KEY.every((meta) => {
            //                     log(ev)
            //                     log(`ev.hasOwnProperty: ${ev.hasOwnProperty(meta)}`);
            //                     log(`ev[meta]: ${ev[meta]}`);

            //                     if (ev.hasOwnProperty(meta)) {
            //                         log(ev[meta]);
            //                         // return ev[meta];
            //                     }
            //                     // return false;
            //                 });

            //                 log(`result ${r}`);

            //             }

            switch (ev.code) {
                case "KeyA":
                    redirect(
                        ev,
                        "/on/demandware.store/Sites-Site/default/AdminOrders-Start"
                    );
                    break;
                case "KeyO":
                    if (window.location.href.indexOf("ViewOrderList") === -1) {
                        redirect(
                            ev,
                            "/on/demandware.store/Sites-Site/default/ViewOrderList_52-Enter"
                        );
                    }
                    break;
                case "KeyC":
                    redirect(
                        ev,
                        "/on/demandware.store/Sites-Site/default/ViewApplication-BM?SelectedMenuItem=site-prefs&CurrentMenuItemId=site-prefs&screen=preference%23site_preference_groups"
                    );
                    break;
                case "KeyI":
                    redirect(ev, "/on/demandware.servlet/webdav/Sites/Impex");
                    break;
                case "KeyJ":
                    redirect(
                        ev,
                        "/on/demandware.store/Sites-Site/default/ViewApplication-BM?SelectedMenuItem=operations&CurrentMenuItemId=operations&screen=job&menuactionid=jobschedules"
                    );
                    break;
                case "KeyL":
                    redirect(ev, "/on/demandware.servlet/webdav/Sites/Logs");
                    break;
                case "KeyP":
                    redirect(
                        ev,
                        "/on/demandware.store/Sites-Site/default/ViewProductList_52-List"
                    );
                    break;
                case "KeyM":
                    redirect(
                        ev,
                        "/on/demandware.store/Sites-Site/default/ViewChannelList-ListAll"
                    );
                    break;
                case "KeyS":
                    redirect(
                        ev,
                        "/on/demandware.store/Sites-Site/default/Service-DisplayAll"
                    );
                    break;
                case "KeyD":
                    redirect(
                        ev,
                        "/on/demandware.store/Sites-Site/default/ViewStudioSetup-Start"
                    );
                    break;
                case "KeyT":
                    redirect(
                        ev,
                        "/on/demandware.store/Sites-Site/default/ViewSystemObjectTypeList-Start"
                    );
                    break;
                case "KeyQ":
                    var easy = document.querySelector(SELECTORS.DWEASE);
                    var easySearch = document.querySelector(
                        SELECTORS.DWEASE_SEARCH
                    );
                    var showing = !!easySearch.offsetParent;

                    if (easy) {
                        if (showing) {
                            easy.click();
                            easySearch.value = "";
                        } else {
                            easy.click();
                            easySearch.focus();
                        }
                    }

                    break;
                case "Digit1":
                case "Digit2":
                case "Digit3":
                case "Digit4":
                    document
                        .querySelector(
                            `#SelectedSiteID-wrap > span > span.sod_list_wrapper > span > span:nth-child(${
                                parseInt(ev.code.replace("Digit", "")) + 1
                            })`
                        )
                        .click();
                    break;
                case "Slash":
                    for (const selector of INPUTS) {
                        var searchBox = document.querySelector(selector);
                        if (searchBox && searchBox.type === "text") {
                            searchBox.focus();
                            ev.preventDefault();
                            break;
                        }
                    }
                    break;

                default:
                    // do nothing
                    break;
            }
        }
    } catch (e) {
        console.error(e);
    }
};
(function () {
    "use strict";
    window.addEventListener("keydown", hotKeyPress);
})();
