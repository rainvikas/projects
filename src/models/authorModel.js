const mongoose = require('mongoose')

let validateEmail = function (email) {
    let regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexForEmail.test(email)
};

const authorSchema = new mongoose.Schema({
    title: { type: String, trim: true, enum: ["Mr", "Mrs", "Miss"], required: true },
    fName: { type: String, trim: true, required: true },
    lName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, unique: true,  validate: [validateEmail, "Please enter a valid email address"], required: true, lowercase : true },
    password: { type: String, trim: true, required: true }

}, { timestamps: true })

module.exports = mongoose.model("Author", authorSchema)