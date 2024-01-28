import {body} from "express-validator";


export const chatCreateValidation = [
    body('text').isLength({ min: 1 }),
]