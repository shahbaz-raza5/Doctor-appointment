const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required']
    },

    email:{
        type:String,
        required:[true,'email is required']
    },

    password:{
        type: String,
        required:[true, 'password is required']
    },
    phone:{
        type: Number,
        required:[true, 'number is required']
    },
    isAdmin:{
        type: Boolean,
        default:false,
    },
    ispatient:{
        type: Boolean,
        default:false,
    },
    patientId:{
        type: Number,
        
    },

    isdoctor:{
        type: Boolean,
        default:false,
    },
    isdoctorstatus: {
        type: String,
        default: "none",
      },

    notification:{
        type:Array,
        default:[]
    },
    seennotification:{
        type:Array,
        default:[]
    },


});

const userModel=mongoose.model('users',userSchema)
module.exports=userModel;