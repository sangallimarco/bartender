import { Pump } from './pump-types';

export enum Direction {
    DIR_OUT = 'out',
}

// conditional import detect platform here
let gpiop;
if (false) {
    const gpio = require('rpi-gpio');
    gpiop = gpio.promise;
} else {
    gpiop = require('./rpi-gpio-mock');
}
// conditional import detect platform here

export namespace PumpsUtils {

    export function init() {
        for (const p in Pump) {
            gpiop.setup(p, Direction.DIR_OUT);
        }
    }

    export function activate(pump: Pump): Promise<{}> {
        return gpiop.write(pump, true);
    }

    export function deactivate(pump: Pump): Promise<{}> {
        return gpiop.write(pump, false);
    }

    export function activateWithTimer(pump: Pump, timeout: number): Promise<void> {
        return new Promise((resolve, reject) => {
            activate(pump).then(() => {
                setTimeout(() => {
                    deactivate(pump).then(() => {
                        resolve();
                    });
                }, timeout);
            });
        });
    }
}
