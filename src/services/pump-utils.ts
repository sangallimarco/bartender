import { Pump, PumpPin } from '../types';
const { env: { NODE_ENV } } = process;

// see rpi-gpio.js
export enum Direction {
    DIR_OUT = 'out'
}

// conditional import detect platform here
let gpiop;
if (NODE_ENV !== 'emulate') {
    const gpio = require('rpi-gpio');
    gpiop = gpio.promise;
} else {
    gpiop = require('./rpi-gpio-mock');
}

export namespace PumpsUtils {

    export function init() {
        PumpPin.forEach((pump: number) => {
            setValue(pump, false);
        });
    }

    export function setValue(pump: Pump, value: boolean) {
        return gpiop.setup(pump, Direction.DIR_OUT)
            .then(() => {
                return gpiop.write(pump, value)
                    .catch((err) => {
                        console.log('Write Error: ', pump, err.toString());
                    });
            })
            .catch((err) => {
                console.log('Setup Error: ', pump, err.toString());
            }
            );
    }

    export function activate(pump: Pump): Promise<{}> {
        return setValue(pump, true);
    }

    export function deactivate(pump: Pump): Promise<{}> {
        return setValue(pump, false);
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

    export function generateDefaultParts(): number[] {
        return PumpPin.map((pin: number) => 1);
    }
}
