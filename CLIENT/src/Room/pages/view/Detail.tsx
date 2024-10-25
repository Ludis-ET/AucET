import { useState } from "react";
import { useParams } from "react-router-dom";

export const Detail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true)
  const [room, setRoom] = 
  return <div className="col-span-3">Detail</div>;
};
