const path = require('path');
const db = require('../models/nyManager.model');
var fs = require('fs');
const { randomUUID } = require('crypto');
const app = require('../app');
const { log } = require('console');

exports.listNy = async (req, res, next) => {
    let check = null;
    if (typeof (req.query._id) != 'undefined') {
        check = { _id: req.query._id };
    }

    var nyList = await db.nyModel.find(check).populate('type').sort({ $natural: -1 })
    res.status(200).json(nyList);
};

exports.addNy = async (req, res, next) => {
    let message = '';
    let random_char = randomString(10);

    try {
        fs.renameSync(req.file.path, './public/uploads/' + random_char + "-" + req.file.originalname);
        const ny = new db.nyModel();
        ny.name = req.body.name;
        ny.phone = req.body.phone;
        ny.description = req.body.description;
        ny.image = random_char + "-" + req.file.originalname;
        ny.type = req.body.type;
        await ny.save();
        res.status(201).json({ nyModel: ny });
    } catch (error) {
        message = 'Thêm thất bại. Lỗi do: ' + error.message;
        res.json({ message: message });
    }

};

exports.updateNY = async (req, res, next) => {
    let id_lover = req.params.id;
    let random_char = randomString(10);

    if (req.method == 'PUT') {
        if (req.file == null) {
            let obj = new db.nyModel();
            obj.name = req.body.name;
            obj.phone = req.body.phone;
            obj.description = req.body.description;
            obj.type = req.body.type;
            obj._id = id_lover;

            try {
                await db.nyModel.findByIdAndUpdate(id_lover, obj);
                return res.status(200).json({ lover: obj, message: 'Sửa thành công!' })
            } catch (error) {
                res.status(500).send({ message: error.message });
                console.log(error);
            }
        } else {
            fs.renameSync(req.file.path, './public/uploads/' + random_char + "-" + req.file.originalname);
            let obj = new db.nyModel();
            obj.name = req.body.name;
            obj.phone = req.body.phone;
            obj.description = req.body.description;
            obj.type = req.body.type;
            obj._id = id_lover;
            obj.image = random_char + "-" + req.file.originalname;

            try {
                await db.nyModel.findByIdAndUpdate(id_lover, obj);
                return res.status(200).json({ lover: obj, message: 'Sửa thành công!' })
            } catch (error) {
                res.status(500).send({ message: error.message });
                console.log(error);
            }
        }

    }
}

exports.deleteNY = async (req, res, next) => {
    let id_lover = req.params.id;

    if (req.method == 'DELETE') {
        let obj = new db.nyModel(req.body);
        obj._id = id_lover;

        try {
            await db.nyModel.findByIdAndDelete(id_lover);
            return res.status(200).json({ message: "Xoá thành công!" });
        } catch (error) {
            res.status(500).send({ message: error.message });
            console.log(error);
        }
    }
}

exports.listOfType = async (req, res, next) => {
    var typeList = await db.nyTypeModel.find()
    res.send(typeList);

    // test
    let user = "CanhPN";
    let message = user + " đã đăng nhập."

    app.sendSocket(message);
};

function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
