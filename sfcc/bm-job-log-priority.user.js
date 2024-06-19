/***
// @name         SFCC BM - Job Logs Default Sort
// @namespace    http://tampermonkey.net/
// @version      v2.0.0
// @description  default sort should be last modified
// @author       You
// @match        https://*.commercecloud.salesforce.com/on/demandware.store/Sites-Site/default/ViewStudioSetup-OpenFolder*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=salesforce.com
// @grant        none
// @run-at       document-start
// @require      file:///Users/miketay/Volumes/Tools/sfcc-tampermonkies/sfcc/bm-job-log-priority.user.js
 */

(function () {
    "use strict";
    const SORT_BY = "SortBy";
    const DEFAULT = "last_modified_desc";

    var url = new URL(window.location.href);

    var params = new URLSearchParams(url.search);

    if (!params.has("SortBy")) {
        params.set(SORT_BY, DEFAULT);
        url.search = params.toString();
        window.location.replace(url);
    }
})();
