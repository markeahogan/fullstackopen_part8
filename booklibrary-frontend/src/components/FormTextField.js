import React from 'react';

export const Form = ({onSubmit, children}) => {
    return (
        <form onSubmit={(e)=>{e.preventDefault(); onSubmit()}}>
            <table><tbody>
            {children}
            </tbody></table>
            <FormSubmitButton label="submit" />
        </form>
    );
}

export const FormTextField = ({ label, value, onChange }) => {
    return (<tr><td>{label}</td><td><input value={value} onChange={onChange} /></td></tr>);
};

export const FormSubmitButton = ({label}) => {
    return (
        <button type="submit">{label}</button>
    );
}