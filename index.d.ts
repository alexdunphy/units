export function parse(value: string | number, property?: string): {
  'value': number,
  'unit': string
};

export function convert(to: string, value: string, element?: Element, property?: string): number;

export function getDefaultValue(property: string): number;
export function getDefaultUnit(property: string): string;
