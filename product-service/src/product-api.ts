import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ProductRepository } from "./repository/product-repository";
import { ProductService } from "./service/product-service";
import { ErrorResponse } from "./utility/response";

const service = new ProductService(new ProductRepository());

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const isRoot = event.pathParameters === null;

  switch (event.httpMethod.toLowerCase()) {
    case "post":
      if (isRoot) {
        return service.createProduct();
      }
      break;
    case "get":
      return isRoot ? service.getProducts() : service.getProduct();
    case "put":
      if (!isRoot) {
        return service.editProduct();
      }
    case "delete":
      if (!isRoot) {
        return service.deleteProduct();
      }
  }

  return ErrorResponse(404, "requested method not allowed");
};
