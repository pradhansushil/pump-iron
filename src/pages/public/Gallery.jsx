import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { fetchGallery } from "../../services/galleryService";
import Lightbox from "../../components/modals/Lightbox";
import {
  pageStyle,
  h1Style,
  subText,
  containerStyle,
} from "../../utils/styles";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

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
    <main aria-labelledby="gallery-heading" className={pageStyle}>
      <div className={containerStyle}>
        <div className="text-center mb-10">
          <h1 id="gallery-heading" className={h1Style}>
            Gallery
          </h1>
          <p className={subText}>Explore our world-class facility.</p>
        </div>

        {/* CHANGE: Switched from 'columns-1 sm:columns-2 lg:columns-3' 
            to a structured Grid with a consistent gap-6.
        */}
        <Motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {images.map((image) => (
            <Motion.button
              key={image.id}
              variants={itemVariants}
              onClick={() => handleImageClick(image)}
              aria-label={image.description}
              className="
                group relative w-full overflow-hidden rounded-xl
                border border-gray-800
                hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]
                transition-all duration-300 cursor-pointer block
              "
            >
              {/* TECHNIQUE: Fixed Aspect Ratio + Object-Cover.
                  This ensures all grid items align perfectly regardless of source image size.
              */}
              <div className="aspect-video w-full overflow-hidden bg-gray-900">
                <img
                  src={image.imageUrl}
                  alt={image.description}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="block text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                  Premium Facility
                </span>
                <p className="text-white text-sm font-medium leading-snug line-clamp-1">
                  {image.description}
                </p>
              </div>
            </Motion.button>
          ))}
        </Motion.div>
      </div>

      <Lightbox
        img={selectedImage}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </main>
  );
}
