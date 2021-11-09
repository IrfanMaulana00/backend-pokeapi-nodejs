import {Sequelize} from "sequelize"
import db from "../config/Database.js"

const { DataTypes } = Sequelize;

const Pokemon = db.define('pokemon', {
    id_user: {
        type: DataTypes.INTEGER
    },
    id_pokemon: {
        type: DataTypes.INTEGER
    },
    nama: {
        type: DataTypes.STRING
    },
    jumlah_edit: {
        type: DataTypes.INTEGER
    }
}, {
    freezeTableName: true
});

export default Pokemon;