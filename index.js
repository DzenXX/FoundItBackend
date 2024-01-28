import express from "express"
import mongoose from "mongoose";
import { registerValidation } from "./validators/auth.js";
import checkAuth from "./utils/checkAuth.js";
import { loginValidation } from "./validators/login.js";
import { postCreateValidation } from "./validators/post.js";
import { messageValidation } from "./validators/message.js";
import multer from "multer";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import cors from 'cors'
import { MessageController, UserController, PostController } from "./controllers/index.js";
import sharp from "sharp";
import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

mongoose.set('strictQuery', true);

mongoose.connect("mongodb+srv://admin:qqqw@cluster0.guhr5gz.mongodb.net/ttt?retryWrites=true&w=majority")
   .then(() => console.log('DB was connected'))
   .catch((err) => console.log('DB error:', err))

const app = express()

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.listen(4444, (err) => {
   if (err) {
      console.log(err)
      console.log("Oh shit, I'm sorry!")
   }
   console.log("Without further interruption let's celebrate and suck some dick!")
})

app.get('/', (req, res) => {
   res.send('Welcome to the club, buddy!!!')
})



const storage = multer.diskStorage({
   destination: (_, __, cb) => {
      cb(null, 'uploads');
   },
   filename: (_, file, cb) => {
      cb(null, file.originalname);
   },
});

const upload = multer({ storage });

app.get('/auth/register', (req, res) => {
   res.send('Welcome to the club')
})


app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)

app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/messages/get', checkAuth, MessageController.get)


app.post('/messages/create', messageValidation, checkAuth, MessageController.create)

app.post('/upload', checkAuth, upload.single('image'), async (req, res) => {

   res.json({
      url: `/uploads/${req.file.originalname}`
   })
})


// import path from 'path';
// import { fileURLToPath } from 'url';

app.get('/posts', PostController.getAll);
app.get('/posts/personal', checkAuth, PostController.getForUser);
// app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

      async function resizeImage(req, res) {
         try {
            await sharp(req.body)
               .resize({
                  width: 346,
                  height: 346
               })
               .toFormat("jpeg", { mozjpeg: true })
               .toFile(req.body);
            
               next();
         } catch (error) {
            console.log(error);
         }
      }

      // resizeImage();

