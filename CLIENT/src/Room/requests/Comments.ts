import { db } from "../../firebase";
import {
  doc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  getDoc,
} from "firebase/firestore";


export const fetchComments = async () => {
  const commentsSnapshot = await getDocs(collection(db, "Room-Comments"));
  return commentsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      user: data.user || "",
      creatorId: data.creatorId || "", 
      date: data.date || "",
      content: data.content || "",
      likes: data.likes || [],
    };
  });
};


export const addComment = async (commentData: {
  user: string;
  creatorId: string; 
  content: string;
  date: string;
  likes: string[];
}) => {
  await addDoc(collection(db, "Room-Comments"), commentData);
};


export const deleteComment = async (commentId: string) => {
  await deleteDoc(doc(db, "Room-Comments", commentId));
};


export const likeComment = async (commentId: string, userId: string) => {
  const commentRef = doc(db, "Room-Comments", commentId);
  const commentDoc = await getDoc(commentRef);

  if (commentDoc.exists()) {
    const commentData = commentDoc.data();
    if (commentData.likes.includes(userId)) {
      await updateDoc(commentRef, {
        likes: arrayRemove(userId),
      });
    } else {
      await updateDoc(commentRef, {
        likes: arrayUnion(userId),
      });
    }
  }
};
