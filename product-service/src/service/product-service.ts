import { APIGatewayEvent } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { ProductInput } from "../dto/product-input";
import { ProductRepository } from "../repository/product-repository";
import { AppValidation } from "../utility/errors";
import { ErrorResponse, SucessResponse } from "../utility/response";

export class ProductService {
  _repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async createProduct(event: APIGatewayEvent) {
    const input = plainToClass(ProductInput, event.body);
    const error = await AppValidation(input);
    if (error) return ErrorResponse(404, error);

    const data = await this._repository.createProduct(input);
    return SucessResponse(data);
  }
  async getProducts(event: APIGatewayEvent) {
    return SucessResponse({ msg: "get products" });
  }
  async getProduct(event: APIGatewayEvent) {
    return SucessResponse({ msg: "get product by id" });
  }
  async editProduct(event: APIGatewayEvent) {
    return SucessResponse({ msg: "edit product" });
  }
  async deleteProduct(event: APIGatewayEvent) {
    return SucessResponse({ msg: "delete product" });
  }
}
