import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCompass } from 'react-icons/fa';
import { getTours } from '../services/api';
import TourCard from '../components/TourCard';
import { TourCardSkeleton } from '../components/SkeletonLoader';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');

  const fetchToursData = async () => {
    setLoading(true);
    try {
      const data = await getTours(search, difficulty);
      if (Array.isArray(data)) {
        setTours(data);
      } else {
        console.error('Expected array of tours, received:', data);
        setTours([]);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToursData();
  }, [difficulty]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchToursData();
  };

  const difficultyFilters = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="py-20 space-y-12 max-w-7xl mx-auto px-6">
      
      {/* Header Info */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-forest-500">Expeditions</span>
        <h2 className="text-3xl md:text-5xl font-black text-white">Upcoming Adventure Tours</h2>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Embark on a journey of a lifetime. Find and book your next basecamp adventure, nature trek, or wilderness camp below.
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="glass p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col md:flex-row gap-6 justify-between items-center">
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-1/2 flex items-center relative">
          <input
            type="text"
            placeholder="Search by tour name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-24 text-white text-sm focus:outline-none focus:border-forest-500 focus:bg-white/10 transition-all placeholder-gray-500"
          />
          <FaSearch className="text-gray-400 absolute left-4 text-sm" />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 bg-forest-800 hover:bg-forest-700 text-white rounded-xl text-xs font-bold transition-all border border-forest-600/20 cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Difficulty Filters */}
        <div className="w-full md:w-auto flex flex-wrap gap-2 items-center">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <FaFilter className="text-forest-500 text-[10px]" /> Difficulty:
          </span>
          {difficultyFilters.map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                difficulty === diff
                  ? 'bg-forest-800 text-white border-forest-600/30 shadow-lg'
                  : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Tours Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <TourCardSkeleton key={n} />
          ))}
        </div>
      ) : tours.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/5 space-y-4">
          <div className="inline-flex p-4 rounded-full bg-white/5 text-gray-500">
            <FaCompass className="text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-white">No Adventures Found</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            We couldn't find any tours matching "{search || difficulty}". Try modifying your search term or select another difficulty filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <TourCard key={tour._id} tour={tour} />
          ))}
        </div>
      )}

    </div>
  );
};

export default Tours;
