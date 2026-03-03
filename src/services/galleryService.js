import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const fetchGallery = async () => {
  const galleryRef = collection(db, "gallery");
  const snapshot = await getDocs(galleryRef);

  const gallery = snapshot.docs.map((g) => ({
    id: g.id,
    ...g.data(),
  })).sort((a, b) => a.order - b.order);
  return gallery;
};
