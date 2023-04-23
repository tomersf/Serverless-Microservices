import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 as uuid } from "uuid";

const S3Client = new S3({ region: "eu-central-1" });

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const file = event.queryStringParameters?.file;
  const fileName = `${uuid()}__${file}`;

  const s3Params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    ContentType: "image/jpeg",
  };
  const command = new PutObjectCommand(s3Params);
  const signedURL = await getSignedUrl(S3Client, command);

  console.log("UPLOAD URL:", s3Params, signedURL);
  return {
    statusCode: 200,
    body: JSON.stringify({
      url: signedURL,
      key: fileName,
    }),
  };
};
