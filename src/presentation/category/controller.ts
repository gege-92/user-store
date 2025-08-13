import { Request, Response } from "express";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";
import { CategoryModel } from "../../data";
import { CategoryService } from "../services/category.service";


export class CategoryController {


    constructor(
        private readonly categoryService: CategoryService
    ){}


    private handlerError = (error: unknown, res: Response) => {
        if( error instanceof CustomError ){
            res.status( error.statusCode ).json({ error: error.message });
            return;
        }
    
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }


    getCategories = ( req:Request, res:Response ) => {

        const { page = 1, limit = 10} = req.query;
        const [ error, paginationDto ] = PaginationDto.create( +page, +limit );

        if( error ){
            res.status(400).json({ error });
            return;
        }

        this.categoryService.getCategories( paginationDto! )
            .then( category => res.status(200).json(category))
            .catch( error => this.handlerError( error, res ));
    }

    createCategory = ( req:Request, res:Response ) => {
        
        const [ error, createCategoryDto ] = CreateCategoryDto.create( req.body );

        if( error ){
            res.status(400).json({ error });
            return;
        }

        this.categoryService.createCategory( createCategoryDto!, req.body.user )
            .then( category => res.status(201).json( category ))
            .catch( error => this.handlerError( error, res ));
    }
}