import React from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu'

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = React.useRef(null);
  const [preview, setPreview] = React.useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setImage(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = null; // Clear the file input
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click(); // Trigger file input click
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mb-4">
      <label className="text-sm text-gray-700 mb-2 block">Profile Photo</label>

      <div
        className="relative w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={!preview ? handleClick : undefined} 
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <LuUser size={50} className="text-gray-500" />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={inputRef}
          className="hidden"
        />

        {/* Delete button bottom center (same place as upload button) */}
        {preview && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition-colors duration-300"
          >
            <LuTrash size={20} className="text-red-500" />
          </button>
        )}

        {/* Upload button bottom center (only if no preview) */}
        {!preview && (
          <button
            type="button"
            onClick={handleClick}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white p-2 rounded-full shadow hover:bg-purple-700 transition-colors duration-300"
          >
            <LuUpload size={20} />
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        {preview
          ? "Click trash to remove your profile photo"
          : "Click to upload your profile photo"}
      </p>
    </div>
  );
};

export default ProfilePhotoSelector;
