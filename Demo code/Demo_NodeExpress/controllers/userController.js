var model = require('../models/user.model');

exports.listUser = async (req, res, next) => {
    var list = await model.userModel.find();
    if (!list) {
        res.send('Không có dữ liệu!')
    }
    res.send(list);
};

exports.registerUser = async (req, res, next) => {
    try {
        const user = new model.userModel(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        return res.status(201).send({ user, token, message: 'Đăng ký thành công!' });
    } catch (error) {
        return res.status(400).send(error);
    }

}

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await model.userModel.findByCredentials(username, password);
        if (!user) {
            return res.status(401).send({ error: 'Đăng nhập thất bại!' })
        }
        const token = await user.generateAuthToken()
        req.session.userLogin = user
        res.send({ user, token, message: 'Đăng nhập thành công!' })
    } catch (error) {
        res.status(400).send("Đăng nhập không thành công. Username hoặc password sai!")
    }

};
