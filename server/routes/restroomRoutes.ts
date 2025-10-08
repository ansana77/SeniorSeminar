import { Router } from 'express';
import { getAllRestrooms, createRestroom } from '../controllers/restroomController.js';

const router: Router = Router();

router.route('/')
    .get(getAllRestrooms)
    .post(createRestroom);

export default router;