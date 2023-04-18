import React from 'react';

import Header from '../interface/Header';
import AddButton from '../components/AddButton';
import SignInForm from '../forms/SignInForm';
import SignUpForm from '../forms/SignUpForm';
import FileContainer from '../interface/FileContainer';
import NewFileForm from '../forms/NewFileForm';
import ForgotPasswordForm from '../forms/ForgotPasswordForm';

const LoginPage = props => {


    return (
        <>
            <Header />
            <SignInForm />
            <SignUpForm />
            <ForgotPasswordForm />
        </>
    );
}

export default LoginPage;