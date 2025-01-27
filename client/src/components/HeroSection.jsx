import React from "react";

const HeroSection = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center "
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/48604/pexels-photo-48604.jpeg?auto=compress&cs=tinysrgb&w=600')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>{" "}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold">
          Caring for Your Health
        </h1>
        <p className="mt-4 text-lg md:text-2xl max-w-2xl">
          Our team of dedicated doctors is committed to providing the best
          possible healthcare for you and your loved ones. With expertise across
          various fields, we ensure personalized and comprehensive care.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
