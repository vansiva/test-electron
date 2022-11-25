// window.addEventListener('DOMContentLoaded', () => {
//     const { ipcRenderer } = require('electron');
//     ipcRenderer.on('asynchronous-reply', (event, arg) => {
//         console.log(arg) // prints "pong"
//       })
//     //button and its event listener
//     const b1 = document.getElementById('admin');
//     b1.addEventListener('click', () => {
//         ipcRenderer.send('asynchronous-message', 'ping')
//     })
//   })

const electron = require('electron');
const path = require('path')

// Importing the Notification Module from Electron,
// Since it is a Part of the Main Process, Using the
// Remote Module to Import it in Renderer Process
const Notification = electron.remote.Notification;

var button = document.getElementById('trigger');

const options = {
	title: 'Custom Notification',
	subtitle: 'Subtitle of the Notification',
	body: 'Body of Custom Notification',
	silent: false,
	icon: path.join(__dirname, '../assets/image.png'),
	hasReply: true,
	timeoutType: 'never',
	replyPlaceholder: 'Reply Here',
	sound: path.join(__dirname, '../assets/sound.mp3'),
	urgency: 'critical',
	closeButtonText: 'Close Button',
	actions: [ {
		type: 'button',
		text: 'Show Button'
	}]
}

// Instantiating a new Notifications Object
// with custom Options
const customNotification = new Notification(options);

button.addEventListener('click', function (event) {
	console.log(Notification.isSupported());

	customNotification.show();
	// customNotification.close();
});

// Instance Events for the new Notification Object
customNotification.addListener('click', () => {
	console.log('Notification is Clicked');
});

customNotification.addListener('show', () => {
	console.log('Notification is shown');
});

customNotification.addListener('close', () => {
	console.log('Notification is Automatically Closed')
});
