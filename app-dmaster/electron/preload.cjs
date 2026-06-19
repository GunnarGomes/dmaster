const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getServerInfo: () => ({ port: 3000 })
})