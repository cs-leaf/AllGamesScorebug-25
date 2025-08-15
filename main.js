const { app, BrowserWindow } = require('electron');
const path = require('path');

// --- WebSocket Server ---
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let connections = [];

wss.on('connection', (ws) => {
    connections.push(ws);
    console.log("Client connected");

    ws.on('message', (message) => {
        console.log("Broadcasting:", message);
        connections.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        connections = connections.filter(c => c !== ws);
        console.log("Client disconnected");
    });
});

// --- Electron Window Setup ---
function createWindow() {
    const win = new BrowserWindow({
        width: 1250,
        height: 750,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: false,
            nodeIntegration: true,
            allowRunningInsecureContent: true,  // <-- Add this line to allow cross-origin requests
            webSecurity: false, // <-- This disables security checks, use only for development!
        }        
    });

    win.loadFile(path.join(__dirname, 'client', 'index.html'));
    //win.loadFile(path.join(__dirname, 'src', 'monitor', 'log.html'));

    // Optional: Open dev tools
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
