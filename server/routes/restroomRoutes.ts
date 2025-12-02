import { Router } from 'express';
import { 
    getAllRestrooms, 
    createRestroom, 
    checkRestroomExists,
    getRestroomsInBounds,
    getNearbyRestrooms 
} from '../controllers/restroomController.js';

const router: Router = Router();

router.route('/')
    .get(getAllRestrooms)
    .post(createRestroom);

router.route('/check-exists').get(checkRestroomExists);
router.route('/in-bounds').get(getRestroomsInBounds);
router.route('/nearby').get(getNearbyRestrooms);

export default router;