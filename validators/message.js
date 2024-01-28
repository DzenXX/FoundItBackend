import {body} from "express-validator";

export const messageValidation = [
   body('text').isString({ min: 1 }).isString(),
   body('receiver').isEmail(),
]