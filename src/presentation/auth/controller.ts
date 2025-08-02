import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";




export class AuthController {

    //DI
    constructor(
        public readonly authService: AuthService
    ){}
    

    private handlerError = (error: unknown, res: Response) => {
        if( error instanceof CustomError ){
            res.status( error.statusCode ).json({ error: error.message });
            return;
        }

        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }


    register = (req: Request, res: Response) => {
        
        const [error, registerDto] = RegisterUserDto.create( req.body );

        if( error ){
            res.status(400).json({ error });
            return;
        }

        this.authService.registerUser( registerDto! )
            .then( user => res.json( user ) )
            .catch( error => this.handlerError( error, res ) )
    }


    login = (req: Request, res: Response) => {

        const [error, loginUserDto] = LoginUserDto.create( req.body );

        if( error ){
            res.status(400).json({ error });
            return;
        }

        this.authService.loginUser( loginUserDto! )
            .then( user => res.json( user ) )
            .catch( error => this.handlerError( error, res ) )
    }


    validateEmail = (req: Request, res: Response) => {

        const { token } = req.params;
        
        this.authService.validateEmail( token )
            .then( () => res.json('Email validated!') )
            .catch( error => this.handlerError( error, res) )

    }

}