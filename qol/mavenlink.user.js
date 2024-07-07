const waitFor = (selector) => { 
    return new Promise(resolve => {     
        var inter = setInterval(() => {
            var $el = jQuery(selector);
            if ($el?.length) {
                clearInterval(inter)
                resolve($el)
            }

        }, 300);
    });
}

const MY_LOC = 'New York';
const MY_TIME = '8h 0m';
const MY_NOTE =`- jira;slack;email; general Q&A
- Environment Maintenance
- PR review and Deployments
- Documentation
- Reviewing and triaging current/new issues
- Production monitoring
- Reviewing Logs and Building Backlog
- assisting after.sale with ocapi setup
- assisting LC IT with ocapi setup
- manual capture/order search business extension
-5.3.0 release  management`


const OPEN = ['edit-pencil','edit-box-link'];
const CLOSED = ['Leave', 'Update', 'Save'];
(function () {
    "use strict";
    jQuery(window).on('mouseup', (ev) => {
        try {
            var { classList, innerText } = ev.target;
            if (OPEN.some(o => classList.contains(o))) {
                // wait for modal and lightbox.find('#location'));
                waitFor('#location').then($location => {
                    $location.trigger('click');
                    waitFor(`#location-single-choice-listbox > li:contains("${MY_LOC}")`)
                        .then($li => $li.trigger('click'));
                });
                    
                waitFor('#notes').then($notes => $notes.val(MY_NOTE));
                waitFor('#time').then($time => $time.val(MY_TIME))
            } else if (CLOSED.indexOf(innerText) > -1){
                console.log('Close Form')
            } 
        } catch(e) {
            console.error(e);
        }
    })

})();
