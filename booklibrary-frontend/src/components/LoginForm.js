import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import {Form, FormTextField } from './components/FormTextField';
import useTextField from '../hooks/useTextField';

const LOGIN = gql`
    mutation Login($username: String!)
    {
        login(username: $username) 
        {
            username
        }
    }`

const LoginForm = () => {
    const [loginMut] = useMutation(LOGIN);
    const usernameField = useTextField('');
    const passwordField = useTextField('');

    const login = () => {
        loginMut({variables:{
            username:usernameField.value
        }});
        //todo actual login
        usernameField.clear();
        passwordField.clear();
    }

    return (
        <h1>Login</h1>
        <Form onSubmit={()=>login()} >
            <FormTextField label="Username" {...usernameField} />
            <FormTextField label="Password" {...passwordField} />
        </Form>
    );
}

export default LoginForm;