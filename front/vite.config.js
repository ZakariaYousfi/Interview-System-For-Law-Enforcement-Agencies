import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
// https://vitejs.dev/config/
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(),VitePWA(manifestForPlugIn)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

// you can copy the base structure of manifest object.
const manifestForPlugIn = {
  registerType:'prompt',
  includeAssests:['favicon.ico', "apple-touch-icon.png", "maskable-icon.png"],
  manifest:{
    name:"React-vite-app",
    short_name:"react-vite-app",
    description:"I am a simple vite app",
    icons:[{
      src: '/android-chrome-192x192.png',
      sizes:'192x192',
      type:'image/png',
      purpose:'favicon'
    },
    {
      src:'/android-chrome-512x512.png',
      sizes:'512x512',
      type:'image/png',
      purpose:'favicon'
    },
    {
      src: '/apple-touch-icon.png',
      sizes:'180x180',
      type:'image/png',
      purpose:'apple touch icon',
    },
    {
      src: '/maskable_icon.png',
      sizes:'512x512',
      type:'image/png',
      purpose:'any maskable',
    }
  ],
  theme_color:'#171717',
  background_color:'#f0e7db',
  display:"standalone",
  scope:'/',
  start_url:"/",
  orientation:'portrait'
  }
}