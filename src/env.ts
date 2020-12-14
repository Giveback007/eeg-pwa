Object.assign(window, {
    env: import.meta.env.MODE,
    log: console.log,
});

export const { env } = import.meta;
