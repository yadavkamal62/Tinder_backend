const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
    },

    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // if email allready exits then throws error
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
        
    },
    gender: {

        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("gender data is not valide")
            }
        }
    },
    skills: {
        type: [String]
    },
    photoUrl: {

        type: String,
        default: "https://actuariesindia.org/sites/default/files/2023-01/dummy-profile-pic.jpg"
    },
    about: {

        type: String,
        default: "this is default description"
    },

},
    {
        Timestamps: true

    },
);

module.exports = mongoose.model("User", userSchema)