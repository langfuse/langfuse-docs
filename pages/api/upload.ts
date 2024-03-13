import Busboy from 'busboy';
import { BlobServiceClient } from '@azure/storage-blob';
import { NextApiRequest, NextApiResponse } from 'next';
 
export const config = {
  api: {
    bodyParser: false,
  },
};
 
export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const busboy = Busboy({ headers: req.headers });
 
  let uploadPromise: Promise<any> | null = null;
 
  busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerName = 'images';
    const containerClient = blobServiceClient.getContainerClient(containerName);
 
    const blobName = `${Date.now()}-${filename}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
 
    const options = { blobHTTPHeaders: { blobContentType: mimetype } };
 
    uploadPromise = blockBlobClient.uploadStream(file, undefined, undefined, options)
      .then(() => ({ blobName }))
      .catch((err) => {
        console.error('Error uploading file:', err);
        throw err;
      });
  });
 
  busboy.on('finish', async () => {
    if (uploadPromise) {
      const result = await uploadPromise;
      res.status(200).json(result);
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  });
 
  req.pipe(busboy);
}


// import { NextApiRequest, NextApiResponse } from "next";
// import { BlobServiceClient } from '@azure/storage-blob';


// export default async function POST(req: NextApiRequest, res: NextApiResponse) {
//   const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);

//   const containerName = 'images';
//   const containerClient = blobServiceClient.getContainerClient(containerName);
//   const blobName = `${Date.now()}.jpg`;
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);

//   const options = { blobHTTPHeaders: { blobContentType: 'image/jpeg' } };

//   const uploadBlobResponse = await blockBlobClient.upload(req.body, req.body.length ,options);

//   res.json(req.body);
// }
