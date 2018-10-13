"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const { env: { NODE_ENV } } = process;
// see rpi-gpio.js
var Direction;
(function (Direction) {
    Direction["DIR_OUT"] = "out";
})(Direction = exports.Direction || (exports.Direction = {}));
// conditional import detect platform here
let gpiop;
if (NODE_ENV !== 'emulate') {
    const gpio = require('rpi-gpio');
    gpiop = gpio.promise;
}
else {
    gpiop = require('./rpi-gpio-mock');
}
var PumpsUtils;
(function (PumpsUtils) {
    function init() {
        types_1.PumpPin.forEach((pin) => {
            gpiop.setup(pin, Direction.DIR_OUT)
                .then(() => {
                setValue(pin, false);
            })
                .catch((err) => {
                console.log('Error: ', pin, err.toString());
            });
        });
    }
    PumpsUtils.init = init;
    function setValue(pin, value) {
        if (pin > 0) {
            return gpiop.write(pin, value)
                .catch((err) => {
                console.log('Write Error: ', pin, value, err.toString());
            });
        }
        // silently resolving a promise
        return Promise.resolve();
    }
    PumpsUtils.setValue = setValue;
    function activate(pin) {
        return setValue(pin, true);
    }
    PumpsUtils.activate = activate;
    function deactivate(pin) {
        return setValue(pin, false);
    }
    PumpsUtils.deactivate = deactivate;
    function activateWithTimer(pin, timeout) {
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
    PumpsUtils.activateWithTimer = activateWithTimer;
    function generateDefaultParts() {
        return types_1.PumpPin.map((pin) => 1);
    }
    PumpsUtils.generateDefaultParts = generateDefaultParts;
})(PumpsUtils = exports.PumpsUtils || (exports.PumpsUtils = {}));
//# sourceMappingURL=pump-utils.js.map