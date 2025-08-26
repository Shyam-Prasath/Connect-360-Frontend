import axios from "axios";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  ExternalLink,
  Eye,
  File,
  FileText,
  Image,
  Loader2,
  Plus,
  Search,
  Upload as UploadIcon,
  Video,
  X
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const localUser = JSON.parse(localStorage.getItem("user"));

  // Fetch files
  const fetchFiles = useCallback(async () => {
    try {
      const res = await axios.get("https://connect-360-backend.onrender.com/api/files", {
        params: { search: searchTerm }
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files", err);
      setFiles([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Handle upload
  const handleUpload = async (e) => {
    if (e) e.preventDefault();
    if (!file) return alert("Select a file");
    if (!heading.trim()) return alert("Please enter a heading");
    if (!description.trim()) return alert("Please enter a description");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("heading", heading);
    formData.append("description", description);

    try {
      setIsUploading(true);
      setUploadStatus("Uploading file...");

      await axios.post("https://connect-360-backend.onrender.com/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadStatus(`Uploading: ${percentCompleted}%`);
          }
        }
      });

      setUploadStatus("Upload successful! Refreshing...");
      setFile(null);
      setHeading("");
      setDescription("");

      setTimeout(() => {
        fetchFiles();
        setUploadStatus("");
      }, 1000);
    } catch (err) {
      console.error("Upload failed", err);
      setUploadStatus(
        `Upload failed: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Drag & Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  // Helpers
  const getFileIcon = (fileType) => {
    if (fileType?.includes("image")) return <Image className="w-8 h-8 text-blue-500" />;
    if (fileType?.includes("video")) return <Video className="w-8 h-8 text-blue-500" />;
    return <FileText className="w-8 h-8 text-blue-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-violet-50 to-violet-100 relative overflow-hidden">
      {/* Animated Background (unchanged) */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-violet-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-80 right-20 w-80 h-80 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-20 left-60 w-72 h-72 bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating Particles (unchanged) */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute w-2 h-2 bg-violet-300/40 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <header className="relative bg-white/90 backdrop-blur-md shadow-md border-b border-blue-200 rounded-xl mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300">
              <UploadIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-800 hover:text-blue-900 transition-all duration-500">
                Share Among US
              </h1>
              <p className="text-sm text-blue-600 mt-1">Upload & exchange files securely</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/70 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {localUser?.name?.charAt(0) || "U"}
              </div>
              <span className="font-medium text-blue-800">{localUser?.name || "User"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Upload Section */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-blue-200/50 p-8 mb-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
            <Plus className="w-6 h-6 mr-3" /> Share Your Files And Thoughts
          </h2>

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-700">File Heading</label>
              <input
                type="text"
                placeholder="Enter a descriptive heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                required
                className="w-full p-4 bg-white/50 border border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-blue-800 placeholder-blue-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-700">Description</label>
              <input
                type="text"
                placeholder="Brief description of the file"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-4 bg-white/50 border border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-blue-800 placeholder-blue-400"
              />
            </div>
          </div>

          {/* File Dropzone */}
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium text-blue-700">Choose File</label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive ? "border-blue-500 bg-blue-50/20" : "border-blue-300 bg-white/30"
              } hover:border-blue-500 hover:bg-blue-50/20`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {file ? (
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 bg-blue-500/70 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-blue-800 font-semibold">{file.name}</p>
                    <p className="text-blue-600 text-sm">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors duration-200"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 bg-blue-500/70 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <UploadIcon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-blue-800 font-semibold mb-2">Drop your file here or click to browse</p>
                  <p className="text-blue-600 text-sm">Support for all file types</p>
                </div>
              )}
            </div>
          </div>

          {/* Upload Button & Status */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5" /> <span>Upload File</span>
                </>
              )}
            </button>

            {uploadStatus && (
              <div
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
                  uploadStatus.includes("failed")
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : uploadStatus.includes("successful")
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
                }`}
              >
                {uploadStatus.includes("failed") ? (
                  <AlertCircle className="w-4 h-4" />
                ) : uploadStatus.includes("successful") ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                <span className="text-sm font-medium">{uploadStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Search & Files */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-3xl border border-blue-200/50 p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-blue-800 flex items-center">
              <File className="w-6 h-6 mr-3" /> Archive Files Of All People
            </h2>
            <div className="text-sm text-blue-600 bg-white/50 px-3 py-1 rounded-full">
              {files.length} files found
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
            <input
              type="text"
              placeholder="Search by heading or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/50 border border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-blue-800 placeholder-blue-400"
            />
          </div>

          {/* Files Grid */}
          {files.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <File className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-blue-800 mb-2">No Files Found</h3>
              <p className="text-blue-600">
                {searchTerm ? "Try adjusting your search terms" : "Upload your first file to get started"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files.map((f, i) => (
                <div
                  key={f.id || i}
                  className="bg-white/50 backdrop-blur-xl rounded-2xl border border-blue-200/50 p-6 hover:bg-white/70 transition-all duration-300 group shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <div className="mb-4">
                    {f.thumbnailUrl ? (
                      f.fileType?.includes("image") ? (
                        <img src={f.thumbnailUrl} alt="preview" className="w-full h-48 object-cover rounded-xl group-hover:scale-110 transition-transform duration-300" />
                      ) : f.fileType?.includes("video") ? (
                        <video className="w-full h-48 object-cover rounded-xl" controls>
                          <source src={f.thumbnailUrl} />
                        </video>
                      ) : (
                        <div className="w-full h-48 bg-blue-100 rounded-xl flex items-center justify-center">
                          {getFileIcon(f.fileType)}
                        </div>
                      )
                    ) : (
                      <div className="w-full h-48 bg-blue-100 rounded-xl flex items-center justify-center">
                        {getFileIcon(f.fileType)}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-blue-800 line-clamp-2 group-hover:text-blue-900 transition-colors duration-200">
                      {f.heading || "Untitled"}
                    </h3>
                    <p className="text-blue-600 text-sm line-clamp-2">{f.description || "No description"}</p>
                    <div className="flex items-center space-x-2 text-xs text-blue-500">
                      <Calendar className="w-3 h-3" />
                      <span>{f.uploadedAt ? new Date(f.uploadedAt).toLocaleDateString() : "Unknown date"}</span>
                    </div>

                    <a
                      href={f.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center space-x-2 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View File</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
