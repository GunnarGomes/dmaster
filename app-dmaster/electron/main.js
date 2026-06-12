import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function createwindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        center: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        }
    })

    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, '../dist/index.html'))

    }
}

app.whenReady().then(() => {
    createwindow()
    require('../server/index.js')
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})