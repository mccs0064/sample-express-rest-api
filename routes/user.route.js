import express from 'express';
import authGuard from '../middlewears/authGuard';
import userController from '../controllers/user.controller';

const router = express.Router();

router.post('/', async (req, res) =>  await userController.create(req, res));
router.get('/:id', async (req, res) => await userController.get(req, res));
router.put('/', authGuard, async (req, res) =>  await userController.update(req, res));

export default router;