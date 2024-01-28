import MessageModel from "../models/Message.js"
import UserModel from "../models/User.js"


export const create = async (req, res) => {
   try {
      const receiver = await UserModel.findOne({email: req.body.receiver})
      const user = await UserModel.findById(req.userId)
      console.log('userId')
      console.log(req.userId)

      const doc = new MessageModel({
         author: user._id,
         receiver: receiver._id,
         text: req.body.text,
      })
      
      const message = await doc.save()
      
      res.json(message)
   } catch(err) {
      res.status(500).json({
         message: 'Не удалось отправить сообщение'
      })
   }
}

export const get = async (req, res) => {
   try {
      const messages = await MessageModel.find({$or:[{author: req.userId}, {receiver: req.userId}]}).populate('author').populate('receiver').exec()
      
      res.json(messages)
   } catch(err) {
      res.status(500).json({
         message: 'Не удалось отправить сообщение'
      })
   }
}

// export const get = async (req, res) => {
//    try {
//       const messages = await MessageModel.find({receiver: req.userId} | {author: req.userId})
//       req.json(messages)
//       // const user = await UserModel.findById(req.userId)
//       // console.log('userId')
//       // console.log(req.userId)

//       // const doc = new MessageModel({
//       //    author: user._id,
//       //    receiver: receiver._id,
//       //    text: req.body.text,
//       // })
      
//       // const message = await doc.save()
//       // messages = {message: 'privet'}
//       // res.json(messages)
//    } catch(err) {
//       res.status(500).json({
//          err
//       })
//    }
// }