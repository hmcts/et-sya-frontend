// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRecord = Record<string, any>;
export type UnknownRecord = Record<string, unknown>;
export type NeverRecord = Record<string, never>;
export type TypeItem<T> = {
  id: string;
  value: T;
};
