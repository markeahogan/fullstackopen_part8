import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import {Form, FormTextField } from './FormTextField';
import useTextField from '../hooks/useTextField';
import { LOGIN } from '../GraphQLPosts';

const LoginForm = ({setToken}) => {
    const [loginMut] = useMutation(LOGIN, {onError: console.log});
    const usernameField = useTextField('');
    const passwordField = useTextField('');

    const login = async () => {
        const result = await loginMut({variables:{
            username:usernameField.value,
            password:passwordField.value
        }});
        
        if (result){
            usernameField.clear();
            passwordField.clear();
            console.log("login result", result);
            setToken(result.data.login.value);
        }
    }

    return (
        <>
        <h1>Login</h1>
        <Form onSubmit={()=>login()} >
            <FormTextField label="Username" {...usernameField} />
            <FormTextField label="Password" {...passwordField} />
        </Form>
        </>
    );
}

export default LoginForm;