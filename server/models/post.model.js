const Joi = require("joi");

const postModel = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  imgUrl: Joi.string().uri().required(),
  blobName: Joi.string().required(),
  createdAt: Joi.date().default(Date.now),
  likes: Joi.array().items(Joi.string()).default([]),
  comments: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string().required(),
        text: Joi.string().required(),
        createdAt: Joi.date().default(Date.now),
      })
    )
    .default([]),
  metadata: Joi.object({
    originalName: Joi.string(),
    size: Joi.number(),
    contentType: Joi.string(),
    blobMetadata: Joi.object()
  }).optional()
});

module.exports = postModel;