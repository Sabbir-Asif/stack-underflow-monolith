const Minio = require('minio');

module.exports = async () => {
  const minioClient = new Minio.Client({
    endPoint: 'play.min.io',
  port: 9000,
  useSSL: true,
  accessKey: 'Q3AM3UQ867SPQQA43P2F',
  secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
});

const bucket = 'stack-underflow-sabbir';

// const exists = await minioClient.bucketExists(bucket);
// if (exists) {
//   console.log('Bucket ' + bucket + ' exists.')
// } else {
//   await minioClient.makeBucket(bucket, 'us-east-1')
//   console.log('Bucket ' + bucket + ' created in "us-east-1".')
// }
}