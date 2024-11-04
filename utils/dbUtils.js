import User from '@/app/models/userModel.js';

export async function getSanitizedUserData(id) {
  try {
    console.log('/utils/dbUtils/getSanitizedUserData: Calling fetchUser with id:', id);
    const user = await User.findById(id);

    if (!user) {
      throw new Error('User not found');
    }
    // Sanitize user object
    const cleanUser = {
      id: user._id.toString(),  // Make sure it's a string, not an object
      name: user.name,
      surname: user.surname,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    };
    console.log('/utils/dbUtils/getSanitizedUserData: cleanUser:', cleanUser);

    return cleanUser;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};