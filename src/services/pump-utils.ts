import { PumpPin } from '../types';
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
        PumpPin.forEach((pin: number) => {
            gpiop.setup(pin, Direction.DIR_OUT)
                .then(() => {
                    deactivate(pin);
                })
                .catch((err) => {
                    console.log('Error: ', pin, err.toString());
                });

        });
    }

    export function setValue(pin: number, value: boolean) {
        if (pin > 0) {
            return gpiop.write(pin, value)
                .catch((err) => {
                    console.log('Write Error: ', pin, value, err.toString());
                });
        }
        // silently resolving a promise
        return Promise.resolve();
    }

    export function activate(pin: number): Promise<{}> {
        return setValue(pin, false);
    }

    export function deactivate(pin: number): Promise<{}> {
        return setValue(pin, true);
    }

    export function activateWithTimer(pin: number, timeout: number): Promise<void> {
        return new Promise((resolve, reject) => {
            activate(pin).then(() => {
                setTimeout(() => {
                    deactivate(pin).then(() => {
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
