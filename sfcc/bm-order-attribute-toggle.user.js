/**
* 
* // ==UserScript==
* // @name         BM order details - toggle custom attribute groups
* // @namespace    http://tampermonkey.net/
* // @version      2024-08-10
* // @description  try to take over the world!
* // @author       You
* // @match        https://development-na01-lecreuset.demandware.net/on/demandware.store/Sites-Site/default/ViewOrderAttributes_52-Start?OrderID=85c010a18e17c84df6fec27c11&csrf_token=leAhOAMWw6XqWDUsczi-gO-uoVdFJAfIFGxjlBebx02jfN4P4lv7Lr46aGlFoT4mNe6RweKAdMMiNk7PBsBSxjNgT0k-KY5hAWVODtyKH7KLVSlnCtwc7zn_-R82THLVTyiZ8qvv35a5Gf94BHZoAJuwd2e4J_ExU22hNZ7eKjtw__B1yp8=
* // @icon         https://www.google.com/s2/favicons?sz=64&domain=demandware.net
* // @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.0/jquery-ui.min.js
* // @resource     IMPORTED_CSS https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.14.0/themes/blitzer/jquery-ui.min.css
* // @grant        GM_getResourceText
* // @grant        GM_addStyle
* // @icon         https://www.google.com/s2/favicons?sz=64&domain=www.salesforce.com
* // @require      file:///Users/miketay/Volumes/Tools/sfcc-tampermonkies/sfcc/bm-order-attribute-toggle.user.js
* // ==/UserScript==
**/

(function() {
    'use strict';

    var theme = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(theme);
    const SHOW = [
        'Order Status',
        'AdyenPayments',
        'Payment and Partials'
    ]

    const SPAN_HIDE = '<span class="hidden-dragon">⛛ </span>'
    const SPAN_SHOW = '<span class="crouching-tiger">▶ </span>'


    var $tds = jQuery('td.table_header.aldi');

    $tds.each((i, td) => console.log(i, SHOW.indexOf(td.innerText)))

    $tds.on('click', ev => {
        var $td = jQuery(ev.target);
        var $tr = $td.parent();
        if ($tr.nextUntil('input').toggle().is(':visible')) {
            $td.children('span').replaceWith(SPAN_HIDE)
        } else {
            $td.children('span').replaceWith(SPAN_SHOW)
        }
    });


   $tds.each((i, td) => {
       let $td = jQuery(td)
       if (SHOW.indexOf($td.text()) === -1) {
           $td.prepend(SPAN_HIDE)
           $td.click();
       } else {
           $td.prepend(SPAN_HIDE);
       }
    })
})();