const jol = require('joi')

exports.signUpValidator = async (req,res,next)=>{
    const Schema = Joi.object({
        firstName: Joi.string().min(3).max(30).pattern(new RegExp('^[A-Za-z]+$')).
        required().messages({
          'any.required':'firstName is required',
          'string.empty':'firstName cannot be empty',
          'string.min':'firstName should contain at least 3 characters',
          'string.max':'firstName should not be more than 30 characters long',
          'string.pattern.base':'firstName can only contain letters with no spaces'
        }),
        surname: Joi.string().min(3).max(30).pattern(new RegExp('^[A-Za-z]+$')).
        required().message({
           'any.required':'surname is required',
          'string.empty':'surname cannot be empty',
          'string.min':'surname should contain at least 3 characters',
          'string.max':'surname should not be more than 30 characters long',
          'string.pattern.base':'surname can only contain letters with no spaces'

        }),
        email: Joi.string().email().required().message({
           'any.required':'Email is required',
          'string.empty':'Email cannot be empty',
          'string.email':'Invaild email format'
          
        }),
        password: Joi.string().pattern(new RegExp ( '^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&*-]).{8,}$')).
        required().message({
           'any.required':'password is required',
          'string.empty':'password cannot be empty',
          'string.pattern.base':'password must contain at least one UpperCase, Lowercase,  Digits and a special character [#?!@$%^&*-]',
        })
    
    })
   const {error} = Schema.validate(req.body)
   if (error) {
    return res.status(400).json({
        message: error.details[0].message
    })
   }
   next()
} 

exports.loginValidator  = async (req,res,next)=>{
  const schema = jol.object({

    email: Joi.string().email().required().message({
           'any.required':'Email is required',
          'string.empty':'Email cannot be empty',
          'string.email':'Invaild email format',
    }),
    password:Joi.string().pattern(new RegExp ( '^(?=.?[A-Z])(?=.?[a-z])(?=.?[0-9])(?=.?[#?!@$%^&*-]).{8,}$')).
        required().message({
           'any.required':'password is required',
          'string.empty':'password cannot be empty',
          
        })

  })

    const {error} = Schema.validate(req.body)
   if (error) {
    return res.status(400).json({
        message: error.details[0].message
    })
   }
   next()
}