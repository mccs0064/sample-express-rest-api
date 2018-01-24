import HttpStatus from 'http-status-codes';
import { UserRepository, UserDTO } from '../models/user';
import jwt from 'jsonwebtoken';
import config from '../config.json';
import logger from '../helpers/logger';

async function get(req, res) {
	try {
		const existingUser = await UserRepository.findUserById(req.params.id);
		if (!existingUser) {
			logger.info('user not found');
			return res.status(HttpStatus.NOT_FOUND).send({'message':'User not found'});
		}
		return res.status(HttpStatus.ACCEPTED).send(new UserDTO(existingUser));
	} catch (e) {
		return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
	}
};

async function create(req, res) {
	try {
		const existingUser = await UserRepository.findUserByEmail(req.body.email);
		if (existingUser) {
			logger.info('user exists', req.body.email);
			return res.status(HttpStatus.BAD_REQUEST).send({'message':'User exists'});
		}
		const newUser = await UserRepository.createUser(req.body);
		res.status(HttpStatus.CREATED).send(new UserDTO(newUser));
	} catch (e) {
		res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
	}
};

async function update(req, res) {
	try {
		const existingUser = await UserRepository.findUserById(req.user.id);
		if (!existingUser) {
			logger.info('User not found')
			return res.status(HttpStatus.BAD_REQUEST).send({'message':'User not found'});
		}
		const newUser = await UserRepository.updateUserById(req.user.id, req.body);
		logger.info('updated user ', newUser.email);
		res.status(HttpStatus.ACCEPTED).send(new UserDTO(newUser));
	} catch (e) {
		res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
	}
};

async function signIn(req, res) {
	try {
		const existingUser = await UserRepository.findUserByEmail(req.body.email);
		if (!existingUser) {
			logger.info('user not found');
			return res.status(HttpStatus.BAD_REQUEST).send({'message':'User not found'});
		}
		if (!existingUser.comparePassword(req.body.password)) {
			res.status(HttpStatus.UNAUTHORIZED).json({'message':'Authentication failed. Wrong password'});
		} else {
			const loggedInUser = new UserDTO(existingUser);
			return res.status(HttpStatus.OK).send({ token: jwt.sign(JSON.stringify(loggedInUser), config.secret) });
		}
	}
	catch (e) {
		res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
	}
};

export default { get, create, update, signIn };