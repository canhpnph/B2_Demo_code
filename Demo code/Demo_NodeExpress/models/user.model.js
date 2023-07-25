const db = require('../db_connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const chuoi_ky_tu_bi_mat = process.env.TOKEN_SEC_KEY;
const bcrypt = require("bcrypt");

const userSchema = new db.mongoose.Schema(
    {
        username: {type: String, required: true},
        password: {type: String, required: true},
        token: {type: String, required: false}
    },
    {
        collection: 'tb_user'
    }
);

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

userSchema.methods.generateAuthToken = async function () {

    const user = this
    const token = jwt.sign({ _id: user._id, username: user.username }, chuoi_ky_tu_bi_mat)
    
    user.token = token;
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (username, password) => {

    const user = await userModel.findOne({ username })
    if (!user) {
        throw new Error({ error: 'Không tồn tại user' })
    }
    
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({ error: 'Sai password' })
    }

    return user
}

let userModel = db.mongoose.model('userModel', userSchema);
module.exports = {userModel};