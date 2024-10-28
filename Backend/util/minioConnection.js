const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: '127.0.0.1',
  port: 9000,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin',
  useSSL: false,
  pathStyle: true
});

async function checkBucket() {
  const bucket = 'stackunderflow';

  try {
    const exists = await minioClient.bucketExists(bucket);
    if (exists) {
      console.log('Bucket ' + bucket + ' exists.');
    } else {
      console.log('Bucket does not exist. Creating bucket...');
      await minioClient.makeBucket(bucket, 'us-east-1');
      console.log('Bucket ' + bucket + ' created successfully.');
    }
  } catch (err) {
    console.error('Error checking or creating bucket:', err);
  }
}

module.exports = { minioClient, checkBucket };
