import express,{Request,Response} from 'express';
import { UserController } from './user.controller';




const router = express.Router();

router.post("/create-patient",
       UserController.createPatient

//     (req: Request,res: Response) => {
        
//     }
// 
)
export const userRoutes = router;