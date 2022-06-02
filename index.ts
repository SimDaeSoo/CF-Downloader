import 'dotenv/config';
import AWS from 'aws-sdk';
import fs from 'fs';

async function getAllS3Object(region: string, Bucket: string, Prefix: string): Promise<AWS.S3.ObjectList> {
  const s3 = new AWS.S3({
    region,
    apiVersion: '2006-03-01',
  });
  const contents: AWS.S3.ObjectList = [];
  let ContinuationToken: string | undefined = undefined;

  do {
    const { Contents, NextContinuationToken }: AWS.S3.ListObjectsV2Output = await s3
      .listObjectsV2({
        Bucket,
        Prefix,
        ContinuationToken,
      })
      .promise();

    ContinuationToken = NextContinuationToken;
    contents.push(...(Contents as AWS.S3.ObjectList));
  } while (ContinuationToken);

  return contents;
}

async function main(): Promise<void> {
  const objects = await getAllS3Object('ap-northeast-2', 'pinkfong-super-resolution', 'outputs/');

  fs.writeFileSync('./objects.json', JSON.stringify(objects, null, 2));
}

main();
