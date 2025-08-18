import { Router } from 'express';
import { Authroutes } from './auth/routes';
import { CategoryRoutes } from './category/routes';
import { ProductRoutes } from './product/routes';



export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    // Routes
    router.use('/api/auth', Authroutes.routes );
    router.use('/api/categories', CategoryRoutes.routes);
    router.use('/api/products', ProductRoutes.routes);



    return router;
  }

}