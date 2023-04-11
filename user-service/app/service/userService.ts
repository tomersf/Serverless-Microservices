import { APIGatewayProxyEventV2 } from "aws-lambda";
import { SucessResponse, ErrorResponse } from "../utility/response";
import { UserRepository } from "../repository/userRepository";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { SignupInput } from "../models/dto/SignupInput";
import { AppValidation } from "../utility/errors";
import {
  getSalt,
  getHashedPassword,
  validatePassword,
  getToken,
  verifyToken,
} from "../utility/password";
import { LoginInput } from "../models/dto/LoginInput";
import {
  generateAccessCode,
  sendVerificationCode,
} from "../utility/notification";
import { VerificationInput } from "../models/dto/VerificationInput";
import { TimeDifference } from "../utility/dateHelper";
import { ProfileInput } from "../models/dto/AddressInput";

@autoInjectable()
export class UserService {
  repository: UserRepository;
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async ResponseWithError(event: APIGatewayProxyEventV2) {
    return ErrorResponse(404, "requested method is not supported!");
  }

  // User Creation, Validation & Login
  async CreateUser(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(SignupInput, event.body);
      const error = await AppValidation(input);
      if (error) return ErrorResponse(404, error);

      const salt = await getSalt();
      const hashedPassword = await getHashedPassword(input.password, salt);
      const data = await this.repository.createAccount({
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
        salt,
        userType: "BUYER",
      });
      return SucessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async UserLogin(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(LoginInput, event.body);
      const error = await AppValidation(input);
      if (error) return ErrorResponse(404, error);
      const data = await this.repository.findAccount(input.email);
      const isVerifiedPassword = await validatePassword(
        input.password,
        data.password,
        data.salt
      );
      if (!isVerifiedPassword) throw new Error("password is incorrect!");
      const token = getToken(data);
      return SucessResponse({ token });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async GetVerificationToken(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization;
    const payload = await verifyToken(token);
    if (!payload) return ErrorResponse(403, "Authorization failed!");
    const { code, expiry } = generateAccessCode();
    await this.repository.updateVeirificationCode(
      payload.user_id,
      code,
      expiry
    );
    // await sendVerificationCode(code, payload.phone);

    return SucessResponse({
      message: "verification code was sent to your mobile",
    });
  }

  async VerifyUser(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization;
    const payload = await verifyToken(token);
    if (!payload) return ErrorResponse(403, "Authorization failed!");

    const input = plainToClass(VerificationInput, event.body);
    const error = await AppValidation(input);
    if (error) return ErrorResponse(404, error);

    const { verification_code, expiry } = await this.repository.findAccount(
      payload.email
    );
    if (verification_code === parseInt(input.code)) {
      const currentTime = new Date();
      const diff = TimeDifference(expiry, currentTime.toISOString(), "m");
      if (diff > 0) {
        console.log("verified successfully!");
        await this.repository.updateVerifyUser(payload.user_id);
      } else {
        return ErrorResponse(403, "verification code is expired");
      }
    }

    return SucessResponse({ message: "user verified" });
  }

  // User profile
  async CreateProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await verifyToken(token);
      if (!payload) return ErrorResponse(403, "Authorization failed!");

      const input = plainToClass(ProfileInput, event.body);
      const error = await AppValidation(input);
      if (error) return ErrorResponse(404, error);

      const result = await this.repository.createProfile(
        payload.user_id,
        input
      );

      return SucessResponse({ message: "profile created" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async GetProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await verifyToken(token);
      if (!payload) return ErrorResponse(403, "Authorization failed!");

      const result = await this.repository.getUserProfile(payload.user_id);
      return SucessResponse(result);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }
  async EditProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await verifyToken(token);
      if (!payload) return ErrorResponse(403, "Authorization failed!");

      const input = plainToClass(ProfileInput, event.body);
      const error = await AppValidation(input);
      if (error) return ErrorResponse(404, error);

      await this.repository.editProfile(payload.user_id, input);
      return SucessResponse({ message: "profile updated" });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  // Cart Section
  async CreateCart(event: APIGatewayProxyEventV2) {
    return SucessResponse({ message: "response from Create Cart" });
  }

  async GetCart(event: APIGatewayProxyEventV2) {
    return SucessResponse({ message: "response from Get Cart" });
  }

  async UpdateCart(event: APIGatewayProxyEventV2) {
    return SucessResponse({ message: "response from Update Cart" });
  }

  // Payment Section
  async CreatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SucessResponse({ message: "response from Create Payment Method" });
  }

  async GetPaymentMethod(event: APIGatewayProxyEventV2) {
    return SucessResponse({ message: "response from Get Payment Method" });
  }

  async UpdatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SucessResponse({ message: "response from Update Payment Method" });
  }
}
