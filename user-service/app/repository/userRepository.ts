import { AddressModel } from "../models/AddressModel";
import { ProfileInput } from "../models/dto/AddressInput";
import { UserModel } from "../models/UserModel";
import { DBOperation } from "./dbOperation";

export class UserRepository extends DBOperation {
  constructor() {
    super();
  }

  async createAccount({ email, password, phone, salt, userType }: UserModel) {
    const queryString =
      "INSERT INTO users(phone,email,password,salt,user_type) VALUES ($1,$2,$3,$4,$5) RETURNING *";
    const values = [phone, email, password, salt, userType];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
  }

  async findAccount(email: string) {
    const queryString =
      "SELECT user_id, email, password, phone, salt, verification_code, expiry FROM users WHERE email = $1";
    const values = [email];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount < 1) {
      throw new Error("user with the provided email was not found");
    }
    return result.rows[0] as UserModel;
  }

  async updateVeirificationCode(userId: number, code: number, expiry: Date) {
    const queryString =
      "UPDATE users SET verification_code=$1, expiry=$2 WHERE user_id=$3 AND verified=FALSE RETURNING *";
    const values = [code, expiry, userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("user already verified");
  }

  async updateVerifyUser(userId: number) {
    const queryString =
      "UPDATE users SET verified=TRUE WHERE user_id=$1 AND verified=FALSE RETURNING *";
    const values = [userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("user already verified");
  }

  async updateUser(
    userId: number,
    firstName: string,
    lastName: string,
    userType: string
  ) {
    const queryString =
      "UPDATE users SET first_name=$1, last_name=$2, user_type=$3 WHERE user_id=$4 RETURNING *";
    const values = [firstName, lastName, userType, userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("error while updating user");
  }

  async createProfile(
    userId: number,
    {
      firstName,
      lastName,
      userType,
      address: { addressLine1, addressLine2, city, country, postCode },
    }: ProfileInput
  ) {
    await this.updateUser(userId, firstName, lastName, userType);
    const queryString =
      "INSERT INTO address(user_id,address_line1,address_line2,city,post_code,country) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *";
    const values = [
      userId,
      addressLine1,
      addressLine2,
      city,
      postCode,
      country,
    ];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as AddressModel;
    }
    throw new Error("error while creating profile");
  }

  async getUserProfile(userId: number) {
    const profileQuery =
      "SELECT first_name, last_name, email, phone, user_type, verified FROM users WHERE user_id=$1";
    const profileValues = [userId];
    const profileResult = await this.executeQuery(profileQuery, profileValues);
    if (profileResult.rowCount < 1) {
      throw new Error("user profile does not exist");
    }

    const userProfile = profileResult.rows[0] as UserModel;
    const addressQuery =
      "SELECT id, address_line1, address_line2, city, post_code, country FROM address WHERE user_id=$1";
    const addressValues = [userId];
    const addressResult = await this.executeQuery(addressQuery, addressValues);
    if (addressResult.rowCount > 0) {
      userProfile.address = addressResult.rows as AddressModel[];
    }

    return userProfile;
  }

  async editProfile(
    userId: number,
    {
      firstName,
      lastName,
      userType,
      address: { addressLine1, addressLine2, city, country, postCode, id },
    }: ProfileInput
  ) {
    await this.updateUser(userId, firstName, lastName, userType);
    const addressQuery =
      "UPDATE address SET address_line1=$1, address_line2=$2, city=$3, post_code=$4, country=$5 WHERE id=$6";
    const addressValues = [
      addressLine1,
      addressLine2,
      city,
      postCode,
      country,
      id,
    ];
    const addressResult = await this.executeQuery(addressQuery, addressValues);
    if (addressResult.rowCount < 1) {
      throw new Error("error while updating profile");
    }
    return true;
  }
}
