import { db } from '../../firebase';
import { doc, getDoc } from "firebase/firestore";
import { User } from '../types/User';

async function Searchuser(Useruid: string) {
  try {
    const userRef = doc(db, "users", Useruid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      console.error("User does not exist")
    }
  } catch (error) {
    console.error(error)
  }
}


export default Searchuser;
