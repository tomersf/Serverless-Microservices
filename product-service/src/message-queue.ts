import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";

import { ProductRepository } from "./repository/product-repository";
import { ProductService } from "./service/product-service";
import "./utility";

const service = new ProductService(new ProductRepository());

export const handler = middy(
  (
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> => {
    return service.handleQueueOperation(event);
  }
).use(bodyParser());
