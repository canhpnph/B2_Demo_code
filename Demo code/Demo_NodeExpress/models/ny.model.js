const db = require('../db_connection');

const nySchema = new db.mongoose.Schema ({
        name: {type: String, required: true},
        phone: {type: String, required: true },
        description: {type: String, required: false},
        image: {type: String, required: false},
        type: {type: db.mongoose.Schema.Types.ObjectId, ref: 'nyTypeModel'}
}, {collection: 'tb_ny'}
);

let nyModel = db.mongoose.model('nyModel', nySchema);

module.exports = nyModel
