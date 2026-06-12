import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    getServerInfo: () => ({port: 3000})
})