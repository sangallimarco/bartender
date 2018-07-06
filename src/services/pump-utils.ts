import gpio from 'rpi-gpio';
import { Pump } from './pump-types';
const gpiop = gpio.promise;

export namespace PumpsUtils {

    export function init() {
        for (const p in Pump) {
            gpiop.setup(p, gpio.DIR_OUT);
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
                    deactivate(pump).then(() => resolve());
                }, timeout);
            });
        });

    }
}
