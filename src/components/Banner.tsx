import React from 'react';

const Banner: React.FC = () => {
  return (
    <section className="bg-[#2f64a6] text-white py-4 text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold">
          Deadline Extended to August 24, 2025!
        </h2>
        <p className="mt-2 text-[#b3c5df]">
          Don't miss your chance, take advantage of the extended deadline.
        </p>
      </div>
    </section>
  );
};

export default Banner;