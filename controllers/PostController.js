import PostModel from '../models/Post.js';

// export const getLastTags = async (req, res) => {
//   try {
//     const posts = await PostModel.find().limit(5).exec();

//     const tags = posts
//       .map((obj) => obj.tags)
//       .flat()
//       .slice(0, 5);

//     res.json(tags);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: 'Не удалось получить тэги',
//     });
//   }
// };

export const getAll = async (req, res) => {
   try {
      const posts = await PostModel.find().populate('user').exec();
      res.json(posts);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось получить статьи',
      });
   }
};

export const getForUser = async (req, res) => {
   try {
      const posts = await PostModel.find({ user: req.userId }).populate('user').exec();
      res.json(posts);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось получить статьи',
      });
   }
};

export const getOne = async (req, res) => {
   try {
      const postId = req.params.id;

      PostModel.findOneAndUpdate(
         {
            _id: postId,
         },
         {
            $inc: { viewsCount: 1 },
         },
         {
            returnDocument: 'after',
         },
         (err, doc) => {
            if (err) {
               console.log(err);
               return res.status(500).json({
                  message: 'Не удалось вернуть статью',
               });
            }

            if (!doc) {
               return res.status(404).json({
                  message: 'Статья не найдена',
               });
            }

            res.json(doc);
         },
      ).populate('user');
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось получить статьи',
      });
   }
};

export const remove = async (req, res) => {
   try {
      const postId = req.params.id;

      PostModel.findOne(
         {
            _id: postId,
         },
         (err, doc) => {
            if (err) {
               console.log(err);
               return res.status(500).json({
                  message: 'Не удалось вернуть статью',
               });
            }

            if (!doc) {
               return res.status(404).json({
                  message: 'Статья не найдена',
               });
            }

            // res.json(doc);
            if (doc.user._id == req.userId) {
               PostModel.findOneAndDelete(
                  {
                     _id: postId,
                  },
                  (err, doc) => {
                     if (err) {
                        console.log(err);
                        return res.status(500).json({
                           message: 'Не удалось удалить статью',
                        });
                     }

                     if (!doc) {
                        return res.status(404).json({
                           message: 'Статья не найдена',
                        });
                     }

                     res.json({
                        success: true,
                     });
                  },
               );
    
            } else {
               res.status(404).json({
                  message: 'Нет доступа к удалению',
               });
            }
         },
      ).populate('user');

      // if (post.user._id == req.userId) {
      //    PostModel.findOneAndDelete(
      //       {
      //          _id: postId,
      //       },
      //       (err, doc) => {
      //          if (err) {
      //             console.log(err);
      //             return res.status(500).json({
      //                message: 'Не удалось удалить статью',
      //             });
      //          }

      //          if (!doc) {
      //             return res.status(404).json({
      //                message: 'Статья не найдена',
      //             });
      //          }

      //          res.json({
      //             success: true,
      //          });
      //       },
      //    );
      // }
      // res.json({})
   } catch (err) {
      // console.log(err);
      res.status(500).json({
         message: 'err',
         // postId: req.postId,
         // post: req.post,
      });
   }
};

export const create = async (req, res) => {
   try {
      
      const doc = new PostModel({
         title: req.body.title,
         text: req.body.text,
         place: req.body.place,
         price: req.body.price,
         imageUrl: req.body.imageUrl,
         tag: req.body.tag,
         user: req.userId,
      });

      const post = await doc.save();

      res.json(post);
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: err,
      });
   }
};

export const update = async (req, res) => {
   try {
      const postId = req.params.id;

      await PostModel.updateOne(
         {
            _id: postId,
         },
         {
            title: req.body.title,
            text: req.body.text,
            place: req.body.place,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tag: req.body.tag,
         },
      );

      res.json({
         success: true,
      });
   } catch (err) {
      console.log(err);
      res.status(500).json({
         message: 'Не удалось обновить статью',
      });
   }
};
