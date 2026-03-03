import { useEffect, useState } from "react";
import { fetchGallery } from "../services/galleryService";
import Lightbox from "../components/Lightbox";

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      const data = await fetchGallery();
      setImages(data);
    };

    loadImages();
  }, []);

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setLightboxOpen(true);
  };
  return (
    <div>
      <div className="image-container">
        {images.map((image) => (
          <button
            onClick={() => handleImageClick(image)}
            key={image.id}
            aria-label={image.description}
          >
            <img src={image.imageUrl} alt={image.description} />
          </button>
        ))}
      </div>

      <Lightbox
        img={selectedImage}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
