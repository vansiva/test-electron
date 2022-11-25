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



const NOTIFICATION_TITLE = 'Title'
const NOTIFICATION_BODY = 'Notification from the Renderer process. Click to log to console.'
const CLICK_MESSAGE = 'Notification clicked!'

new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY })
  .onclick = () => document.getElementById("output1").innerText = CLICK_MESSAGE