/* 
    Será la entidad con la que trabajemos en la aplicación
    Así evitamos usar directamente la entidad de mongoDB
*/

import { CustomError } from "../errors/custom.error";

export class CategoryEntity {
    constructor(
        public id: string,
        public name: string,
        public available: boolean,

    ) { }

    /**
        Convertimos el modelo de la base de datos en la entidad que usaremos en la aplicación
    */
    static fromObject(object: { [key: string]: any }) {
        const { id, _id, name, available = false } = object;

        if (!id && !_id) {
            throw CustomError.badRequest("Missing id");
        }

        if (!name) throw CustomError.badRequest("Missing name");

        return new CategoryEntity(id || _id, name, available);
    }
}
