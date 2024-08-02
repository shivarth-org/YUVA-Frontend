import React, { useState, useEffect } from "react";
import ComponentStudent from "./StudentForm";
import ComponentEm from "./EmForm";
import ComponentInstitute from "./InstituteForm";

const UserProfile = () => {
    const [user, setUser] = useState(sessionStorage.getItem('userType'));
    useEffect(() => {
        const user_type = sessionStorage.getItem('userType')
        setUser(user_type)
        console.log(user_type,"user_type"); 
    }, [])
    if (user === 'student') {
        return <ComponentStudent />;
    } else if (user === 'em') {
        return <ComponentEm />;
    } else if (user === 'institute') {
        return <ComponentInstitute />;
    } else {
        return null;
    }
};

export default UserProfile;
