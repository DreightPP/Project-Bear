import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

function markdownIndexer() {
  return {
    name: 'markdown-indexer',
    configureServer(server) {
      // Add watch on the content directory
      server.watcher.add('public/content');
      
      // Listen for filesystem events
      server.watcher.on('all', (event, filePath) => {
        // We only care about markdown file changes
        if (filePath.includes('public/content') && filePath.endsWith('.md')) {
          console.log(`[markdown-indexer] File ${event}: ${filePath}. Rebuilding index...`);
          try {
            execSync('node scripts/generate-index.js', { stdio: 'inherit' });
          } catch (error) {
            console.error('[markdown-indexer] Error rebuilding index:', error);
          }
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), markdownIndexer()],
})
