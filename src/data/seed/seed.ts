import { envs } from "../../config"
import { CategoryModel } from "../mongo/models/category.model";
import { ProductModel } from "../mongo/models/product.model";
import { UserModel } from "../mongo/models/user.model";
import { MongoDatabase } from "../mongo/mongo-database"
import { seedData } from "./data";


(async () => {
    MongoDatabase.connect({
        dbName: envs.MONGO_DB_NAME,
        mongoUrl: envs.MONGO_URL
    })

    await main();

    await MongoDatabase.disconnect()
})();

const randomBetween = (x: number) => {
    return Math.floor(Math.random() * x)
}

async function main() {

    // Borrar todo
    await Promise.all([
        UserModel.deleteMany(),
        CategoryModel.deleteMany(),
        ProductModel.deleteMany()
    ])

    // Crear usuarios
    const users = await UserModel.insertMany(seedData.users);

    // Crear categorias
    const categories = await CategoryModel.insertMany(seedData.categories.map(category => {
        return {
            ...category,
            user: users[0]._id
        }
    }));

    //Crear productos
    const products = await ProductModel.insertMany(seedData.products.map(product => {
        return {
            ...product,
            user: users[randomBetween(seedData.users.length - 1)]._id,
            category: categories[randomBetween(seedData.categories.length - 1)]._id
        }
    }))

    console.log('SEEDED')
}