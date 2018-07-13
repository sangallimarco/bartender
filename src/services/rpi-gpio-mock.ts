
class GPIOMock {
    public setup(pin: number, dir: string) {
        return new Promise((resolve, reject) => {
            console.log('setup', pin, dir);
            resolve();
        });
    }

    public write(pin: number, value: boolean) {
        return new Promise((resolve, reject) => {
            console.log('write', pin, value);
            resolve();
        });
    }
}

module.exports = new GPIOMock();
