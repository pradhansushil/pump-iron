import { useState, useRef } from "react";
import toast from "react-hot-toast";

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
    <main aria-labelledby="gallery-upload-heading">
      <h1 id="gallery-upload-heading">Gallery Upload</h1>
      {errors && <p role="alert">{errors}</p>}
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
      >
        Browse
      </button>
      {file && <span>{file.name}</span>}

      <label htmlFor="destination">Destination</label>
      <select
        id="destination"
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

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <button onClick={handleSubmit}>Upload</button>
    </main>
  );
}
