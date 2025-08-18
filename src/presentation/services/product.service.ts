import { ProductModel } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";


export class ProductService {

    //DI
    constructor(){}

    public async createProduct( createProductDto: CreateProductDto ){

        const productExists = await ProductModel.findOne({ name: createProductDto.name });
        if( productExists ) throw CustomError.badRequest('Product already exists');

        try {
            const product = new ProductModel( createProductDto );

            await product.save();

            return product;

        } catch (error) {
            throw CustomError.internalServer(`Internal Server Error: ${ error }`);
        }
    }


    public async getProducts( paginationDto: PaginationDto ){

        const { page, limit } = paginationDto;

        try {

            const [total, products] = await Promise.all( [
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip( (page - 1) * limit )
                    .limit( limit )
            ]);

            return {
                page: page,
                limit: limit,
                total: total,

                products
            };

        } catch (error) {
            throw CustomError.internalServer(`Internal Server Error: ${ error }`)            
        }


    }
}