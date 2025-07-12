import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

export default async function getUrl(url: string) {
  const imgRef = ref(storage, url);

  try {
    const downloadURL = await getDownloadURL(imgRef);
    return downloadURL;
  } catch (err: any) {
    if (err) {
      console.error(err)
    }
    return null;
  }
}
