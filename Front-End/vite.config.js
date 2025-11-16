import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/System_Hack_Novosibirsk/',
    server: {
        port: 5173
    }
})
