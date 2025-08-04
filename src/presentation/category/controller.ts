import { Request, Response } from "express";
import { CustomError } from "../../domain";


export class CategoryController {


    constructor(){}


    private handlerError = (error: unknown, res: Response) => {
        if( error instanceof CustomError ){
            res.status( error.statusCode ).json({ error: error.message });
            return;
        }
    
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }


    getCategories = async( req:Request, res:Response ) => {
        res.json('getCategories');
    }

    createCategory = async( req:Request, res:Response ) => {
        res.json('createCategory');
    }
}