/**
// @name         Log Center hacks
// @namespace    http://tampermonkey.net/
// @version      v2.0.0
// @description  try to take over the world!
// @author       You
// @match        https://logcenter-us.visibility.commercecloud.salesforce.com/logcenter/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=salesforce.com
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.listValues
// @require      file:///Users/miketay/Volumes/Tools/sfcc-tampermonkies/sfcc/log-center-hacks.user.js
 */

/* GM */
(async () => {
    "use strict";

    const MAX = 400;
    const TOTALSTR =
        'text:("Job [Import-OrderStatus-v2] - Total order count: {0}")';

    var runCount = parseInt(await GM.getValue("runCount", 0));

    if (!runCount || runCount < MAX) {
        window.addEventListener("load", async (ev) => {
            var queryer = document.querySelector("#keywordQuery1");

            var currentSearch = queryer.innerHTML;
            var orderCountTotal = parseInt(
                currentSearch
                    .replace(
                        'text:("Job [Import-OrderStatus-v2] - Total order count: ',
                        ""
                    )
                    .replace('")', "")
            );
            var numberofHits = document.querySelector(
                "#pager-top > li > span > small > span:nth-child(3)"
            )?.innerHTML;

            console.log(`${runCount},${numberofHits}`);

            await GM.setValue(`${runCount}`, numberofHits);

            runCount++;
            await GM.setValue("runCount", `${runCount}`);

            queryer.innerHTML = TOTALSTR.replace("{0}", runCount?.toString());
            document.querySelector("#searchPageSearchBtn").click();
        });
    }
})();
