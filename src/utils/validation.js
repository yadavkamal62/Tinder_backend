

const validator = require("validator");



const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error(" Please enter your Name");
    } else if (firstName.length < 5 || firstName.length > 20) {
        throw new Error("FirstName must be 5 to 50 charater");
    }
    else if (lastName.length < 5 || lastName.length > 20) {
        throw new Error("lastName must be 5 to 50 charater");
    }
    else if (!validator.isEmail(email)) {
        throw new Error("email is invalid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("password should be atleast one uppercase one Lower case and a symbol and minlength_8")
    }
}
const validateLoginData = (req) => {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
        throw new Error("email is invalid");
    }

    // Check if password exists
    if (!password) {
        throw new Error("Please enter a password");
    }
}
const validateEditProfileData = (req) => {
    const allowedEditField = [
        "firstName",
        "lastName",
        "age",
        "photoUrl",
        "skills",
        "gender",
        "about",
    ];
    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditField.includes(field)
    );
    const { about, skills } = req.body;
    if (about && about.length > 25) {
        throw new Error("about must be less then 15 Character")
    }

    return isEditAllowed;
}





module.exports = {
    validateSignUpData,
    validateLoginData,
     validateEditProfileData
}