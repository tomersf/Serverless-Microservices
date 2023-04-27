import { aws_apigateway } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface APIGatewayStackProps {
  productService: IFunction;
  categoryService: IFunction;
  dealsService: IFunction;
  imageService: IFunction;
  queueService: IFunction;
}

interface ResourceType {
  name: string;
  methods: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE">;
  child?: ResourceType;
}

export class APIGatewayStack extends Construct {
  constructor(scope: Construct, id: string, props: APIGatewayStackProps) {
    super(scope, id);
    this.addResource("product", props);
  }

  addResource(
    serviceName: string,
    {
      productService,
      categoryService,
      dealsService,
      imageService,
      queueService,
    }: APIGatewayStackProps
  ) {
    const apiGW = new aws_apigateway.RestApi(this, `${serviceName}-ApiGtw`);

    this.createEndpoints(productService, apiGW, {
      name: "product",
      methods: ["GET", "POST"],
      child: {
        name: "{id}",
        methods: ["GET", "PUT", "DELETE"],
      },
    });

    this.createEndpoints(categoryService, apiGW, {
      name: "category",
      methods: ["GET", "POST"],
      child: {
        name: "{id}",
        methods: ["GET", "PUT", "DELETE"],
      },
    });

    this.createEndpoints(dealsService, apiGW, {
      name: "deals",
      methods: ["GET", "POST"],
      child: {
        name: "{id}",
        methods: ["GET", "PUT", "DELETE"],
      },
    });

    this.createEndpoints(imageService, apiGW, {
      name: "uploader",
      methods: ["GET"],
    });

    this.createEndpoints(queueService, apiGW, {
      name: "products-queue",
      methods: ["POST"],
    });
  }

  createEndpoints(
    handler: IFunction,
    resource: RestApi,
    { name, methods, child }: ResourceType
  ) {
    const lambdaFunction = new LambdaIntegration(handler);
    const rootResource = resource.root.addResource(name);
    methods.map((method) => {
      rootResource.addMethod(method, lambdaFunction);
    });

    if (child) {
      const childResource = rootResource.addResource(child.name);
      child.methods.map((method) => {
        childResource.addMethod(method, lambdaFunction);
      });
    }
  }
}
