

export const dotString = Array(50).fill('&middot;').join(' ');


export interface MenuItem {
    label: string;
    key: string;
}
export const languageOptions: MenuItem[] = [
    {
        label: 'English',
        key: '1',
    },
    {
        label: 'German',
        key: '2',
    },
    {
        label: 'French',
        key: '3',
    },
    {
        label: 'Spanish',
        key: '4',
    },
    {
        label: 'Italian',
        key: '5',
    },
];

export const categoryOptions: MenuItem[] = [
    {
        label: 'Electronics',
        key: '1',
    },
    {
        label: 'Food',
        key: '2',
    },
    {
        label: 'Clothing',
        key: '3',
    },
    {
        label: 'Books',
        key: '4',
    },
    {
        label: 'Home Decor',
        key: '5',
    },
    {
        label: 'Toys',
        key: '6',
    },
    {
        label: 'Beauty',
        key: '7',
    },
    {
        label: 'Sports',
        key: '8',
    },
    {
        label: 'Automotive',
        key: '9',
    },
    {
        label: 'Health',
        key: '10',
    },
];

export const deleteEdit: MenuItem[] = [
    {
        label: 'Edit',
        key: '1',
    },
    {
        label: 'Delete',
        key: '2',
    },
];