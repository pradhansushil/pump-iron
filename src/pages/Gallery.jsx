import { useState } from "react";
import { images } from "../services/galleryService";

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setLightboxOpen(true);
  };
  return (
    <div className="image-container">
      {images.map((image) => (
        <button
          onClick={() => handleImageClick(image)}
          key={image.src}
          aria-label={image.alt}
        >
          <img src={image.src} alt={image.alt} />
        </button>
      ))}
    </div>
  );
}
