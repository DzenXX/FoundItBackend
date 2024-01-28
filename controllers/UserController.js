// import {validationResult} from "express-validator";
// import bcrypt from "bcrypt-nodejs";
import bcrypt from "bcrypt"
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {

        console.log('Registration successful')
        const password = req.body.password
        console.log(password)
    
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
        })

        const user = await doc.save()

        const {passwordHash, ...userData} = user._doc

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret111',
            {
                expiresIn: '30d'
            }
        )

        res.json({
            ...userData,
            token
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err,
            message: 'Не удалось зарегаться'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})

        if (!user) {
            return res.status(404).json({
                message: 'Такога пользователя няма'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Няверны пароль або email'
            })
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            'secret111',
            {
                expiresIn: '30d'
            }
        )

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось авторизоваться'
        })
    }
}

export const getMe = async (req, res) => {
    try {
      console.log(req.userId)
        const user = await UserModel.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: 'Пользователя няма'
            })
        }
        const { passwordHash, ...userData } = user._doc
        res.json({...userData})
    } catch (err) {
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}