import { FaTimes } from "react-icons/fa";

function FilterBar({ onFilterChange, activeFilters }) {
    const genres = ["Action", "Comedy", "Drama", "Sci-Fi", "Adventure", "Horror", "Romance", "Thriller"];
    const years = ["All", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
    const languages = ["All", "English", "Hindi", "Bengali"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...activeFilters, [name]: value === "All" ? "" : value });
    };

    const clearFilters = () => {
        onFilterChange({ genre: "", year: "", language: "" });
    };

    const hasFilters = activeFilters.genre || activeFilters.year || activeFilters.language;

    return (
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800">
            {/* Genre Filter */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Genre</label>
                <select
                    name="genre"
                    value={activeFilters.genre || "All"}
                    onChange={handleChange}
                    className="bg-zinc-800 text-white text-sm rounded-md px-3 py-2 border border-zinc-700 focus:outline-none focus:border-yellow-500 hover:bg-zinc-700 transition cursor-pointer min-w-[120px]"
                >
                    <option value="All">All Genres</option>
                    {genres.map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </select>
            </div>

            {/* Year Filter */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Year</label>
                <select
                    name="year"
                    value={activeFilters.year || "All"}
                    onChange={handleChange}
                    className="bg-zinc-800 text-white text-sm rounded-md px-3 py-2 border border-zinc-700 focus:outline-none focus:border-yellow-500 hover:bg-zinc-700 transition cursor-pointer min-w-[100px]"
                >
                    {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            {/* Language Filter */}
            <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Language</label>
                <select
                    name="language"
                    value={activeFilters.language || "All"}
                    onChange={handleChange}
                    className="bg-zinc-800 text-white text-sm rounded-md px-3 py-2 border border-zinc-700 focus:outline-none focus:border-yellow-500 hover:bg-zinc-700 transition cursor-pointer min-w-[120px]"
                >
                    {languages.map((l) => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
            </div>

            {/* Clear Filters Button */}
            {hasFilters && (
                <div className="flex flex-col justify-end h-full mt-5">
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-semibold transition bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-md border border-red-500/20"
                    >
                        <FaTimes /> Clear
                    </button>
                </div>
            )}
        </div>
    );
}

export default FilterBar;
