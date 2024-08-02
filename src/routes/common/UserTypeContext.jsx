// UserTypeContext.js
import React, { createContext, useState, useContext } from 'react';

const UserTypeContext = createContext();

export const useUserType = () => useContext(UserTypeContext);

export const UserTypeProvider = ({ children }) => {
    const [userType, setUserType] = useState('');

    const setUserTypeToAdmin = () => {
        setUserType('admin');
    };

    const setUserTypeToUser = () => {
        setUserType('student');
        sessionStorage.setItem('userType', "student");
    };

    const setUserTypeToInstitute = () => {
        setUserType('institute');
        sessionStorage.setItem('userType', "institute");
    };

    const setUserTypeToChapterEM = () => {
        setUserType('em');
        sessionStorage.setItem('userType', "em");
    };

    return (
        <UserTypeContext.Provider value={{
            userType, setUserTypeToAdmin, setUserTypeToUser, setUserTypeToInstitute,
            setUserTypeToChapterEM,
        }}>
            {children}
        </UserTypeContext.Provider>
    );
};
