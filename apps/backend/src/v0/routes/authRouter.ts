import { Router } from 'express';
import { getMe, signupOrSignin, verifyToken } from '../controllers/authController';
import { isAuthenticated } from '../middlewares/isAuthenticated';

const router = Router();

router.post('/signup', signupOrSignin);
router.post('/signin', signupOrSignin);

router.get('/signin/post', verifyToken);

router.get('/me', isAuthenticated, getMe);

export { router as authRouter };
