import { Clock } from '@nw55/common';

export const hrtimeClock: Clock = {
    now() {
        const [seconds, nanoseconds] = process.hrtime();
        // result in milliseconds as float
        return seconds * 1000 + nanoseconds / 1000000;
    }
};
