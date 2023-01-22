export type Mandatory<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
};
