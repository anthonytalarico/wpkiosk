// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { remote, ipcRenderer } = require('electron');
const { Menu, MenuItem } = remote;

let rightClickPosition = null;

const menu = new Menu();
const menuItem = new MenuItem({
	label: 'Inspect Element',
	click: () => {
		remote.getCurrentWindow().inspectElement(rightClickPosition.x, rightClickPosition.y);
	}
});
menu.append(menuItem);

window.addEventListener(
	'contextmenu',
	(e) => {
		e.preventDefault();
		rightClickPosition = { x: e.x, y: e.y };
		menu.popup(remote.getCurrentWindow());
	},
	false
);

$(document).on("click", ".resize-screen", function(e){
	e.preventDefault();
	ipcRenderer.send('resize', 1024, 768)
})
$(document).on("click", "#gw-quit-game", function(e){
	e.preventDefault();
	remote.getCurrentWindow().close()
})d