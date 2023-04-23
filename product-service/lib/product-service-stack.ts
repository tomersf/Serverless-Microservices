import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { APIGatewayStack } from "./api_gateway-stack";
import { S3BucketStack } from "./s3bucket-stack";
import { ServiceStack } from "./service-stack";

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { bucket } = new S3BucketStack(this, "productsImages");
    const { productService, categoryService, dealsService, imageService } =
      new ServiceStack(this, "ProductService", {
        bucket: bucket.bucketName,
      });

    bucket.grantReadWrite(imageService);

    new APIGatewayStack(this, "ProductAPIGateway", {
      productService,
      categoryService,
      dealsService,
      imageService,
    });
  }
}
