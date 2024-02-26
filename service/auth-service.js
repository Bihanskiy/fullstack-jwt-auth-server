const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const tokenService = require('./token-service');
const userDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class AuthService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.FieldsError({ email: [`User with some email is exist`] });
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();

    const user = await UserModel.create({ email, password: hashPassword, activationLink });

    const userDtoData = userDto(user);
    const tokens = tokenService.generateTokens({ ...userDtoData });
    await tokenService.saveToken(userDtoData.id, tokens.refreshToken);

    return { ...tokens, user: userDtoData };
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw ApiError.FieldsError({ email: [`User with this email was not found`] });
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.FieldsError({ password: ['Incorrect password'] });
    }
    const userDtoData = userDto(user);
    const tokens = tokenService.generateTokens({ ...userDtoData });

    await tokenService.saveToken(userDtoData.id, tokens.refreshToken);
    return { ...tokens, user: userDtoData }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink })
    if (!user) {
      throw ApiError.FieldsError({ common: 'Incorrect activation link' })
    }
    user.isActive = true;
    await user.save();
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDtoData = userDto(user);
    const tokens = tokenService.generateTokens({ ...userDtoData });

    await tokenService.saveToken(userDtoData.id, tokens.refreshToken);
    return { ...tokens, user: userDtoData }
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new AuthService();