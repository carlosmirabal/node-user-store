import { ProductModel } from "../../data";
import { CreateCategoryDto, CustomError, PaginationDto, UserEntity } from "../../domain";

export class ProductService {

    // DI
    constructor() { }

    async createProduct(createProductDto: CreateCategoryDto) {
        const productExists = await ProductModel.findOne({ name: createProductDto.name })
        if (productExists) throw CustomError.badRequest('Product already exists')

        try {
            const product = new ProductModel({
                ...createProductDto,
            })

            await product.save()

            return product;

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    async getProducts(paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        try {
            const [total, products] = await Promise.all([ // Peticiones en paralelo
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page - 1) * limit) // skip the first n items
                    .limit(limit)
                    .populate('user')
                    .populate('category')
            ])

            return {
                page,
                limit,
                total,
                next: `/api/products?page=${page + 1}&limit=${limit}`,
                prev: (page - 1 > 0) ? `/api/products?page=${page - 1}&limit=${limit}` : null,
                products: products
            }

        } catch (error) {
            throw CustomError.internalServer('Internal error')
        }
    }
}