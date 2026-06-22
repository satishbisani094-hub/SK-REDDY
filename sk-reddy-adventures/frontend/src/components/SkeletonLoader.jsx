import React from 'react';

export const TourCardSkeleton = () => {
  return (
    <div className="glass rounded-2xl overflow-hidden shadow-lg animate-pulse border border-white/5">
      <div className="h-64 bg-white/10 w-full"></div>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-white/10 rounded w-1/3"></div>
          <div className="h-4 bg-white/10 rounded w-1/4"></div>
        </div>
        <div className="h-6 bg-white/10 rounded w-3/4"></div>
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-5/6"></div>
        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="h-6 bg-white/10 rounded w-1/4"></div>
          <div className="h-10 bg-white/10 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export const GallerySkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="glass rounded-xl overflow-hidden h-64 border border-white/5">
          <div className="w-full h-full bg-white/10"></div>
        </div>
      ))}
    </div>
  );
};

export const TourDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="h-12 bg-white/10 rounded w-1/3"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[450px] bg-white/10 rounded-2xl"></div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white/10 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4 pt-6">
            <div className="h-8 bg-white/10 rounded w-1/4"></div>
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
          </div>
        </div>
        <div className="glass p-6 rounded-2xl h-fit space-y-6">
          <div className="h-6 bg-white/10 rounded w-1/2"></div>
          <div className="h-10 bg-white/10 rounded w-full"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
          </div>
          <div className="h-12 bg-white/10 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};
