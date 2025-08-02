import { BcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, LoginUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";


export class AuthService {

    //DI
    constructor(
        private readonly emailService: EmailService
    ){}


    public async registerUser( registerUserDto: RegisterUserDto ){

        const existeUser = await UserModel.findOne({ email: registerUserDto.email });
        if( existeUser ) throw CustomError.badRequest('Email already exist');

        try {
            
            const user = new UserModel( registerUserDto );
            
            // Encriptar la pass
            user.password = BcryptAdapter.hash( registerUserDto.password );
            await user.save();

            // Email de confirmacion
            await this.sendEmailValidationLink( user.email );

            const { password, ...userEntity} = UserEntity.fromObject( user ); //remuevo la pass

            const token = await JwtAdapter.generateToken( {id: user.id} );
            if( !token ) throw CustomError.internalServer('Error while creating JWT');

            return {
                user: userEntity,
                token: token
            };

        } catch (error) {
            throw CustomError.internalServer(`${ error }`);
        }

    }


    public async loginUser( loginUserDto: LoginUserDto ){

        const user = await UserModel.findOne({ email: loginUserDto.email });
        if( !user ) throw CustomError.badRequest(`User not exist with email: ${ loginUserDto.email }`);

        const isMatch = BcryptAdapter.compare( loginUserDto.password, user.password );
        if ( !isMatch ) throw CustomError.badRequest('User or password are incorrect');

        const { password, ...userEntity} = UserEntity.fromObject( user );

        const token = await JwtAdapter.generateToken( {id: user.id} );
        if( !token ) throw CustomError.internalServer('Error while creating JWT');

        return {
            user: userEntity,
            token: token
        };

    }


    public async validateEmail( token: string ){
        
        const payload = await JwtAdapter.validateToken( token );
        if( !payload ) throw CustomError.unauthorized('Invalid Token');

        const { email } = payload as { email: string };
        if( !email ) throw CustomError.internalServer('Email not found in token');

        const user = await UserModel.findOne({ email: email });
        if( !user ) throw CustomError.internalServer('Email not exists');

        user.emailValidated = true;
        await user.save();

        return true;
    }


    private sendEmailValidationLink = async( email: string ) => {
        
        //generar token
        const token = await JwtAdapter.generateToken({ email });
        if( !token ) throw CustomError.internalServer('Error while creating JWT');

        const link = `${ envs.WEBSERVICE_URL }/auth/validate-email/${ token }`;

        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${ link }">Click here</a>
        `

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        }

        const isSend = await this.emailService.sendEmail( options );
        if( !isSend ) throw CustomError.internalServer('Error sending email');

        return true;
    }

}