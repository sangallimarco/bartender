class GPIOMock {
  public setup(pin: number, dir: string): Promise<void> {
    return new Promise((resolve): void => {
      console.log('setup', pin, dir);
      resolve();
    });
  }

  public write(pin: number, value: boolean): Promise<void> {
    return new Promise((resolve): void => {
      console.log('write', pin, value);
      resolve();
    });
  }
}


module.exports = new GPIOMock();
