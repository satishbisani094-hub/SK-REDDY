import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaUserAlt, FaArrowRight } from 'react-icons/fa';
import { getImageUrl } from '../services/api';

const TourCard = ({ tour }) => {
  const { _id, title, location, duration, difficulty, price, seats, coverImage } = tour;


  // Custom styling for difficulty pills
  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Easy':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'Medium':
        return 'bg-sky-500/10 text-sky-400 border border-sky-500/20';
      case 'Hard':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className="glass group rounded-2xl overflow-hidden shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col border border-white/5 h-full">
      {/* Tour Image */}
      <div className="relative h-64 overflow-hidden shrink-0">
        <img
          src={getImageUrl(coverImage)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Difficulty Pill */}
        <span className={`absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md ${getDifficultyColor(difficulty)}`}>
          {difficulty}
        </span>
        {/* Price Tag Overlay */}
        <span className="absolute bottom-4 right-4 bg-forest-800/90 text-white text-sm font-bold px-3 py-1.5 rounded-lg border border-forest-600/30 backdrop-blur-sm">
          ₹{price.toLocaleString('en-IN')}
        </span>
      </div>

      {/* Tour Info */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-forest-500" />
              {location}
            </span>
            <span className="flex items-center gap-1.5">
              <FaClock className="text-mountain-700" />
              {duration}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-forest-500 transition-colors line-clamp-1">
            {title}
          </h3>

          <p className="text-xs text-gray-400 line-clamp-2">
            {tour.description}
          </p>
        </div>

        {/* Card Footer Info */}
        <div className="pt-5 mt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <FaUserAlt className="text-forest-500/80" />
            <span>
              {seats > 0 ? (
                <>
                  <strong className="text-white">{seats}</strong> seats left
                </>
              ) : (
                <span className="text-red-400 font-semibold">Fully Booked</span>
              )}
            </span>
          </div>

          <Link
            to={`/tours/${_id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-forest-500 hover:text-white bg-forest-500/10 hover:bg-forest-600 px-3.5 py-2 rounded-xl transition-all duration-300 cursor-pointer"
          >
            Details <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
