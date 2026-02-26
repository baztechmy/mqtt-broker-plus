// MODULES
import Db, { DataTypes } from '@harrypoggers25/db-postgresql';
import env from './env.config.js';

export const db = Db.config({
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    port: env.DB_PORT
});

export const Client = db.define('clients', {
    client_id: { type: DataTypes.SERIAL, allowNull: false, primaryKey: true },
    client_name: { type: DataTypes.VARCHAR(255), allowNull: false },
});

export const ClientToken = db.define('client_tokens', {
    client_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
    client_token: { type: DataTypes.TEXT, allowNull: false },
})
ClientToken.setForeignKey(Client, 'client_id');
