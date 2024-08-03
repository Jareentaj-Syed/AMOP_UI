export const NonEditableDropdownStyles = {
    control: (base: any, state: any) => ({
        ...base,
        color: 'gray',
        backgroundColor: '#F9FAFB',
        fontSize: '16px',
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        textAlign: 'left',
        padding: '2px',
        cursor: 'not-allowed',
        '&:hover': {
            borderColor: '#3B82F6'
        }
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: 'gray',
        cursor: 'not-allowed',
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#BFDBFE' : '',
        color: 'black',
        cursor: 'not-allowed',
        ':hover': {
            backgroundColor: '#BFDBFE',
        },
    }),
};


export const DropdownStyles = {
    control: (base: any, state: any) => ({
        ...base,
        color: 'black',
        backgroundColor: 'white',
        fontSize: '16px',
        width: '100%',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        textAlign: 'left',
        padding: '2px',
        zIndex: 2,
        '&:hover': {
            borderColor: '#3B82F6'
        }
    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: 'black',
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: '#F9FAFB',
        zIndex: 9999
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#BFDBFE' : '',
        color: 'black',
        ':hover': {
            backgroundColor: '#BFDBFE',
        },
    }),
};
