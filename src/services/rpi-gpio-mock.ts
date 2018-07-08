
class GPIOMock {
    setup(pin: number, dir: string) {
        return new Promise((resolve, reject) => {
            console.log('setup', pin, dir);
            resolve();
        });
    }

    write(pin: number, value: boolean) {
        return new Promise((resolve, reject) => {
            console.log('write', value);
            resolve();
        });
    }
}

module.exports = new GPIOMock();
