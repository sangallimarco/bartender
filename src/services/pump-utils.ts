import { Pump, PumpPin } from 'shared-types';
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
                .catch((err) => {
                    console.log('Error: ', pin, err.toString())
                });
        });
    }

    export function setValue(pump: Pump, value: boolean) {
        return gpiop.write(pump, value)
            .catch((err) => {
                console.log('Error: ', pump, err.toString())
            });
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
