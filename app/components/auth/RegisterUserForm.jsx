"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const RegisterUserForm = () => {
  // const [name, setName] = useState<string>("");
  // const [surname, setSurname] = useState<string>("");
  // const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // DEVEL ONLY =================================
  const pathname = usePathname();
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('LoginForm.jsx: pathname:', pathname)
    }
  }, [pathname]);
  // ============================================

  const handleSubmit = async (e) => {
    console.log('RegisterUserForm: Running handleSubmit');
    e.preventDefault();
    if (password !== confirmPassword) { // Step 4: Check if passwords match
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError("");

    if (password.length < 8) {
      console.log("Password must be at least 8 characters long. Length:", password.length);
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    console.log('RegisterUserForm: Creating new user object');
    const newDoc = {
      // name: name,
      // surname: surname,
      // username: username,
      email: email,
      password: password,
    };
    console.log('RegisterUserForm: newDoc:', newDoc);

    try {
      console.log('\nRegisterUserForm: Making API request to URL: POST http://localhost:3000/api/auth/create-user', '\n')
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ email, password }),
        body: JSON.stringify(newDoc),
      });

      if (response.ok) {
        // Redirect or show success message
        router.push("/auth/register/success"); // assuming a success page exists
      } else {
        const errorMsg = await response.json();
        setError(errorMsg.message || "Something went wrong.");
        console.log(errorMsg.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to create account.");
      console.log("Failed to create account.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Step 3: Conditionally render error message */}
      <form onSubmit={handleSubmit}>
        <section>
          <label htmlFor="email" className="sr-only">Email:</label>
          <input
            type="text"
            name="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </section>
        <section>
          <label htmlFor="password" className="sr-only">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </section>
        <section> {/* Step 3: Add confirm password field */}
          <label htmlFor="confirmPassword" className="sr-only">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </section>
        {/* <button type="submit">sign-up</button> */}
        <button
          type="submit"
          disabled={loading}>{loading ? "Registering user...": "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterUserForm;
