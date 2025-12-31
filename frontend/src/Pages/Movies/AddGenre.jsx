import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTrash, FaPlus, FaArrowLeft } from "react-icons/fa";
import { getAllGenres } from "../../redux/slices/genreSlice";
import HomeLayout from "../../Layouts/HomeLayout";
import axiosInstance from "../../config/axiosInstance";

function AddGenre() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { genres } = useSelector((state) => state.genre);

    const [newGenre, setNewGenre] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!genres || genres.length === 0) {
            dispatch(getAllGenres());
        }
    }, [dispatch, genres?.length]);

    const handleAddGenre = async (e) => {
        e.preventDefault();
        if (!newGenre.trim()) return;

        try {
            setLoading(true);
            const response = await axiosInstance.post("/genre/add-genre", { name: newGenre });
            if (response?.data?.success) {
                toast.success("Genre added successfully");
                setNewGenre("");
                dispatch(getAllGenres());
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to add genre");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGenre = async (id) => {
        if (!window.confirm("Are you sure you want to delete this genre?")) return;

        try {
            const response = await axiosInstance.delete(`/genre/delete-genre/${id}`);
            if (response?.data?.success) {
                toast.success("Genre deleted successfully");
                dispatch(getAllGenres());
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to delete genre");
        }
    };

    return (
        <HomeLayout>
            {/* Added pb-40 to ensure no footer overlap */}
            <div className="flex flex-col items-center min-h-screen bg-[#141414] text-white pt-20 px-4 pb-40">
                <div className="w-full max-w-[600px] bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-xl">

                    <header className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-zinc-400 hover:text-white transition-colors"
                        >
                            <FaArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-yellow-500">Manage Genres</h1>
                    </header>

                    {/* Add Genre Form - Corrected margin from mb-80 to mb-8 */}
                    <form onSubmit={handleAddGenre} className="flex gap-2 mb-8">
                        <input
                            type="text"
                            placeholder="Enter new genre name..."
                            className="flex-1 bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-md focus:outline-none focus:border-yellow-500 transition-colors"
                            value={newGenre}
                            onChange={(e) => setNewGenre(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <FaPlus /> Add
                        </button>
                    </form>

                    {/* Genre List */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold text-zinc-400 mb-4 border-b border-zinc-800 pb-2">Existing Genres</h2>

                        {genres && genres.length > 0 ? (
                            genres.map((g) => (
                                <div key={g._id} className="flex items-center justify-between bg-zinc-800/50 px-4 py-3 rounded-md border border-zinc-700/50 group hover:border-zinc-600 transition-colors">
                                    <span className="font-medium text-zinc-200">
                                        {/* Capitalize first letter logic */}
                                        {g.name.charAt(0).toUpperCase() + g.name.slice(1)}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteGenre(g._id)}
                                        className="text-zinc-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-zinc-700/50"
                                        title="Delete Genre"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-zinc-500 py-8">
                                No genres found. Add one above!
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </HomeLayout>
    );
}

export default AddGenre;
