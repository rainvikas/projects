const jwt = require('jsonwebtoken')
const BlogsModel = require('../models/blogModel')

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]

        if (!token) return res.status(400).send({ status: false, msg: "please provide token in request hadder" })

        let validateToken = jwt.verify(token, "projectgroup3")

        //! below condition execution chances are very low as catch block will handle the invalid token error

        if (!validateToken) return res.status(401).send({ status: false, msg: "authentication failed" })

        res.setHeader('x-api-key', token)
        next()
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}


const authorization = async function (req, res, next) {

    try {
            let id = req.params.blogId
       if (!id) return res.status(400).send({ status: false, msg: "please provide blog ID in path params" })

        let token = req.headers["x-api-key"]
        let verifiedToken = jwt.verify(token, "projectgroup3")

        let blogs = await BlogsModel.findById(id)
        if (!blogs) return res.status(404).send({ status: false, msg: "blog ID not exist" })

        if (verifiedToken.authorId != blogs.authorId) 
        return res.status(403).send({ status: false, msg: "unauthorize access " })

        next()

    } catch (error) {
        res.status(500).send({ error: error.message })
    }

}

module.exports.authentication = authentication
module.exports.authorization = authorization