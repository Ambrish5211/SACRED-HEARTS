import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomeLayout from "../../Layouts/HomeLayout";
import MoviesCard from "../../Components/MoviesCard";
import axiosInstance from "../../config/axiosInstance";
import toast from "react-hot-toast";

function WatchList() {
    // const dispatch = useDispatch(); // Dispatch might be unused if we don't dispatch actions here, but we use it for checking auth potentially? No, specific actions.
    // Actually we keep dispatch if we plan to use other actions, but for fetching we use axios.
    // We still need selector for IDs.
    const { watchList: watchListIDs } = useSelector((state) => state.auth);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await axiosInstance.get("/movies/getWatchList");
                if (res?.data?.success) {
                    const list = res.data.data?.user?.watchList || res.data.user?.watchList || [];
                    setMovies(list);
                }
            } catch (error) {
                toast.error("Failed to load watchlist");
            }
        })();
    }, []);

    // Filter populated movies against global IDs to sync removal
    const displayedMovies = movies.filter(m => {
        // Handle both ID strings and objects in global state
        return watchListIDs.some(idItem => {
            const id = typeof idItem === 'object' ? idItem._id : idItem;
            return id === m._id;
        });
    });

    return (
        <HomeLayout>
            <div className="min-h-screen bg-[#141414] text-white pt-20 px-4 md:px-10 pb-10">
                <header className="mb-8 flex flex-col gap-2 border-b border-zinc-800 pb-4">
                    <h1 className="text-3xl font-bold text-yellow-500">My Watchlist</h1>
                    <p className="text-zinc-400">Manage your saved movies</p>
                </header>

                {displayedMovies && displayedMovies.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                        {displayedMovies.map((movie) => {
                            return <MoviesCard key={movie._id} data={movie} />;
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4">
                        <h2 className="text-2xl font-semibold text-zinc-500">Your watchlist is empty</h2>
                        <p className="text-zinc-600">Start adding movies to build your collection!</p>
                    </div>
                )}
            </div>
        </HomeLayout>
    );
}

export default WatchList;
