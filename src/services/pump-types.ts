export const PumpPin = [
    7, 11, 12, 13, 15
];

export enum Pump {
    A = PumpPin[0], // GPIO-4
    B = PumpPin[1], // GPIO-17
    C = PumpPin[2], // GPIO-18
    D = PumpPin[3], // GPIO-27
    E = PumpPin[4] // GPIO-22
}
