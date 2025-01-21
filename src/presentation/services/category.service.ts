import { CategoryModel } from "../../data";
import { CategoryEntity, CreateCategoryDto, CustomError, UserEntity } from "../../domain";

export class CategoryService {

    // DI
    constructor() { }

    async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
        const categoryExists = await CategoryModel.findOne({ name: createCategoryDto.name })
        if (categoryExists) throw CustomError.badRequest('Category already exists')

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            })

            await category.save()

            return {
                id: category.id,
                name: category.name,
                available: category.available,
            }


        } catch (error) {
            throw CustomError.internalServer('Internal error')
        }
    }

    async getCategories() {
        try {
            const categories = await CategoryModel.find();

            return categories.map(category => CategoryEntity.fromObject(category));

        } catch (error) {
            throw CustomError.internalServer('Internal error')
        }
    }
}