const { BrowserWindow, app, Tray, Menu } = require('electron');
const path = require('path');

const POMODORO_TIME = 1000 * 60 * 25;

const iconPath = path.join(__dirname, 'icons/tomato.png');

let appIcon, timer, interval, browserWindow, contextMenu;

function startTimer() {
    timer = setTimeout(() => {
        browserWindow.loadURL(`file://${__dirname}/modal/index.html`);
        browserWindow.show();
    }, POMODORO_TIME);
}

app.on('ready', () => {
    browserWindow = new BrowserWindow({
        show: false
    });

    appIcon = new Tray(iconPath);
    contextMenu = Menu.buildFromTemplate([
        {
            label: 'Start pomodoro',
            accelerator: 'Command+S',
            enabled: true,
            click() {
                startTimer();
                contextMenu.items[0].enabled = false;
                contextMenu.items[1].enabled = true;
            }
        },
        {
            label: 'Stop pomodoro',
            accelerator: 'Command+P',
            enabled: false,
            click() {
                clearTimeout(timer);
                clearInterval(interval);
                contextMenu.items[0].enabled = true;
                contextMenu.items[1].enabled = false;
            }
        },
        { label: 'Quit',
          accelerator: 'Command+Q',
          selector: 'terminate:'
        }
    ]);

    appIcon.setContextMenu(contextMenu);

    app.on('close', () => {
        browserWindow = null;
    });
});
