const AuthorModel = require('../models/authorModel')
const jwt = require('jsonwebtoken')
const authorModel = require('../models/authorModel')



const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidTitle = function (title) {
    return ['Mr', 'Mrs', "Miss"].indexOf(title) !== -1
}

const createAuthor = async function (req, res) {

    try {
        let authorData = req.body // body handle by mongoose

        let { fName, lName, title, email, password } = authorData

        if (Object.keys(authorData).length == 0) {
            res.status(400).send({ status: false, msg: "BAD REQUEST" })
            return
        }
        if (!isValid(fName)) {
            res.status(400).send({ status: false, msg: "firstName is required" })
            return
        }
        if (!isValid(lName)) {
            res.status(400).send({ status: false, msg: "lastName is required" })
            return
        }
        if (!isValid(title)) {
            res.status(400).send({ status: false, msg: "title is required" })
            return
        }
        if (!isValidTitle(title)) {
            res.status(400).send({ status: false, msg: "title should be amoung Mr,Mrs,Miss" })
            return
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "email is required" })
            return
        }
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, msg: "email should be valid email address" })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "password is required" })
            return
        }
        let isEmailAlreadyUsed = await authorModel.findOne({ email })
        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, msg: "email already used" })
        }

        let author = await AuthorModel.create(authorData)

        res.status(200).send({ status: true, data: author })

    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}


const login = async function (req, res) {
    try {

        let email = req.body.email
        let password = req.body.password
        let body= req.body
        if(Object.keys(body).length==0){
            res.status(400).send({status: false, msg: "BAD REQUEST"})
        }
        if (!isValid(email)) {
            res.status(400).send({ status: false, msg: "email is required" })
            return
        }
        if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
            res.status(400).send({ status: false, msg: "email should be valid email address" })
            return
        }
        if (!isValid(password)) {
            res.status(400).send({ status: false, msg: "password is required" })
            return
        }

        let author = await AuthorModel.findOne({ email: email, password: password })

        if (!author) return res.status(404).send({ status: false, msg: "email or password does not match" })
        else {
            let payLoad = { authorId: author._id }

            let secret = "projectgroup3"

            let token = jwt.sign(payLoad, secret)

            res.status(200).send({ status: true, data: token })
        }



    } catch (error) {
        res.status(500).send({ error: error.message })
    }
}
module.exports.createAuthor = createAuthor
module.exports.login = login