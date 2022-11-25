const  {ipcRenderer}=require('electron')


function newWindow(){
    ipcRenderer.send('getwindow', 'request window');
    
    
}

