import {body} from "express-validator";


export const postCreateValidation = [
   body('title', 'Введите заголовок объявления').isLength({ min: 3 }).isString(),
   body('text', 'Введите текст объявления').isLength({ min: 3 }).isString(),
   body('tag', 'Неверный формат тэга').isString(),
   body('place', 'Введите место продажи').isLength({ min: 3, max: 18 }).isString(),
   body('price', 'Введите цену').isLength({ min: 3 }).isString(),
   body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
 ];