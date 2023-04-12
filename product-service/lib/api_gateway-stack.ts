import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface APIGatewayStackProps {
  productService: IFunction;
}

export class APIGatewayStack extends Construct {
  constructor(scope: Construct, id: string, props: APIGatewayStackProps) {
    super(scope, id);
    this.addResource("product", props.productService);
  }

  addResource(serviceName: string, handler: IFunction) {
    const apiGW = new LambdaRestApi(this, `${serviceName}-ApiGtw`, {
      restApiName: `${serviceName}-Service`,
      handler,
      proxy: false,
    });

    const productResource = apiGW.root.addResource("product");
    productResource.addMethod("GET");
    productResource.addMethod("POST");

    const productIdResource = productResource.addResource("{id}");
    productIdResource.addMethod("GET");
    productIdResource.addMethod("PUT");
    productIdResource.addMethod("DELETE");

    const categoryResource = apiGW.root.addResource("category");
    categoryResource.addMethod("GET");
    categoryResource.addMethod("POST");

    const categoryIdResource = categoryResource.addResource("{id}");
    categoryIdResource.addMethod("GET");
    categoryIdResource.addMethod("PUT");
    categoryIdResource.addMethod("DELETE");

    const dealsResources = apiGW.root.addResource("deals");
    dealsResources.addMethod("GET");
    dealsResources.addMethod("POST");

    const dealsIdResource = dealsResources.addResource("{id}");
    dealsIdResource.addMethod("GET");
    dealsIdResource.addMethod("PUT");
    dealsIdResource.addMethod("DELETE");
  }
}
