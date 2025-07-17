// import { GoogleLogin } from "@react-oauth/google";
// import {jwtDecode} from "jwt-decode";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // Adjust path if needed

// export default function GoogleAuthButton() {
//   const navigate = useNavigate();
//   const { setUser } = useAuth();

//   const handleGoogleSuccess = (credentialResponse) => {
//     console.log("Success: ", credentialResponse);

//     if (!credentialResponse?.credential) {
//       console.error("No credential received");
//       return;
//     }

//     try {
//       const decoded = jwtDecode(credentialResponse.credential);
//       console.log("Decoded: ", decoded);

//       // Save to context and localStorage
//       setUser(decoded);
//       localStorage.setItem("user", JSON.stringify(decoded));

//       // ✅ Redirect to dashboard
//       navigate("/dashboard");
//     } catch (err) {
//       console.error("JWT Decode Error:", err);
//     }
//   };

//   const handleError = () => {
//     console.error("Google Login Failed");
//   };

//   return (
//     <GoogleLogin
//       onSuccess={handleGoogleSuccess}
//       onError={handleError}
//       theme="outline"
//       size="large"
//       shape="rectangular"
//       width="300"
//       text="signin_with"
//     />
//   );
// }
