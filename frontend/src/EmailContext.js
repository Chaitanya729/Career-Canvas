import React, { createContext, useState} from "react";

// Creating the e-mail context
export const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
    const [email, setEmail] = useState("");

    return (
        <EmailContext.Provider value={{ email, setEmail }}>
            {children}
        </EmailContext.Provider>
    );
};