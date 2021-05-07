export interface CallbackIterable<T> {
    forEach(cb: (value: T) => void): void;
}

export interface Clock {
    // in milliseconds as float
    now(): number;
}

export interface RandomNumberGenerator {
    // [min, max)
    nextInt(min: number, max: number): number;

    // [0, 1)
    nextFloat(): number;

    nextBool(): boolean;
}
