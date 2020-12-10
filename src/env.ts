import * as React from 'react';
const glob = {
    log: console.log,
    React: React
}
Object.assign(window, glob);

export const { env } = import.meta;
