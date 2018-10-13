class GPIOMock {
    setup(pin, dir) {
        return new Promise((resolve, reject) => {
            console.log('setup', pin, dir);
            resolve();
        });
    }
    write(pin, value) {
        return new Promise((resolve, reject) => {
            console.log('write', pin, value);
            resolve();
        });
    }
}
module.exports = new GPIOMock();
//# sourceMappingURL=rpi-gpio-mock.js.map