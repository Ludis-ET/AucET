import { useState, useEffect } from "react";
import { BiHeart } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import { useAuth } from "../../Context";
import {
  fetchComments,
  addComment,
  deleteComment,
  likeComment,
} from "../requests";
import toast from "react-hot-toast";

type Comment = {
  id: string;
  user: string;
  creatorId: string; // Added creatorId to store user ID
  date: string;
  content: string;
  likes: string[];
};

export const CommentSection = () => {
  const { profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await fetchComments();
      setComments(fetchedComments);
    };
    loadComments();
  }, []);

  const handleLike = async (commentId: string) => {
    if (!profile?.userId) {
      toast.error("You must be logged in to like a comment.");
      return;
    }

    await likeComment(commentId, profile.userId);
    const updatedComments = await fetchComments();
    setComments(updatedComments);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const commentData: Omit<Comment, "id"> = {
        user: `${profile.firstName} ${profile.lastName}`,
        creatorId: profile.userId || "", // Store user ID as creatorId
        date: new Date().toLocaleString(),
        content: newComment,
        likes: [],
      };

      await addComment(commentData);
      toast.success("Comment added successfully!");
      const updatedComments = await fetchComments();
      setComments(updatedComments);
      setNewComment("");
    } else {
      toast.error("Comment cannot be empty!");
    }
  };

  const handleDeleteComment = async (commentId: string, creatorId: string) => {
    if (creatorId !== profile.userId) {
      toast.error("You can only delete your own comments.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (confirmDelete) {
      await deleteComment(commentId);
      toast.success("Comment deleted successfully!");
      const updatedComments = await fetchComments();
      setComments(updatedComments);
    }
  };

  return (
    <div className="w-full bg-white shadow-md rounded-[17px] pb-4">
      <div className="flex items-center h-[50px] gap-4 px-5 border-b border-gray-200 font-bold text-gray-800 relative">
        Comments
        <div className="p-2 rounded-full w-8 text-white flex items-center justify-center h-8 bg-gray-800">
          {comments.length}
        </div>
      </div>

      {comments.map((comment) => (
        <div key={comment.id} className="grid grid-cols-[35px_1fr] gap-5 p-5">
          <div className="w-9 h-full bg-gray-100 rounded-lg grid">
            <button
              className={`relative flex items-center justify-center w-9 h-9 bg-transparent rounded-full ${
                comment.likes.includes(profile?.userId) ? "text-red-500" : ""
              }`}
              onClick={() => handleLike(comment.id)}
            >
              <BiHeart />
            </button>
            <hr className="w-2/3 mx-auto" />
            <span className="text-gray-600 text-center text-sm">
              {comment.likes.length}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center">
                <FaUserCircle />
              </div>
              <div>
                <span className="text-gray-800 font-medium">
                  {comment.user}
                </span>
                <p className="text-xs text-gray-500">{comment.date}</p>
              </div>
            </div>
            <p className="text-gray-700 text-sm">{comment.content}</p>
            {comment.creatorId === profile?.userId && ( // Check if user is the creator
              <button
                onClick={() =>
                  handleDeleteComment(comment.id, comment.creatorId)
                }
                className="text-red-500"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}

      <div className="px-5 pt-2">
        <textarea
          className="w-full p-2 bg-gray-100 rounded-md text-sm outline-none"
          placeholder="Reply"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <div className="flex space-x-3 mt-2">
          <button
            type="button"
            onClick={handleAddComment}
            className="flex items-center justify-center w-8 h-8 bg-buttonBackground text-white rounded-full"
          >
            <RiSendPlaneFill />
          </button>
        </div>
      </div>
    </div>
  );
};
