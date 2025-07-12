import { deleteDoc, doc } from "firebase/firestore";
import { db } from '../../firebase'
const DeleteMessage = async (MessageRef: string) => {
    try {
        deleteDoc(doc(db, MessageRef));
        return "Deleted!";
    } catch (err) {

    }
}
export default DeleteMessage;