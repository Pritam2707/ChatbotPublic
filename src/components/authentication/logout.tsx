import { auth } from "../../firebase";
const SignOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export default SignOut;
