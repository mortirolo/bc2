import { NextResponse } from "next/server";
import AWS from "aws-sdk";
import multer from "multer";

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure Multer
// Multer is middleware for handling `multipart/form-data`, which is primarily used for uploading files.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PUT(req) {
  console.log('\nAPI, user/[id]: Running PUT for document update');
  // First check if the user is authenticated
  const session = await getServerSession(authOptions);
  console.log('API, user/[id]: session:', session);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  console.log('API, user/[id]: Session verified');

  // Get the file from the request using multer
  const form = new Promise((resolve, reject) => {
    upload.single('profile-image')(req, {}, (err) => {
      if (err) return reject(err);
      resolve(req.file);
    });
  });

  const file = await form;

  // Did we receive a file?
  console.log('API, user/[id]: req data:', file);
  if (!file) {
    return NextResponse.json({ message: 'No File Uploaded' }, { status: 400 });
  }

  // Create params for upload of file to S3
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  };

  try {
    const data = await s3.upload(params).promise();
    const imageUrl = data.Location;

    // Save the image URL to the user's profile in MongoDB
    const updateDoc = {
      profileImage: imageUrl,
    };
    console.log('API: updateDoc:', updateDoc)
    console.log('API, PUT: Writing update document to DB')

    const updatedUser = await User.findByIdAndUpdate(userId, updateDoc, { new: true });  // FIXME: do we need { new: true }?

    // Check if the document was found and updated
    if (!updatedUser) {
      console.error('API: Document not found or update failed');
      return NextResponse.json({ error: 'Document not found or update failed' }, { status: 404 });
    }
    
    console.log('API: Back from DB')
    console.log('API: updatedUser:', updatedUser)

    revalidatePath('/');  // Revalidate cached data at the root level (all data)
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('API: Error updating document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  };

};