import { useState, useRef } from "react";
import toast from "react-hot-toast";

import {
  containerStyle,
  ctaButton,
  errorBanner,
  errorColor,
  formField,
  formInput,
  formLabel,
  h1Style,
  marginBottom,
  textColor,
  textSizeSmall,
} from "../../utils/styles";

export default function GalleryUpload() {
  const [file, setFile] = useState(null);
  const [destination, setDestination] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setErrors("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file || !destination) {
      setErrors("Please select an image and a destination before uploading");
      return;
    }
    toast.success("Image uploaded successfully");

    setFile(null);
    setDestination("");
    setDescription("");
  };

  return (
    <main aria-labelledby="gallery-upload-heading" className={containerStyle}>
      <h1
        id="gallery-upload-heading"
        className={`${h1Style} ${marginBottom} text-center`}
      >
        Gallery Upload
      </h1>
      {errors && (
        <p className={`${errorBanner} ${errorColor}`} role="alert">
          {errors}
        </p>
      )}
      <div className="max-w-lg mx-auto">
        <div className={formField}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            aria-label="upload image"
            style={{ display: "none" }}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            aria-label="browse files to upload"
            className={ctaButton}
          >
            Browse
          </button>
          {file && (
            <span className={`${textColor} ${textSizeSmall}`}>{file.name}</span>
          )}
        </div>

        <div className={formField}>
          <label htmlFor="destination" className={formLabel}>
            Destination
          </label>
          <select
            id="destination"
            className={formInput}
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              setErrors("");
            }}
          >
            <option value="">Select a destination</option>
            <option value="employees">Employees</option>
            <option value="gallery">Gallery</option>
          </select>
        </div>

        <div className={formField}>
          <label htmlFor="description" className={formLabel}>
            Description
          </label>
          <textarea
            id="description"
            className={formInput}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <button onClick={handleSubmit} className={ctaButton}>
          Upload
        </button>
      </div>
    </main>
  );
}
