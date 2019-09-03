/**
 * Creates our application menu.
 *
 * @module electronMenu
 * @author Malte311
 */

/**
 * This array will contain the menu at the end (we will push all the information to it).
 */ 
var menuTemplate = [];

// Add everything to our template.
menuTemplate.push({
    label: 'Edit',
    submenu: [
        {
            label: 'Undo',
            role: 'undo'
        },
        {
            label: 'Redo',
            role: 'redo'
        },
        { type: 'separator' },
        {
            label: 'Cut',
            role: 'cut'
        },
        {
            label: 'Copy',
            role: 'copy'
        },
        {
            label: 'Paste',
            role: 'paste'
        }
    ]
});

menuTemplate.push({
    label: 'Window',
    submenu: [
        {
            label: 'Reload',
            role: 'reload'
        },
        { type: 'separator' },
        {
            label: 'Minimize',
            role: 'minimize'
        },
        {
            label: 'Close',
            role: 'close'
        },
        {
            label: 'Quit',
            role: 'quit'
        }
    ]
});

// Export the module, so we can use it in our main.js file to create an application menu.
module.exports = menuTemplate;