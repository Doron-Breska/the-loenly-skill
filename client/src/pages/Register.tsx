import axios from "axios";
import React, { useRef, useEffect } from "react";

const Register = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const sexRef = useRef<HTMLSelectElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const [location, setLocation] = React.useState({
    latitude: "",
    longitude: "",
  });
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        (error) => {
          console.error("Error Code = " + error.code + " - " + error.message);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  console.log("The Location :", location);

  // Example of triggering getLocation automatically when the component mounts
  useEffect(() => {
    getLocation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (
      !usernameRef.current?.value ||
      !emailRef.current?.value ||
      !ageRef.current?.value ||
      !passwordRef.current?.value ||
      !bioRef.current?.value ||
      !sexRef.current?.value
    ) {
      console.error("Please fill out all required fields");
      alert("Please fill out all required fields");
      return;
    } else if (!location.latitude || location.longitude) {
      console.error("Allow acces to  GPS / location services");
      alert("Allow acces to  GPS / location services");

      return;
    }
    // Example of how to access the values
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const age = ageRef.current?.value;
    const sex = sexRef.current?.value;
    const password = passwordRef.current?.value;
    const bio = bioRef.current?.value;
    const selectedFile = imgRef.current?.files && imgRef.current.files[0];
    const imageValue =
      selectedFile ||
      "https://res.cloudinary.com/danq3q4qv/image/upload/v1683035195/avatars/default-profile-picture-avatar-photo-placeholder-vector-illustration-700-205664584_z4jvlo.jpg";

    console.log({ username, email, age, sex, password, bio, imageValue });

    try {
      const formData = new FormData();
      formData.append("username", usernameRef.current?.value);
      formData.append("email", emailRef.current?.value);
      formData.append("password", passwordRef.current?.value);
      formData.append("age", ageRef.current?.value);
      formData.append("sex", sexRef.current?.value);
      formData.append("bio", bioRef.current?.value);
      formData.append("latitude", location.latitude);
      formData.append("longitude", location.longitude);

      if (selectedFile) {
        formData.append("userImg", selectedFile);
      } else {
        formData.append(
          "userImg",
          "https://res.cloudinary.com/danq3q4qv/image/upload/v1683035195/avatars/default-profile-picture-avatar-photo-placeholder-vector-illustration-700-205664584_z4jvlo.jpg"
        );
      }
      const response = await axios.post(
        "http://localhost:5005/api/users/new",
        formData
      );
      console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Extract error messages
        const errorMessage =
          error.response.data.error ||
          "An unexpected error occurred. Please try again later.";
        // Display the error message to the user
        // You can use a modal, toast, or any notification component to show errors
        alert(errorMessage);
      } else {
        // Handle network errors or other issues
        alert(
          "A network or unknown error occurred. Please check your connection and try again."
        );
      }
    }
  };

  return (
    <>
      <h1>Registration page</h1>
      <form onSubmit={handleSubmit}>
        <input ref={usernameRef} type="text" required placeholder="username" />
        <input ref={emailRef} type="email" required placeholder="email" />
        <input ref={ageRef} type="number" required min={18} max={120} />

        <select ref={sexRef} required>
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-Binary">Non-Binary</option>
          <option value="Transgender">Transgender</option>
          <option value="Intersex">Intersex</option>
          <option value="Prefer Not to Say">Prefer Not to Say</option>
          <option value="Other">Other</option>
        </select>
        <input ref={passwordRef} type="text" required placeholder="password" />
        <textarea
          className="mt-1"
          ref={bioRef}
          required
          rows={3}
          placeholder="user bio"
        />
        <label>Img:</label>
        <input
          type="file"
          id="fileInput"
          className="hidden-file-input"
          ref={imgRef}
          accept=".png, .jpg, .jpeg"
        />

        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Register;
