const LIMIT = 6000

const days = ['.day2','.day3','.day4','.day5', '.day6'].values()
// const days = ['.day2'].values()

var textEvent = document.createEvent('TextEvent');
    

var keyboardEventDown = new KeyboardEvent(
    'keydown',
    {
        key: " ",
        keyCode: 32,
        code: "Space", 
        which: 32,
        shiftKey: false,
        ctrlKey: false,  
        metaKey: false 
    }
)
var keyboardEventUp = new KeyboardEvent(
    'keyup',
    {
        key: " ",
        keyCode: 32,
        code: "Space", 
        which: 32,
        shiftKey: false,
        ctrlKey: false,  
        metaKey: false 
    }
)


async function* fillerup (defaultRow) {
    while (true) {
        var { done, value } = days.next();
        if (done) { return };

        let box = defaultRow.find(`${value} input.entry-box`);
        box?.val((i, v) => v ? v : MY_TIME ).next().trigger('click');

        await autofill().then($buttons => $buttons.trigger('click'))
       
        await waitForRemoval('#location')
        yield value;
    }
}

  

const OPEN = ['edit-pencil','edit-box-link'];
const CLOSED = ['Leave', 'Update', 'Save'];

const waitForRemoval = (selector) => {
    var inter;
    var timeout = setTimeout(() => {
        if (inter) {
            clearInterval(inter)
        }
    }, LIMIT);

    return new Promise(resolve => {     
        inter = setInterval(() => {
            var $el = jQuery(selector);
            
            if (!$el?.length) {
                clearInterval(inter);
                clearTimeout(timeout);
                resolve(true);
            }
        }, 300);
    });
}

const waitFor = (selector, container) => { 
    var inter;
    var timeout = setTimeout(() => {
        if (inter) {
            clearInterval(inter)
        }
    }, LIMIT);

    return new Promise(resolve => {     
        inter = setInterval(() => {
            var $el = container 
            ? jQuery(container).find(selector)
            : jQuery(selector);
            
            if ($el?.length) {
                clearInterval(inter);
                clearTimeout(timeout);
                resolve($el);
            }

        }, 300);
    });
}

const blury = ($l) => $l.trigger('input').trigger('keydown').trigger('keyup').trigger('change.rails').trigger('blur').trigger('change').trigger('content-updated');

const autofill = async () => {
    var buttons = await waitFor('#location')
        .then($location => {
            $location.trigger('click.rails');
            waitFor(`#location-single-choice-listbox > li:contains("${MY_LOC}")`)
                .then($li => $li.trigger('click.rails'))
                .then(blury);
            return $location.change('change').trigger('blur');
        })
        .then(async () => {
            var time = await waitFor('#time')
                .then($time => $time.trigger('click')
                    .attr('value', (i, v) => (v && v !== '0h 0m') ? v : MY_TIME)
                    .val((i, v) => (v && v !== '0h 0m') ? v : MY_TIME)
                );
    
            var notes = await waitFor('#notes').then($notes => { 
                    $notes.trigger('click')
                    $notes.text((i, v) => v || MY_NOTE)
            
                    textEvent.initTextEvent(
                        'textInput',
                        true,
                        true,
                        document.defaultView, 
                        MY_NOTE
                      );
                    $notes.get(0).dispatchEvent(textEvent);

                    blury($notes)
                    
                    return $notes;
                });

        
            return jQuery('button[name="save"]');
        });

    buttons.prop('disabled', false).trigger('focus');

    return buttons;
}

const MY_CHOICES = (() => {
    var PROJECTS = {
        CHOICES: {},
        TASKS: {}
    };
    waitFor('input[type=select-one]')
        .then((input) => {
            input.trigger('click')

            waitFor('div.option', document.querySelector('div.selectize-dropdown-content'))
                .then(options => { 
                    options.each((i, opt) => {
                        PROJECTS.CHOICES[opt.getAttribute('data-value')] = opt.innerText;
                    });
                });
        });
    return PROJECTS;
})()

const cfg = new MonkeyConfig({
    title: "Timesheet Defaults",
    menuCommand: true,
    params: {
        MY_UPDATE_ALL: {
            label: 'Auto-update Week',
            type: 'custom',
            value: `<button id="update-full-week">Update All</button>`,
            // html: '',
            set: (value, container) => {
                jQuery(container).addClass('__MonkeyConfig_buttons').html(value).on('click', 'button', async (ev) => {
                    cfg.close();
                    var myProject = cfg.get('MY_PROJECT');
                    var defaultRow = jQuery(`[data-value="${myProject}"]`)?.parents('tr');

                    for await (const day of fillerup(defaultRow)) { 
                      console.log(day);
                    }
                });
            },
            get: () => {}
        },
        MY_PROJECT: {
            label: 'My Project',
            type: 'select',
            choices: MY_CHOICES.CHOICES
        },
        MY_LOC: {
            label: 'My Location',
            type: "text",
            default: 'New York'
        },
        MY_NOTE: {
            label: 'My Note',
            type: "text",
            long: true,
            default: ''
        },
        MY_TIME: {
            label: 'My Time',
            type: "text",
            default: '8h 0m'
        }
    }
});


const MY_LOC = cfg.get('MY_LOC');
const MY_TIME = cfg.get('MY_TIME');
const MY_NOTE = cfg.get('MY_NOTE');
const MY_UPDATE_ALL = cfg.get('MY_UPDATE_ALL');


(function () {
    "use strict";

    console.log(window);
    textEvent.initTextEvent(
        'textInput',
        true,
        true,
        null, 
        " "
      );

    // jQuery(window).on('click.rails', (e) => console.log('click.rails', e.target))

    waitFor('button.fill-in-from-previous-week-link').then((btn => btn.trigger('click')));


    jQuery('body').on('mousedown', 'span.edit-box-link', (ev) => {
        try {
        
            var prev = jQuery(ev.target).prev();
            if (prev?.hasClass('entry-box')) {
                prev.val((i, v) => v ? v : MY_TIME );
            }
    
            let { classList, innerText } = ev.target;
            if (OPEN.some(o => classList.contains(o))) {
                autofill();
            }
        } catch(e) {
            console.error(e);
        }
    })

})();

