import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

function recordingServerPlugin() {
  return {
    name: 'recording-server-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-recording', (req, res) => {
        if (req.method === 'POST') {
          const recordingsDir = path.resolve(process.cwd(), 'Recordings')
          if (!fs.existsSync(recordingsDir)) {
            fs.mkdirSync(recordingsDir, { recursive: true })
          }
          // Extract sessionId from query param or header so each visit has its own file preserved!
          const urlObj = new URL(req.url, 'http://localhost')
          const sessionId = urlObj.searchParams.get('sessionId') || Date.now()
          const filename = `session_${sessionId}.webm`
          const filePath = path.join(recordingsDir, filename)
          const writeStream = fs.createWriteStream(filePath)
          req.pipe(writeStream)
          req.on('end', () => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, file: filename }))
          })
          req.on('error', (err) => {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: err.message }))
          })
        } else {
          res.statusCode = 405
          res.end('Method Not Allowed')
        }
      })

      server.middlewares.use('/api/list-recordings', (req, res) => {
        const recordingsDir = path.resolve(process.cwd(), 'Recordings')
        if (!fs.existsSync(recordingsDir)) {
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify([]))
        }
        const files = fs.readdirSync(recordingsDir)
          .filter(f => f.endsWith('.webm') || f.endsWith('.mp4'))
          .map(file => {
            const stat = fs.statSync(path.join(recordingsDir, file))
            return {
              filename: file,
              size: stat.size,
              createdAt: stat.mtimeMs,
              url: `/Recordings/${file}`
            }
          })
          .sort((a, b) => b.createdAt - a.createdAt)
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(files))
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    recordingServerPlugin()
  ],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    fs: {
      allow: ['..']
    }
  }
})
