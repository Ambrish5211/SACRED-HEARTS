import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes, FaCheck } from "react-icons/fa";
import { getAllGenres } from "../redux/slices/genreSlice";

function FilterModal({ onClose }) {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    const { genres: apiGenres } = useSelector((state) => state.genre);

    useEffect(() => {
        if (apiGenres.length === 0) {
            dispatch(getAllGenres());
        }
    }, [dispatch, apiGenres.length]);

    const [localFilters, setLocalFilters] = useState({
        genre: searchParams.get("genre") || "",
        year: searchParams.get("year") || "",
        language: searchParams.get("language") || "",
    });

    // Use API genres if available, otherwise fallback
    const availableGenres = apiGenres.length > 0
        ? apiGenres
        : ["Action", "Comedy", "Drama", "Sci-Fi", "Adventure", "Horror", "Romance", "Thriller"].map(g => ({ _id: g, name: g }));

    const years = ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012"];
    const languages = ["English", "Hindi", "Bengali"];

    const handleSelect = (key, value) => {
        setLocalFilters((prev) => ({
            ...prev,
            [key]: prev[key] === value ? "" : value,
        }));
    };

    const applyFilters = () => {
        // ... existing applyFilters
        const currentSearch = searchParams.get("search");
        const newParams = {};
        if (currentSearch) newParams.search = currentSearch;

        if (localFilters.genre) newParams.genre = localFilters.genre;
        if (localFilters.year) newParams.year = localFilters.year;
        if (localFilters.language) newParams.language = localFilters.language;

        setSearchParams(newParams);
        onClose();
    };

    const clearFilters = () => {
        setLocalFilters({ genre: "", year: "", language: "" });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[#18181b] border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-zinc-700/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-6 bg-yellow-500 rounded-sm"></span>
                        Filter Movies
                    </h2>
                    <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition">
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">

                    {/* Genre Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Genre</h3>
                        <div className="flex flex-wrap gap-2">
                            {availableGenres.map((g) => (
                                <button
                                    key={g._id}
                                    onClick={() => handleSelect("genre", g._id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${localFilters.genre === g._id
                                        ? "bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                                        : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-750"
                                        }`}
                                >
                                    {g.name || g.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Year Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Year</h3>
                        <div className="flex flex-wrap gap-2">
                            {years.map((y) => (
                                <button
                                    key={y}
                                    onClick={() => handleSelect("year", y)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${localFilters.year === y
                                        ? "bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                                        : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-750"
                                        }`}
                                >
                                    {y}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Language Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Language</h3>
                        <div className="flex flex-wrap gap-2">
                            {languages.map((l) => (
                                <button
                                    key={l}
                                    onClick={() => handleSelect("language", l)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${localFilters.language === l
                                        ? "bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                                        : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-750"
                                        }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-5 border-t border-zinc-700/50 flex items-center justify-between bg-zinc-900/50">
                    <button
                        onClick={clearFilters}
                        className="text-sm font-semibold text-zinc-400 hover:text-white transition px-4 py-2"
                    >
                        Reset All
                    </button>
                    <button
                        onClick={applyFilters}
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3 px-8 rounded-xl shadow-lg transform active:scale-95 transition-all duration-200 flex items-center gap-2"
                    >
                        Apply Filters <FaCheck size={14} />
                    </button>
                </div>

            </div>
        </div>
    );
}

export default FilterModal;
