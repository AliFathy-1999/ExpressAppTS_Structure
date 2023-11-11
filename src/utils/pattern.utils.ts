import IPattern from "../interfaces/pattern.interface";


const validationPatterns : IPattern= {
    STRONG_PASSWORD_PATTERN: {
        pattern : /(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]/,
        message : 'Password must contain at least one number , Capital letter and one special character',
    },
    ALPHABETIC_ONLY_PATTERN: {
        pattern : /^[A-Za-z\s]+$/,
        message : (field:string) : string => `${field} should contain alphabetic characters only`,
    },
    ALPHABETIC_NUMERIC_ONLY_PATTERN: {
        pattern : /^[a-zA-Z0-9\s]+$/,
        message : (field:string) : string => `${field} should contain alphabetic and numeric characters only`,
    }
    
}

export default validationPatterns;