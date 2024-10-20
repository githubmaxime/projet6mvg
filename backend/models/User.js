const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Joi = require('joi');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: {type: String,
        required: true,
        trim: true,
        minlength: 8,
         }
});

userSchema.plugin(uniqueValidator);

const User = mongoose.model('user', userSchema)

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .min(5)
      .max(500)
      .required(),
    password: Joi.string()
      .min(8)
      .max(1024)
      .required()
      .regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,1024}$/),
  })
  return schema.validate(user)
}

module.exports = {
  User,
  validateUser,
}

// userSchema.statics.joiValidate = function(obj) {
// 	var Joi = require('joi');
// 	var schema = {
// 		email: Joi.types.String().min(6).max(30).required(),
// 		password: Joi.types.String().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/).required(),
// 	}
// 	return Joi.validate(obj, schema);
// }

// module.exports = mongoose.model('User', userSchema)