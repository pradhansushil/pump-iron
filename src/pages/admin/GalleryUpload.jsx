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
    <div className="">
      <p>{errors}</p>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <button onClick={() => fileInputRef.current.click()}>Browse</button>
      {file && <span>{file.name}</span>}

      <select
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

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <button onClick={handleSubmit}>Upload</button>
    </div>
  );
}
