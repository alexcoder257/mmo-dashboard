// TODO: implement — stub mock data

export const baseCheckboxOptions = [
  { label: 'Option A', value: 'option_a' },
  { label: 'Option B', value: 'option_b' },
  { label: 'Option C', value: 'option_c' },
];

export const baseSelectOptions = [
  { label: 'Select 1', value: 'select_1' },
  { label: 'Select 2', value: 'select_2' },
  { label: 'Select 3', value: 'select_3' },
];

export const suggestions: { label: string; value: string }[] = [
  { label: 'Suggestion 1', value: 'suggestion 1' },
  { label: 'Suggestion 2', value: 'suggestion 2' },
  { label: 'Suggestion 3', value: 'suggestion 3' },
];

export const tableColumns = [
  {
    dataIndex: 'id',
    key: 'id',
    title: 'ID',
  },
  {
    dataIndex: 'name',
    key: 'name',
    title: 'Name',
  },
  {
    dataIndex: 'status',
    key: 'status',
    title: 'Status',
  },
];

export const tableData = [
  { id: 1, key: 1, name: 'Item 1', status: 'Active' },
  { id: 2, key: 2, name: 'Item 2', status: 'Inactive' },
  { id: 3, key: 3, name: 'Item 3', status: 'Active' },
];
