import { APIGatewayEvent } from "aws-lambda";
import { plainToClass } from "class-transformer";
import { ProductInput } from "../dto/product-input";
import { CategoryRepository } from "../repository/category-repository";
import { ProductRepository } from "../repository/product-repository";
import { AppValidation } from "../utility/errors";
import { ErrorResponse, SucessResponse } from "../utility/response";

export class ProductService {
  _repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async ResponseWithError(event: APIGatewayEvent) {
    return ErrorResponse(404, new Error("Method not allowed"));
  }

  async createProduct(event: APIGatewayEvent) {
    const input = plainToClass(ProductInput, event.body);
    const error = await AppValidation(input);
    if (error) return ErrorResponse(404, error);

    const data = await this._repository.createProduct(input);
    await new CategoryRepository().addItem({
      id: input.category_id,
      products: [data._id],
    });

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

    const input = plainToClass(ProductInput, event.body);
    const error = await AppValidation(input);
    if (error) return ErrorResponse(404, error);

    input.id = productId;
    const data = await this._repository.updateProduct(input);
    return SucessResponse(data);
  }
  async deleteProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "please provide product id");

    const { category_id, deleteResult } = await this._repository.deleteProduct(
      productId
    );

    await new CategoryRepository().removeItem({
      id: category_id,
      products: [productId],
    });

    return SucessResponse(deleteResult);
  }
}
