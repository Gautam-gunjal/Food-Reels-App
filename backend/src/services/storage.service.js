const ImageKit = require("@imagekit/nodejs");

const client = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});
async function uploadfile(fileBuffer, filename) {
  try {
    const base64File = fileBuffer.toString("base64");

    const response = await client.files.upload({
      file: base64File,
      fileName: filename,
    });

    return response;
  } catch (err) {
    console.log("IMAGEKIT ERROR:", err);
    throw err;
  }
}

module.exports = {
  uploadfile,
};