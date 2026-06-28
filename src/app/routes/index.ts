import express from 'express';
import { userRoutes } from '../modules/user/user.routes';



const router = express.Router();

const moduleRoutes = [
     {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/',
        route: router
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;