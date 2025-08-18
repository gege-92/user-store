import { Request, Response } from "express";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";
import { ProductService } from "../services/product.service";


export class ProductController {

    constructor(
        public readonly productService: ProductService
    ){}

    private handlerError = (error: unknown, res: Response) => {
        if( error instanceof CustomError ){
            res.status( error.statusCode ).json({ error: error.message });
            return;
        }

        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }


    getProducts = ( req: Request, res: Response ) => {

        const { page = 1, limit = 10} = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );

        if( error ){
            res.status(400).json({ error });
            return;
        }

        this.productService.getProducts( paginationDto! )
            .then( product => res.json( product ))
            .catch( error => this.handlerError( error, res ))

    }

    createProduct = ( req: Request, res: Response ) => {

        const [ error, createProductDto] = CreateProductDto.create({
            ...req.body,
            user: req.body.user.id
        }); //el id lo tenemos en el user.id que viene en la req.body. REMINDER: para tener el user en el body primero tuvo que haber pasado por el Authmiddleware

        if( error ){
            res.status(400).json({ error });
            return;
        }

        this.productService.createProduct( createProductDto! )
            .then( product => res.json( product ))
            .catch( error => this.handlerError( error, res ))
    }
    
}