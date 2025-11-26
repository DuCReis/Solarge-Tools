import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import dbConfig from '../config/database.js';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
);

const files = fs
    .readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js'
        );
    });

for (const file of files) {
    const modulePath = path.join(__dirname, file);
    const module = await import(pathToFileURL(modulePath).href);
    const model = module.default(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
}

Object.keys(db).forEach((modelName) => {
    if (typeof db[modelName].associate === 'function') {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
