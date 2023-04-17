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
    const input = plainToClass(ProductInput, JSON.parse(event.body!));
    const error = await AppValidation(input);
    if (error) return ErrorResponse(404, error);

    const data = await this._repository.createProduct(input);
    return SucessResponse(data);
  }
  async getProducts(event: APIGatewayEvent) {
    const data = await this._repository.getAllProducts();
    return SucessResponse(data);
  }
  async getProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "please provide product id");

    const data = await this._repository.getProductById(productId);
    return SucessResponse(data);
  }
  async editProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "please provide product id");

    const input = plainToClass(ProductInput, JSON.parse(event.body!));
    const error = await AppValidation(input);
    if (error) return ErrorResponse(404, error);

    input.id = productId;
    const data = await this._repository.updateProduct(input);
    return SucessResponse(data);
  }
  async deleteProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "please provide product id");

    const data = await this._repository.deleteProduct(productId);
    return SucessResponse(data);
  }
}
