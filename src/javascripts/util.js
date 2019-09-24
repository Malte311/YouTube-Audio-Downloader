'use strict';
/**
 * Contains some utilities.
 *
 * @module util
 * @author Malte311
 */

/**
 * Creates an asynchronous array loop, i.e., each iteration waits for the asynchronous call of
 * the last iteration before beginning.
 * 
 * @param {object[]} arr The array we want to iterate over.
 * @param {function} loopFunction The function which does things with the element. Gets two params:
 * (item, callback) where item is the array element and callback is the callback function.
 * @param {number} ind Index for next element to process.
 * @param {function} [callback] Optional callback function, executed after the loop is done.
 */
function asyncArrLoop(arr, loopFunction, ind, callback) {
	if (!(arr.length > 0)) {
		typeof callback === 'function' && callback();
		return;
	}

	let inCallback = loopFunction; // To avoid name conflict
	loopFunction(arr[ind], () => {
		if (++ind < arr.length)
			asyncArrLoop(arr, inCallback, ind, callback);
		else
			typeof callback === 'function' && callback();
	});
}

/**
 * Creates jquery ui dialogues.
 * 
 * @param {string} divId The id of the div in which to create the dialog.
 * @param {string} title The title of the dialog.
 * @param {string} text The content of the dialog.
 * @param {function} [okCallback] A function to be executed when the confirm button was pressed.
 * @param {bool} [noCancel] Specifies if the cancel button should be removed.
 */
function createDialog(divId, title, text, okCallback, noCancel = false) {
	$(`#${divId}`).html(text);

	let buttons = [
		{
			text: 'Confirm',
			click: () => {
				typeof okCallback === 'function' && okCallback();
				$(`#${divId}`).dialog('close');
			}
		},
		{
			text: 'Cancel',
			click: () => {
				$(`#${divId}`).dialog('close');
			}
		}
	];

	if (noCancel)
		buttons.splice(1, 1);

	$(`#${divId}`).dialog({
		resizable: false,
		modal: true,
		minHeight: 0,
		minWidth: 600,
		maxHeight: 600,
		maxWidth: 1400,
		title: title,
		close : () => {
			$(`#${divId}`).html('');
			$('body').css({overflow: 'inherit'});
			$('#main').css({'opacity': 1});
		},
		buttons: buttons
	});

	$('body').css({overflow: 'hidden'});
	$('#main').css({'opacity': 0.3});
}