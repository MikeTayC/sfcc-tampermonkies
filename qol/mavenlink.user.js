const LIMIT = 6000

var days = {
    Mon: '.day2',
    Tue: '.day3',
    Wed: '.day4',
    Thu: '.day5',
    Fri: '.day6',
};

// const days = ['.day2'].values()

async function* fillerup (defaultRow) {

    var DAYS = cfg.get('DAYS')?.values();
    while (true) {
        var { done, value } = DAYS.next();
        if (done) { return };
        var day = days[value];
        let box = defaultRow.find(`${day} input.entry-box`).get(0);

        yield box?.ariaLabel?.split(' ')?.pop()
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


const autofill = async () => {
    await waitFor('#location')
        .then($location => {
            $location.trigger('click.rails');
            waitFor(`#location-single-choice-listbox > li:contains("${MY_LOC}")`)
                .then($li => $li.trigger('click.rails'));
            return $location.change('change').trigger('blur');
        })
        .then(async () => {
            var time = await waitFor('#time')
                .then($time => $time.trigger('click')
                    .attr('value', (i, v) => (v && v !== '0h 0m') ? v : MY_TIME)
                    .val((i, v) => (v && v !== '0h 0m') ? v : MY_TIME)
                );

            return await waitFor('#notes').then($notes => {
                    $notes.trigger('click')
                    $notes.text((i, v) => v || MY_NOTE)
                    $notes.val((i, v) => v || MY_NOTE)
                    return $notes;
            });
        })
}

var GM_CHOICES = GM_getValue('MY_CHOICES');
const MY_CHOICES = {
    PROJECTS: GM_CHOICES?.PROJECTS || {},
    TASKS: GM_CHOICES?.TASKS || {},
}


const cfg = new MonkeyConfig({
    title: "Timesheet Defaults",
    menuCommand: true,
    params: {
        UPDATE_STORIES: {
            label: 'Auto fill tasks',
            type: 'custom',
            value: `<button id="update-full-week">Update</button>`,
            // html: '',
            set: (value, container) => {
                var MY_USER = cfg.get('MY_USER') || document.defaultView.Mavenlink?.currentUser?.id;
                jQuery(container).addClass('__MonkeyConfig_buttons').html(value).on('click', 'button', async (ev) => {
                    var MY_LOC = cfg.get('MY_LOC');
                    var MY_TIME = cfg.get('MY_TIME');
                    var MY_NOTE = cfg.get('MY_NOTE');
                    var MY_PROJECT = cfg.get('MY_PROJECT');
                    var MY_STORY = cfg.get('MY_STORY');

                    var row = jQuery(`[data-value="${MY_PROJECT}"]`)?.parents('tr');

                    for await (const day of fillerup(row)) {
                        var res = await poster('https://blueacornici.mavenlink.com/timesheets/time_entries', {
                            "user_id": MY_USER,
                            "time_entry": {
                                "billable": true,
                                "location": MY_LOC,
                                "notes": MY_NOTE,
                                "story_id": MY_STORY,
                                "workspace_id": MY_PROJECT,
                                "line_item_date": day,
                                "time": MY_TIME * 60
                            }
                        });
                    }
                    location.reload();
                });
            },
            get: () => {}
        },
        RELOAD: {
            label: 'Reload Projects/Tasks',
            type: 'custom',
            value: `<button id="update-full-week">Refresh</button>`,
            // html: '',
            set: (value, container) => {
                var MY_USER = cfg.get('MY_USER') || document.defaultView.Mavenlink?.currentUser?.id;
                var c = jQuery(container);
                var p = c.parents('.__MonkeyConfig_container');
                var projectSelector = p.find('#__MonkeyConfig_field_MY_PROJECT');
                projectSelector.on('change', async (ev) => {
                    var projectId = ev.target.value;
                    if (projectId) {
                        cfg.set('MY_PROJECT', projectId);
                        cfg.set('MY_STORY');

                        let { stories } = await rs(
                            `https://blueacornici.mavenlink.com/timesheets/get_workspace_and_stories?id=${projectId}&user_id=${MY_USER}&include_story_ancestor_path=false`
                        );

                        p.find('#__MonkeyConfig_field_MY_STORY').html(
                            stories.map(s => `<option value="${s.id}">${s.title}</option>`).join('')
                        );
                    }
                });
                c.addClass('__MonkeyConfig_buttons').html(value).on('click', 'button', async (ev) => {
                    GM_setValue('MY_CHOICES');
                    cfg.set('MY_PROJECT')
                    cfg.set('MY_STORY')

                    var { results, workspaces} = await rs(
                        `https://blueacornici.mavenlink.com/api/v1/workspaces?viewing_time_as_user[user_id]=${MY_USER}&per_page=20&page=1`
                    );
                    projectSelector.html(
                        '<option value=""></option>' +
                        results?.map(r => `<option value="${r.id}">${workspaces[r.id].title}</option>`).join('')
                    )

                    await updateProjects();
                });
            },
            get: () => {}
        },
        DAYS: {
            label: 'Auto update Days',
            type: 'select',
            multiple: true,
            variant: 'checkbox',
            choices: ['Mon','Tue','Wed','Thu', 'Fri']
        },
        MY_USER: {
            label: 'My User',
            type: 'number',
            default: 0,
        },
        MY_PROJECT: {
            label: 'My Project',
            type: 'select',
            choices: MY_CHOICES.PROJECTS
        },
        MY_STORY: {
            label: 'My Story',
            type: 'select',
            choices: MY_CHOICES.TASKS
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
            type: "number",
            default: 8
        },

    },
    onSave: (values) => {
        GM_setValue('MY_CHOICES')
    }
});


const MY_LOC = cfg.get('MY_LOC');
const MY_TIME = cfg.get('MY_TIME');
const MY_NOTE = cfg.get('MY_NOTE');

var rs = async (url) => {
    var res = await fetch(url, { method: "GET" });
    return await res.json();
}

var poster = async (url, body) => {
    var res = await fetch(url, {
        method: "POST",
        mode: "cors",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json;charset=utf-8",
            "X-CSRF-Token": document.defaultView.authenticity_token
        },
        body: JSON.stringify(body)
    });

    return await res.json();
}

var updateProjects = async () => {
    if (GM_CHOICES) return;

    var MY_USER = cfg.get('MY_USER');
    var { results, workspaces} = await rs(
        `https://blueacornici.mavenlink.com/api/v1/workspaces?viewing_time_as_user[user_id]=${MY_USER}&per_page=20&page=1`
    );

    var MY_PROJECT = cfg.get('MY_PROJECT');
    var workspaceStories = await Promise.all(
        Array.from(results, async (workspace) => {
            let data = workspaces[workspace.id];
            let { stories } = await rs(
                `https://blueacornici.mavenlink.com/timesheets/get_workspace_and_stories?id=${workspace.id}&user_id=${MY_USER}&include_story_ancestor_path=false`
            );

            MY_CHOICES.PROJECTS[workspace.id] = data.title;

            if (MY_PROJECT === workspace.id) {
                stories.forEach(s => {
                    MY_CHOICES.TASKS[s.id] = s.title;
                })
            }
            return Promise.resolve(true);
    }));

    GM_setValue('MY_CHOICES', MY_CHOICES)
}

(async function () {
    "use strict";

    if (!cfg.get('MY_USER')) {
        cfg.set('MY_USER', document.defaultView.Mavenlink?.currentUser?.id || 0);
    }

    await updateProjects();

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
