/**
 * 
// @name         SFCC BM - Order Text Wrap and Styles
// @namespace    http://tampermonkey.net/
// @version      v2.0.0
// @description  Cleans up the BM order view - Payment section is styled and JSON is wrapped in code pretty print; LC Custom Order History is numbered insted of pipe seperated and code is pretty print styled
// @author       You
// @match        https://*.demandware.net/on/demandware.store/Sites-Site/default/ViewOrder_52-Dispatch?OrderID*
// @match        https://*.demandware.net/on/demandware.store/Sites-Site/default/ViewOrderHistory_52-ViewHistory?*
// @match        https://*.commercecloud.salesforce.com/on/demandware.store/Sites-Site/default/ViewOrder_52-Dispatch?OrderID*
// @match        https://*.commercecloud.salesforce.com/on/demandware.store/Sites-Site/default/ViewOrderHistory_52-ViewHistory?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.salesforce.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.15.1/beautify.min.js
// @require      https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.5.1/build/highlight.min.js
// @resource     IMPORTED_CSS https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/night-owl.min.css
// @require      file:///Users/miketay/Volumes/Tools/sfcc-tampermonkies/sfcc/bm-order-styling.user.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
*/

/* global js_beautify hljs */

// document finders - not sure if these are going to change in the future
const paymentElSelect = ".infobox_item.top.s > table > tbody > tr > td";
const historyElSelect = "table > tbody > tr > .table_detail.s:not(.e)";

// wraps code in pre and styles them a bit cleanre
// const codeStyles = "background:#eee;border:1px solid #ddd;border-left:3px solid #f36d33;page-break-inside:avoid;font-family:monospace;font-size:15px;line-height:1.6;margin-bottom:1.6em;max-width:100%;overflow:auto;padding:1em 1.5em;display:block;word-wrap:break-word;text-wrap:wrap;overflow-wrap:anywhere";
const codeStyles = "";
const preWrap = (html) => {
    return `<pre class="customCodeStyle" style="${codeStyles}">${html}</pre>`;
};

// html string wrappers
const nameWrap = (html) => {
    return `<p style="display:inline-block;font-weight:bold">${html}</p>`;
};
const inlineWrap = (html) => {
    return `<p style="display:inline-block">${html}</p>`;
};
const simpleDivWrap = (html) => {
    return `<div>${html}</div>`;
};

(function () {
    "use strict";

    // Themes can be found here: https://cdnjs.com/libraries/highlight.js
    var theme = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(theme);

    // Cleans Payment section up - no more side scrolling to get to the billing address
    var paymentEl = document.querySelector(paymentElSelect);
    if (paymentEl) {
        var innerhtml = paymentEl.innerHTML;
        var brs = innerhtml.split("<br>");

        var newbr = brs
            .map((br, index) => {
                if (!index) {
                    // this is the payment method type so making it bigger
                    return `<h4 style="font-weight:bold">${br}</h4>`;
                }

                // making the attr name bold and wrapping JSON in code styles
                var split = br.indexOf(":") + 1;
                var attrName = br.substring(0, split);
                var attrValue =
                    br.indexOf("{") !== -1
                        ? preWrap(
                              br
                                  .substring(split)
                                  .trim()
                                  .replace(/&nbsp;/g, "")
                          )
                        : inlineWrap(br.substring(split));

                return simpleDivWrap(`${nameWrap(attrName)} ${attrValue}`);
            })
            .join("");
        paymentEl.innerHTML = newbr;
    }

    // LC custom order history is cleaned up, no more pipes, json is wrapped in code styles
    var historyEls = document.querySelectorAll(historyElSelect);
    if (historyEls) {
        historyEls.forEach((el) => {
            var innerhtml = el.innerHTML;
            if (innerhtml.indexOf("|") !== -1) {
                // For order history logs separated by pipes
                var brokenHistory = innerhtml.split("|");
                var newHistory = brokenHistory
                    .map((history, index) => {
                        if (index) {
                            var historyJson = "";
                            var historyDescription;
                            if (history.indexOf("{") !== -1) {
                                var split = history.indexOf("{");
                                historyDescription = history.substring(
                                    0,
                                    split
                                );
                                historyJson = preWrap(
                                    history
                                        .substring(split)
                                        .trim()
                                        .replace(/&nbsp;/g, "")
                                );
                            }

                            return simpleDivWrap(
                                `${index}. ${
                                    historyDescription ?? history
                                }${historyJson}`
                            );
                        }
                    })
                    .join("");

                el.innerHTML = newHistory;
            } else if (innerhtml.indexOf("{") !== -1) {
                // for order history logs that don't use pipes

                var split = innerhtml.indexOf("{");
                var description = innerhtml.substring(0, split).trim();
                var codeJson = preWrap(
                    innerhtml
                        .substring(split)
                        .trim()
                        .replace(/&nbsp;/g, "")
                );

                el.innerHTML = simpleDivWrap(`${description}${codeJson}`);
            }
        });
    }

    // pretty up the pre code styles this works better than any other method I tried - it also removes \ slashes
    var allCustomPre = document.querySelectorAll(".customCodeStyle");
    if (allCustomPre) {
        allCustomPre.forEach((pre) => {
            // old way - using beautifier.io now
            // var inner = pre.innerHTML;
            // var jsoninner = JSON.parse(inner);
            // pre.innerHTML = JSON.stringify(jsoninner, null, 2).replace(/\\/g, '');

            const options = { indent_size: 4, space_in_empty_paren: true };
            pre.innerHTML = js_beautify(pre.innerText, options);

            hljs.highlightBlock(pre);
        });
    }
})();
