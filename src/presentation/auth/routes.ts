import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService, EmailService } from '../services/';
import { envs } from '../../config';



export class Authroutes {


  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );

    const authService = new AuthService( emailService );
    const controller = new AuthController( authService );
    
    // Routes
    router.post('/register', controller.register );
    router.post('/login', controller.login );

    router.get('/validate-email/:token', controller.validateEmail );



    return router;
  }

}