import { GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth"; //call google signin from firebase 
import { auth } from "../../firebase"; //firebase config file 
//signin with google
const googleSignIn = () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    signInWithPopup(auth, provider);
  }
  catch (error) {
    console.log(error);
  }
};
export default googleSignIn;