import { Router } from 'express';
import { Authroutes } from './auth/routes';
import { CategoryRoutes } from './category/routes';



export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Routes
    router.use('/api/auth', Authroutes.routes );
    router.use('/api/categories', CategoryRoutes.routes);



    return router;
  }

}