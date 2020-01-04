import React from 'react';

const FormTextField = ({ label, value, onChange }) => {
    return (<tr><td>{label}</td><td><input value={value} onChange={onChange} /></td></tr>);
};

export default FormTextField;