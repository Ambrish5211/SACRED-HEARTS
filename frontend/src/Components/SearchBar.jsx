import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import FilterModal from "./FilterModal";
import axiosInstance from "../config/axiosInstance";

function SearchBar() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [results, setResults] = useState([]);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const navigate = useNavigate();
    const searchTimeout = useRef(null);
    const wrapperRef = useRef(null);

    // Debounce logic (3 seconds as requested)
    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }
        searchTimeout.current = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => {
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        };
    }, [query]);

    // API Autocomplete
    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }

        async function fetchAutocomplete() {
            try {
                const response = await axiosInstance.get("/movies/autocomplete", {
                    params: { query: debouncedQuery }
                });
                // Assuming response structure: { success: true, data: [...] }
                if (response?.data?.data) {
                    setResults(response.data.data.slice(0, 5));
                }
            } catch (error) {
                console.error("Autocomplete failed:", error);
                // Fallback or empty results on error
                setResults([]);
            }
        }

        fetchAutocomplete();
    }, [debouncedQuery]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            setIsFocused(false);
            navigate(`/movies?search=${query}`);
        }
    };

    const handleResultClick = (id) => {
        setIsFocused(false);
        navigate(`/movies/description/${id}`);
    };

    return (
        <>
            <div className="relative flex items-center gap-2" ref={wrapperRef}>
                <div className="relative">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300 pointer-events-none z-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>

                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onKeyDown={handleSearch}
                        className="bg-zinc-800 text-white placeholder-gray-400 rounded-full pl-10 pr-12 py-2 w-48 focus:w-72 transition-all duration-300 outline-none border border-transparent focus:border-yellow-500 focus:bg-zinc-900 shadow-md"
                    />

                    <button
                        onClick={() => setShowFilterModal(true)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors z-10"
                        title="Filter Movies"
                    >
                        <FaFilter size={14} />
                    </button>
                </div>

                {/* Autocomplete Dropdown */}
                {isFocused && (debouncedQuery || results.length > 0) && (
                    <div className="absolute top-12 right-0 w-72 bg-zinc-800 rounded-lg shadow-2xl border border-zinc-600 overflow-hidden z-[100]">
                        {debouncedQuery && results.length === 0 ? (
                            <div className="p-3 text-gray-400 text-sm text-center">No results found</div>
                        ) : (
                            <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800 w-full">
                                {results.map((movie) => (
                                    <li
                                        key={movie._id}
                                        onClick={() => handleResultClick(movie._id)}
                                        className="flex items-center gap-3 p-3 hover:bg-zinc-700 cursor-pointer transition-colors border-b border-zinc-700 last:border-none"
                                    >
                                        <img
                                            src={movie.thumbnail}
                                            alt={movie.title}
                                            className="w-10 h-10 object-cover rounded-full shadow-md shrink-0"
                                        />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-white font-medium text-sm leading-tight">{movie.title}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>

            {showFilterModal && <FilterModal onClose={() => setShowFilterModal(false)} />}
        </>
    );
}

export default SearchBar;
