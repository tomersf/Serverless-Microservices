import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { APIGatewayStack } from "./api_gateway-stack";
import { ServiceStack } from "./service-stack";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const { productService } = new ServiceStack(this, "ProductService", {});
    new APIGatewayStack(this, "ProductAPIGateway", { productService });
  }
}
