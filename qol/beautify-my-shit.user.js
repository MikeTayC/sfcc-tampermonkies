/* global js_beautify hljs */

(function () {
    "use strict";

    const options = {
        indent_size: 2,
        space_in_empty_paren: true,
        wrap_line_length: 100,
    };

    // Themes can be found here: https://cdnjs.com/libraries/highlight.js
    var theme = GM_getResourceText("IMPORTED_CSS");
    GM_addStyle(theme);

    // Your code here...
    var pre = document.querySelector("pre");
    if (pre && pre.innerText) {
        // clone node and assign ugly/pretty
        // var prettyPre = pre.cloneNode(true);
        var prettyPre = document.createElement("pre");

        pre.id = "ugly";
        prettyPre.id = "pretty";

        prettyPre.innerHTML = `<code>${js_beautify(
            pre.innerText,
            options
        )}</code>`;

        // init un/prettier link
        var a = document.createElement("a");
        a.class = "tooPretty";
        a.href = "#";
        a.innerText = "Unpretty please!";

        a.onclick = (event) => {
            var pre = document.querySelector("#ugly");
            var prettyPre = document.querySelector("#pretty");
            switch (event.target?.class) {
                case "tooPretty":
                    pre.hidden = false;
                    prettyPre.hidden = true;

                    event.target.innerText = "Pretty please!";
                    event.target.class = "toPretty";
                    break;
                case "toPretty":
                default:
                    pre.hidden = true;
                    prettyPre.hidden = false;
                    event.target.innerText = "Unpretty please!";
                    event.target.class = "tooPretty";
                    break;
            }
        };

        hljs.highlightBlock(pre);
        hljs.highlightBlock(prettyPre);

        pre.insertAdjacentElement("beforebegin", a);
        pre.insertAdjacentElement("beforebegin", prettyPre);

        // hide ugly pre on initial load.
        pre.hidden = true;
    }
})();
