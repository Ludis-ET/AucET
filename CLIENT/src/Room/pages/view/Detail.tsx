import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { CommentSection, CountDown, Property } from "../../components";
import { RoomType, getRoomById } from "../../requests";

export const Detail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState<RoomType | null>(null);
  const [mainMedia, setMainMedia] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      if (!id) {
        setLoading(false);
        return;
      }
      const response = await getRoomById(id);
      setRoom(response);
      if (response && response.video) {
        setMainMedia(response.video);
      }
      setLoading(false);
    };

    fetchRoom();
  }, [id]);

  if (!room) return <div>No room found.</div>;

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    if (currentIndex < room.images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading)
    return (
      <div className="col-span-4 md:col-span-3 w-full flex flex-col gap-4 items-center justify-center">
        <div className="loader"></div>
        <h1 className="text-2xl font-bold text-buttonBackground">
          Finding Auction Room
        </h1>
      </div>
    );

  const check = (val: string | Timestamp) => typeof val === "string";
  return (
    <div className="col-span-4 md:col-span-3">
      <div className="grid gap-4 p-8">
        <div>
          {mainMedia && (
            <video
              className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]"
              controls
              autoPlay
              loop
              muted
              src={mainMedia}
            />
          )}
        </div>
        <div className="grid grid-cols-5 gap-4">
          {room.images.map((image, index) => (
            <div key={index} className="col-span-1">
              <img
                src={image}
                className="object-cover object-center max-h-40 w-full rounded-lg cursor-pointer"
                alt={`gallery-image-${index}`}
                onClick={() => openModal(index)}
              />
            </div>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-buttonBackground flex gap-3 flex-wrap items-center">
          {check(room.newFormValues.name) && room.newFormValues.name}

          <p className="text-gray-600 text-sm flex gap-2 items-center">
            <p>.</p>
            {!check(room.createdAt) &&
              formatDistanceToNow((room.createdAt as Timestamp).toDate(), {
                addSuffix: true,
              })}
          </p>
        </h1>
        <p className="whitespace-pre-line p-4">
          {check(room.newFormValues.description) &&
            room.newFormValues.description}
        </p>
        <CountDown
          time={
            check(room.newFormValues.startdate)
              ? room.newFormValues.startdate
              : ""
          }
        />
        <div className="ml-12 max-w-[40vw] flex flex-col gap-4">
          <Property
            title="Auction type"
            content={
              check(room.newFormValues.BuySell)
                ? room.newFormValues.BuySell === "sell"
                  ? "Get in to this auction if you want to buy the item"
                  : "Get in to this auction if you want to sell to the creator"
                : ""
            }
          />
          <Property
            title="Auction Visibility"
            content={
              check(room.newFormValues.Visibility)
                ? room.newFormValues.Visibility === "closed"
                  ? "You can't see the bids of other people"
                  : "You can see the bids of other people"
                : ""
            }
          />
          <Property
            title="Auction Duration"
            content={
              check(room.newFormValues.duration)
                ? `${room.newFormValues.duration} Hours`
                : ""
            }
          />
        </div>
      </div>
    <CommentSection />
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closeModal}
          >
            &times;
          </button>
          <button
            className="absolute left-4 text-white text-2xl"
            onClick={prevImage}
            disabled={currentIndex === 0}
          >
            &#10094;
          </button>
          <button
            className="absolute right-4 text-white text-2xl"
            onClick={nextImage}
            disabled={currentIndex === room.images.length - 1}
          >
            &#10095;
          </button>
          <img
            src={room.images[currentIndex]}
            className="max-h-full max-w-full rounded-lg"
            alt={`full-screen-image-${currentIndex}`}
          />
        </div>
      )}
    </div>
  );
};
