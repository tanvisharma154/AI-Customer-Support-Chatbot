import { useRef, useState } from "react";
import {
  FileUp,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

function FileUpload() {
  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setMessage("");
    setError("");

    // Only PDF allowed
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      event.target.value = "";
      return;
    }

    console.log("Selected PDF:", file.name);

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/upload-pdf",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
          data.error ||
          "PDF upload failed"
        );
      }

      console.log("Upload response:", data);

      setMessage(
        `✓ ${file.name} uploaded successfully`
      );

    } catch (err) {
      console.error("Upload error:", err);

      setError(
        err.message ||
        "Unable to upload PDF."
      );

    } finally {
      setUploading(false);

      // Allow selecting same PDF again
      event.target.value = "";
    }
  };

  return (
    <div className="upload-container">

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Upload button */}
      <button
        type="button"
        className="upload-btn"
        onClick={openFilePicker}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <Loader2
              size={17}
              className="spin"
            />

            <span>
              Processing...
            </span>
          </>
        ) : (
          <>
            <FileUp size={17} />

            <span>
              Upload PDF
            </span>
          </>
        )}
      </button>

      {/* Success */}
      {message && (
        <div className="upload-success">
          <CheckCircle size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="upload-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

    </div>
  );
}

export default FileUpload;