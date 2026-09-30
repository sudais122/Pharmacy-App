import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
  });

  const indexPath = path.join(__dirname, "../dist/index.html");

  console.log("Loading:", indexPath);

  win.loadFile(indexPath);

  // Open DevTools so we can see the actual error
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
});