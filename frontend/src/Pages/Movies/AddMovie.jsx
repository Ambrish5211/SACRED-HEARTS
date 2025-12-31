import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllGenres } from "../../redux/slices/genreSlice";
import HomeLayout from "../../Layouts/HomeLayout";
import axiosInstance from "../../config/axiosInstance";
import { FaCloudUploadAlt, FaArrowLeft } from "react-icons/fa";

function AddMovie() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const { genres } = useSelector((state) => state.genre);

    const [userInput, setUserInput] = useState({
        title: "",
        description: "",
        year: "",
        genre: "", // Stores ID
        language: "",
        thumbnail: null,
        videoFile: null,
    });

    const [previews, setPreviews] = useState({
        thumbnail: "",
        video: "",
    });

    const [loading, setLoading] = useState(false);

    // Ensure genres are loaded
    useEffect(() => {
        if (!genres || genres.length === 0) {
            dispatch(getAllGenres());
        }
    }, [dispatch, genres?.length]);

    // Fetch movie details if in edit mode
    useEffect(() => {
        if (isEditMode) {
            (async () => {
                try {
                    const response = await axiosInstance.get(`/movies/${id}`);
                    console.log("Edit Movie Fetch Response:", response.data);

                    if (response?.data?.success) {
                        // Based on MovieDescription, the structure is response.data.data.movie
                        const fetchedData = response.data.data;
                        const movieData = fetchedData.movie || fetchedData; // Fallback safely

                        console.log("Extracted Movie Data:", movieData);

                        // Handle genre: it might be an object or ID or array
                        let genreId = "";
                        const rawGenres = movieData.genres || movieData.genre || [];
                        if (rawGenres.length > 0) {
                            const g = Array.isArray(rawGenres) ? rawGenres[0] : rawGenres;
                            genreId = typeof g === 'object' ? g._id : g;
                        }

                        // Handle language: array or string
                        let language = "";
                        if (movieData.language) {
                            language = Array.isArray(movieData.language) ? movieData.language[0] : movieData.language;
                        }

                        setUserInput({
                            title: movieData.title || "",
                            description: movieData.description || "",
                            year: movieData.year || "",
                            genre: genreId,
                            language: language,
                            thumbnail: null, // Keep null unless changed
                            videoFile: null, // Keep null unless changed
                        });

                        setPreviews({
                            thumbnail: movieData.thumbnail?.secure_url || movieData.thumbnail,
                            video: null
                        });
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                    toast.error("Failed to fetch movie details");
                    navigate("/movies");
                }
            })();
        }
    }, [isEditMode, id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        if (!file) return;

        setUserInput({
            ...userInput,
            [name]: file,
        });

        // Generate preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreviews({
                ...previews,
                [name === "thumbnail" ? "thumbnail" : "video"]: reader.result
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: slightly relaxed for Edit (files optional)
        if (!userInput.title || !userInput.description || !userInput.year || !userInput.genre || !userInput.language) {
            toast.error("Please fill all text fields");
            return;
        }
        if (!isEditMode && (!userInput.thumbnail || !userInput.videoFile)) {
            toast.error("Thumbnail and Video are required for new movies");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("title", userInput.title);
        formData.append("description", userInput.description);
        formData.append("year", userInput.year);

        if (userInput.thumbnail) formData.append("thumbnail", userInput.thumbnail);
        if (userInput.videoFile) formData.append("videoFile", userInput.videoFile);

        // Backend expects arrays usually, verify if backend handles single strings or needs array
        formData.append("genres", JSON.stringify([userInput.genre]));
        formData.append("languages", JSON.stringify([userInput.language]));

        try {
            let response;
            if (isEditMode) {
                response = await axiosInstance.put(`/movies/update-movie/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                response = await axiosInstance.post("/movies/add-movie", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            if (response?.data?.success) {
                toast.success(isEditMode ? "Movie updated successfully!" : "Movie added successfully!");
                navigate("/movies");
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || (isEditMode ? "Failed to update movie" : "Failed to add movie"));
        } finally {
            setLoading(false);
        }
    };

    const languages = ["English", "Hindi", "Bengali", "Spanish", "German"];

    return (
        <HomeLayout>
            <div className="flex items-center justify-center min-h-screen bg-[#141414] text-white pt-20 pb-10 px-4">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-6 rounded-lg p-8 text-white w-full max-w-[700px] shadow-[0_0_10px_black] bg-zinc-900 border border-zinc-800"
                >
                    <header className="flex items-center gap-2 mb-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="text-2xl hover:text-yellow-500 transition-colors"
                        >
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-3xl font-bold text-yellow-500">{isEditMode ? "Update Movie" : "Add New Movie"}</h1>
                    </header>

                    <main className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Title */}
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold text-lg">Movie Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter movie title"
                                className="bg-transparent px-2 py-2 border border-zinc-700 rounded-md focus:outline-none focus:border-yellow-500 transition-colors"
                                value={userInput.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Year */}
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold text-lg">Year</label>
                            <input
                                type="number"
                                name="year"
                                placeholder="Release Year"
                                className="bg-transparent px-2 py-2 border border-zinc-700 rounded-md focus:outline-none focus:border-yellow-500 transition-colors"
                                value={userInput.year}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Genre */}
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold text-lg">Genre</label>
                            <select
                                name="genre"
                                className="bg-zinc-800 px-2 py-2 border border-zinc-700 rounded-md focus:outline-none focus:border-yellow-500 transition-colors cursor-pointer"
                                value={userInput.genre}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>Select Genre</option>
                                {genres?.map((g) => (
                                    <option key={g._id} value={g._id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Language */}
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold text-lg">Language</label>
                            <select
                                name="language"
                                className="bg-zinc-800 px-2 py-2 border border-zinc-700 rounded-md focus:outline-none focus:border-yellow-500 transition-colors cursor-pointer"
                                value={userInput.language}
                                onChange={handleInputChange}
                            >
                                <option value="" disabled>Select Language</option>
                                {languages.map((lang, index) => (
                                    <option key={index} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description (Full Width) */}
                        <div className="flex flex-col gap-1 md:col-span-2">
                            <label className="font-semibold text-lg">Description</label>
                            <textarea
                                name="description"
                                placeholder="Enter movie description..."
                                className="bg-transparent px-2 py-2 border border-zinc-700 rounded-md focus:outline-none focus:border-yellow-500 transition-colors h-24 resize-none"
                                value={userInput.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* File Uploads (Thumb + Video) */}

                        {/* Thumbnail */}
                        <div className="flex flex-col gap-1 md:col-span-2 border border-dashed border-zinc-600 rounded-lg p-4 hover:border-yellow-500 transition-colors">
                            <label className="cursor-pointer">
                                <span className="font-semibold text-lg mb-2 block">Upload Thumbnail {isEditMode && "(Optional)"}</span>
                                {previews.thumbnail ? (
                                    <img src={previews.thumbnail} alt="thumbnail preview" className="w-full h-44 object-cover rounded-md" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-44 text-zinc-500 gap-2">
                                        <FaCloudUploadAlt size={40} />
                                        <span>Click to upload thumbnail</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="thumbnail"
                                    className="hidden"
                                    accept=".jpg, .jpeg, .png, .webp"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {/* Video */}
                        <div className="flex flex-col gap-1 md:col-span-2 border border-dashed border-zinc-600 rounded-lg p-4 hover:border-yellow-500 transition-colors">
                            <label className="cursor-pointer">
                                <span className="font-semibold text-lg mb-2 block">Upload Video {isEditMode && "(Optional)"}</span>
                                {previews.video ? (
                                    <video src={previews.video} controls className="w-full h-44 object-cover rounded-md" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-44 text-zinc-500 gap-2">
                                        <FaCloudUploadAlt size={40} />
                                        <span>Click to upload video (MP4, MKV)</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="videoFile"
                                    className="hidden"
                                    accept=".mp4, .mkv"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                    </main>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (isEditMode ? "Updating Movie..." : "Uploading Movie...") : (isEditMode ? "Update Movie" : "Add Movie")}
                    </button>

                </form>
            </div>
        </HomeLayout>
    );
}

export default AddMovie;
