import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import logger from '../helpers/logger';
import { freemem } from 'os';
import { clearImmediate } from 'timers';

const { Schema } = mongoose;

const USER = 'User';

const UserSchema = new Schema({
	email: { type: String, trim: true, required: true, lowercase: true, unique: true },
	hash_password: { type: String, required: true },
	firstName: { type: String, trim: true },
	lastName: { type: String, trim: true },
	created: { type: Date, default: Date.now }
});

UserSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.hash_password);
}

const UserModel = mongoose.model(USER, UserSchema);

class UserRepository {
	static async createUser({ email, firstName, lastName, password }) {
		logger.log("...creating new user", firstName);
		const newUser = { email, firstName, lastName }
		newUser.hash_password = bcrypt.hashSync(password, 10);
		return await new UserModel(newUser).save();
	};

	static async findUserByEmail(email) {
		return await UserModel.findOne({ email });
	};

	static async findUserById(id) {
		return await UserModel.findById(id);
	};

	static async updateUserById(id, newUser) {
		return await UserModel.findByIdAndUpdate(id, newUser, { new: true });
	}
}

class UserDTO {
	constructor({ _id, email, firstName, lastName }) {
		this.id = _id;
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
	}
}

export { UserModel, UserRepository, UserDTO };