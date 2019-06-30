import { PumpPin } from '../types';

const { env: { NODE_ENV } } = process;


// see rpi-gpio.js
export enum Direction {
    DIR_OUT = 'out'
}

/* eslint-disable global-require,@typescript-eslint/no-var-requires */
// conditional import detect platform here
let gpiop;
if (NODE_ENV !== 'emulate') {
  const gpio = require('rpi-gpio');
  gpiop = gpio.promise;
} else {
  gpiop = require('./rpi-gpio-mock');
}
/* eslint-enable global-require */

function init(): void {
  PumpPin.forEach((pin: number): void => {
    gpiop.setup(pin, Direction.DIR_OUT)
      .then((): void => {
        deactivate(pin);
      })
      .catch((err: Error): void => {
        console.log('Error: ', pin, err.toString());
      });
  });
}

async function setValue(pin: number, value: boolean): Promise<void> {
  if (pin > 0) {
    return gpiop.write(pin, value)
      .catch((err: Error): void => {
        console.log('Write Error: ', pin, value, err.toString());
      });
  }
  // silently resolving a promise
  return Promise.resolve();
}

function activate(pin: number): Promise<void> {
  return setValue(pin, false);
}

function deactivate(pin: number): Promise<void> {
  return setValue(pin, true);
}

function activateWithTimer(pin: number, timeout: number): Promise<void> {
  return new Promise((resolve): void => {
    activate(pin).then(() : void => {
      setTimeout((): void => {
        deactivate(pin).then((): void => {
          resolve();
        });
      }, timeout);
    });
  });
}

function generateDefaultParts(): number[] {
  return PumpPin.map((): number => 1);
}

export const PumpsUtils = {
  generateDefaultParts,
  activateWithTimer,
  deactivate,
  activate,
  setValue,
  init,
};
