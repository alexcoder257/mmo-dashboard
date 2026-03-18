export interface CompareProperty {
  description?: string;
  unit?: string;
  values: (string | string[])[];
}

export interface CompareSection {
  properties: CompareProperty[];
  section: string;
}
