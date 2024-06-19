/**
// @name         SFCC - Impex convert KB to MB
// @namespace    http://tampermonkey.net/
// @version      v2.0.0
// @description  try to take over the world!
// @author       You
// @match        https://*.demandware.net/on/demandware.servlet/webdav/Sites/Impex*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=salesforce.com
// @grant        none
// @run-at       document-idle
// @require      file:///Users/miketay/Volumes/Tools/sfcc-tampermonkies/sfcc/webdav-size-conversation.user.js
*/

(function () {
    "use strict";

    var interval = setInterval(() => {
        var newUI = !!document.querySelector("#dwe-developer-console");

        var selector = newUI
            ? "span.dwe-tree-view__element__link__info--size.item-size"
            : "#filesTable > tbody > tr > td:nth-child(4)";

        var bytes = document.querySelectorAll(selector);

        if (bytes && bytes.length) {
            bytes.forEach(function (byte) {
                if (byte.innerText?.toUpperCase()?.indexOf("MB") === -1) {
                    if (!byte.style.display) {
                        byte.style.display = "grid";
                        byte.style.textAlign = newUI ? "center" : "right";
                    }

                    var firstText = byte.innerText;
                    var size = parseFloat(byte.innerText);
                    if (!isNaN(size)) {
                        byte.innerHTML = `
                            <tt>${(
                                size / (size >= 1000000 ? 1000000 : 1000)
                            ).toFixed(2)} MB</tt>
                            <tt style="font-size: 10px;">(${size} KB)</tt>
                        `;
                        // byte.firstChild.innerText = `(${size} KB)`;
                        // byte.firstChild.style.fontSize = '10px';

                        // var tt = document.createElement('tt');
                        // tt.innerText = `${(size / ((size >= 1000000) ? 1000000 : 1000)).toFixed(2)} MB`;
                        // byte.prepend(tt)
                    }
                }
            });
        }
    }, 500);

    setTimeout(() => {
        clearInterval(interval);
    }, 4000);

    //     // Your code here...
    //     // var impexItemSize = document.querySelector('#dwe-developer-console')
    //     //     ? 'span.dwe-tree-view__element__link__info--size.item-size'
    //     //     : '#filesTable > tbody > tr > td:nth-child(4)';

    // //     var impexItemSize = document.querySelector('#dwe-developer-console')
    // //         ? 'span.dwe-tree-view__element__link__info--size.item-size'
    // //         : '#filesTable > tbody';

    // //     waitForElementByMutant(impexItemSize, '', '', null).then(() ,=> {
    // //         // for good measure delay the click for a bit

    // //     }).catch((e) => {
    // //         console.error(e);
    // //     });

    // //     var interval = setInterval(() => {
    // //         console.log(document.querySelectorAll('#filesTable > tbody > tr > td:nth-child(4)').length);
    // //     }, 100);

    //     setTimeout(() => {
    //         // clearInterval(interval)
    //         var bytes = document.querySelectorAll('#filesTable > tbody > tr > td:nth-child(4)')
    //         console.log(bytes)
    //         if (bytes && bytes.length) {
    //             console.log(bytes.length)
    //             bytes.forEach( function(byte){
    //                 if (byte.innerText?.toUpperCase()?.indexOf('KB') !== -1) {
    //                     var size = parseFloat(byte.innerText);
    //                     console.log(size)
    //                     if (!isNaN(size)) {
    //                         byte.innerText = (size / 1000).toFixed(2) + 'MB';
    //                         console.log(byte.innerText)
    //                     }
    //                 }
    //             });
    //         }
    //     }, 500)

    // //     var bytes = document.querySelectorAll('#filesTable > tbody > tr > td:nth-child(4)')
    // //     console.log(bytes)

    // //     if (bytes && bytes.length) {
    // //         console.log(bytes.length)
    // //         bytes.forEach( function(byte){
    // //             if (byte.innerText?.toUpperCase()?.indexOf('KB') !== -1) {
    // //                 var size = parseFloat(byte.innerText);
    // //                 console.log(size)
    // //                 if (!isNaN(size)) {
    // //                     byte.innerText = (size / 1000).toFixed(2) + 'MB';
    // //                     console.log(byte.innerText)
    // //                 }
    // //             }
    // //         });
    // //     }

    //     // function logChanges(records, observer) {
    //     //     for (const record of records) {
    //     //         for (const addedNode of record.addedNodes) {
    //     //             log.textContent = `Added: ${addedNode.textContent}\n${log.textContent}`;
    //     //         }
    //     //         for (const removedNode of record.removedNodes) {
    //     //             log.textContent = `Removed: ${removedNode.textContent}\n${log.textContent}`;
    //     //         }
    //     //         if (record.target.childNodes.length === 0) {
    //     //             log.textContent = `Disconnected\n${log.textContent}`;
    //     //             observer.disconnect();
    //     //         }
    //     //         console.log(record.target.childNodes.length);
    //     //     }
    //     // }

    //     var impexItem = document.querySelector(
    //         document.querySelector('#dwe-developer-console')
    //             ? '.dev-console__main__directories-list'
    //             : 'table'
    //         );

    //     setTimeout(()=> {

    //     }, 500)

    //     const observer = new MutationObserver(records => {
    //         records.forEach(record => record.addedNodes.forEach(addedNode => {
    //             console.log(addedNode);
    //         }));
    //     });

    //     console.log(impexItem)
    //     observer.observe(impexItem, { childList: true });

    //     setTimeout(() => {
    //     observer.disconnect();
    // }, 10000);
})();
