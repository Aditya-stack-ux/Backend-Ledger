const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blacklist.model")


async function authMiddleware(req, res, next) {
    const token = req.cookies?.token ||
                  req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized: Token missing"
        })
    }

    const isBlacklisted = await tokenBlackListModel.findOne({token})
    if(isBlacklisted){
        return res.status(401).json({
            message:"Unauthorized: Token invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId)

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized: User not found"
            })
        }

        req.user = user
        next()

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized: Invalid or expired token"
        })
    }
}

async function authSystemUserMiddleware(req,res,next){
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized: Token missing"
        })
    }

    const isBlacklisted = await tokenBlackListModel.findOne({token})
    if(isBlacklisted){
        return res.status(401).json({
            message:"Unauthorized: Token invalid"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId).select("+systemUser")

        if (!user) {
          return res.status(401).json({
                message: "Unauthorized: User not found"
            })
        }
        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbidden access, not a System User"
            })
        }
        req.user = user

        return next()

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized: Invalid or expired token"
        })
    }
    
}

module.exports = {authMiddleware,authSystemUserMiddleware}