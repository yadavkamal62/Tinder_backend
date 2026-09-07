const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true,
        minLength: 4,
        maxLength: 10,
    },

    lastName: {
        type: String,
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // if email allready exits then throws error
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email address" + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("enter a strong password" + value)
            }
        }

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

        default: "https://actuariesindia.org/sites/default/files/2023-01/dummy-profile-pic.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid Photo URL" + value)
            }
        }
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
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$8707544882", {
        expiresIn: "1d"

    });
    return token;


};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );
    return isPasswordValid
}

module.exports = mongoose.model("User", userSchema)