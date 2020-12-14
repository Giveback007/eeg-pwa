export function arrFindById<T, K extends keyof T = keyof T>(arr: T[], idKey: K, id: T[K]) {
    const x = arr.find(x => x[idKey] === id);
    return x;
}
