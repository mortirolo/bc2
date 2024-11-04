'use client'
import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/client';
import { usePathname } from 'next/navigation';  // client-side only
import { useRouter } from 'next/navigation'

const UserSettings = ({ user }) => {
  console.log('UserSettings: user:', user);
  // const { data: session } = useSession();
  const [userId] = useState(user.id);
  const router = useRouter();

  const [name, setName] = useState(user.name ? user.name : '');
  const [surname, setSurname] = useState(user.surname ? user.surname : '');
  const [username, setUsername] = useState(user.username ? user.username : '');
  const [email, setEmail] = useState(user.email ? user.email : '');
  const [profileImage, setProfileImage] = useState(user.profileImage ? user.profileImage : '');

  const [UPError, setUPError] = useState("");
  const [loading, setLoading] = useState(false);

  console.log('UserSettings: user:', user);
  console.log(`UserSettings: name: ${name}, user.name: ${user.name}, name === user.name: ${name === user.name}`);

  // DEVEL ONLY =================================
  if (process.env.NODE_ENV === 'development') {
    const pathname = usePathname();
    useEffect(() => {
      console.log('LoginForm.jsx: pathname:', pathname)
    }, [pathname]);
  }
  // ============================================

  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleUpdateUserProfile = async (e) => {
    e.preventDefault();
    setUPError(null);  // Clear previous errors
    setLoading(true);
    console.log('\n==============================================')
    console.log('UserSettings: Running handleUpdateUserProfile');
    console.log(`UserSettings: name: ${name}, user.name: ${user.name}, name !== user.name: ${name !== user.name}, user.name != null: ${user.name != null}`);
    console.log(`UserSettings: surname: ${surname}, user.surname: ${user.surname}, surname !== user.surname: ${surname !== user.surname}`);
    console.log(`UserSettings: username: ${username}, user.username: ${user.username}, username !== user.username: ${username !== user.username}`);
    // console.log(`UserSettings: profileImage: ${profileImage}, user.profileImage: ${user.profileImage}, profileImage === user.profileImage: ${profileImage === user.profileImage}`);

    // We only want to update fields that have changed in a valid way
    // Initial conditions of name = "", user.name = undefined
    const newDoc = {};
    if ((name === "" && user.name != null) || (name !== "" && name !== user.name)) newDoc.name = name;  // != null covers both null and undefined
    if ((surname === "" && user.surname != null) || (surname !== "" && surname !== user.surname)) newDoc.surname = surname;  // != null covers both null and undefined
    if ((username === "" && user.username != null) || (username !== "" && username !== user.username)) newDoc.username = username;  // != null covers both null and undefined
    // if ((profileImage === "" && user.profileImage != null) || (profileImage !== "" && profileImage !== user.profileImage)) newDoc.profileImage = profileImage;  // != null covers both null and undefined
    console.log('handleUpdateUserProfile: newDoc:', newDoc);

    if (Object.keys(newDoc).length === 0) {
      console.log('handleUpdateUserProfile: No changes detected');
      // router.replace(`/user/${userId}/settings`);
      router.refresh(`/user/${userId}/settings`);
      return;  // No changes were made
    }

    try {
      const api_path = `/api/user/${userId}/profile`;
      console.log(`\nhandleUpdateUserProfile: Making API request to URL: PUT http://localhost:3000/${api_path}`, '\n')
      const res = await fetch(api_path, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDoc),
      });
      console.log('handleUpdateUserProfile: Back from API; res:', res);

      if (res.ok) {
        console.log('handleUpdateUserProfile: res ok, refreshing settings page');
        // Stay on settings page and update fields
        // router.push("/auth/register/success"); // assuming a success page exists
        router.refresh(`/user/${userId}/settings`);
        // router.replace(`/user/${userId}/settings`);
        // router.push(`/user/${userId}/settings`);
      } else {
        setUPError('Profile update failed.');
        console.log('UserSettings: handleUpdateUserProfile failed, res.error:', res.error);
      }
    } catch (err) {
      setUPError('An unexpected error occurred.  Please try again.');
      console.error('An error occurred during login; try/catch failed:', err);
    }
  };


  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setUPError(null);  // Clear previous errors
    setLoading(true);
    console.log('\n==============================================')
    console.log('UserSettings: Running handleUpdateEmail');

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setUPError('Invalid email format.');
      setLoading(false);
      return;
    }

    console.log(`UserSettings: email: ${email}, user.email: ${user.email}, email !== user.email: ${email !== user.email}`);
    // We only want to update email if it has changed
    const newDoc = {};
    if (email !== user.email ) {
      newDoc.tempNewEmail = email;
    } else {
      console.log('handleUpdateEmail: No change detected');
      // router.replace(`/user/${userId}/settings`);
      router.refresh(`/user/${userId}/settings`);
      return;  // No changes were made
    }
    console.log('handleUpdateEmail: newDoc:', newDoc);

    try {
      const api_path = `/api/user/${userId}/update-email`;
      console.log(`\nhandleUpdateEmail: Making API request to URL: PUT http://localhost:3000/${api_path}`, '\n')
      const res = await fetch(api_path, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDoc),
      });
      console.log('handleUpdateEmail: Back from API; res:', res);

      if (res.ok) {
        console.log('handleUpdateEmail: res ok, refreshing settings page');
        // Stay on settings page and update fields
        // router.push("/auth/register/success"); // assuming a success page exists
        router.refresh(`/user/${userId}/settings`);
        // router.replace(`/user/${userId}/settings`);
        // router.push(`/user/${userId}/settings`);
      } else {
        setUPError('Email update failed.');
        console.log('UserSettings: handleUpdateEmail failed, res.error:', res.error);
      }
    } catch (err) {
      setUPError('An unexpected error occurred.  Please try again.');
      console.error('An error occurred during login; try/catch failed:', err);
    }
  };


  return (
    <div>
      <h1>User Settings</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>userId: {JSON.stringify(userId, null, 2)}</pre>

      <hr />
      {/** ====== USER PROFILE FORM ====== */}
      <h3>User Profile:</h3>
      <form onSubmit={handleUpdateUserProfile}>
        <section>
          <label htmlFor="name" className="">Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </section>
        <section>
          <label htmlFor="surname" className="">Surname:</label>
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
          />
        </section>
        <section>
          <label htmlFor="username" className="">Username (optional):</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </section>
        <section style={{ color: 'lightcoral' }}>
          <label htmlFor="profileImage" className="">Profile Image:</label>
          <input
            disabled={true}
            type="file"
            name="profileImage"
            value={profileImage}
            onChange={handleProfileImageChange}
          />
          {'<-'} Logic not yet implemented
        </section>
        <button type="submit">Update User Profile</button>
      </form>

      {/** ====== CHANGE EMAIL FORM ====== */}
      <hr style={{color: 'gainsboro'}}/>
      <h4>Change Email</h4>
      {UPError && <div style={{ color: 'red' }}>{UPError}</div>}
      <form onSubmit={handleUpdateEmail}>
        <section>
          <label htmlFor="email" className="">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </section>
        <button type="submit">Update Email</button>
      </form>
      <hr />

      {/** ====== ACCOUNT SETTINGS ====== */}
      <h3>Account Settings:</h3>
      <span style={{ color: 'lightcoral' }}>Future work</span>
      <hr />

      {/** ====== UI SETTINGS ====== */}
      <h3>UI Settings:</h3>
      <span style={{ color: 'lightcoral' }}>Future work</span>
      <hr />

      {/** ====== COMMUNICATION SETTINGS ====== */}
      <h3>Communication Settings:</h3>
      <span style={{ color: 'lightcoral' }}>Future work</span>
      <hr />

    </div>
  );
}

export default UserSettings;