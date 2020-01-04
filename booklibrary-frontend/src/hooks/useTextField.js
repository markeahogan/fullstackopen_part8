import { useState } from 'react';

const useTextField = () => {
    const [value, setValue] = useState('');
    const onChange = (event) => { setValue(event.target.value); };
    const clear = () => { setValue(''); };
    return {
        value,
        setValue,
        onChange,
        clear
    };
}

export default useTextField;