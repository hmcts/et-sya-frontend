export type GovukTable = {
  rows: GovukTableRow[][];
  classes?: string;
  attributes?: Record<string, string>;
};

export type GovukTableRow = {
  text?: string;
  html?: string;
  classes?: string;
  attributes?: Record<string, string>;
};

export function createTextRow<T extends Record<string, any>>(
  data: T,
  mapping: Partial<Record<keyof T, 'text' | 'html'>>
): GovukTableRow[] {
  return Object.entries(mapping).map(([key, value]) => {
    return { [value]: data[key] };
  });
}

export function createTable<T extends Record<string, any>>(
  data: T[],
  mapping: Partial<Record<keyof T, 'text' | 'html'>>
): GovukTableRow[][] {
  return data.map(d => createTextRow(d, mapping));
}
