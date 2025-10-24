import React, { useState } from 'react';

function Rating({ value, onRatingChange, disabled }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(value || 0);

  const handleMouseEnter = (rating) => {
    if (!disabled) {
      setHoveredRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(0);
    }
  };

  const handleClick = (rating) => {
    if (!disabled) {
      setSelectedRating(rating);
      if (onRatingChange) {
        onRatingChange(rating);
      }
    }
  };

  const generateStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredRating || selectedRating);
      stars.push(
        <span
          key={i}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(i)}
          style={{ pointerEvents: disabled ? 'none' : 'auto' }}
          className={`
            text-2xl 
            cursor-pointer 
            transition 
            duration-300 
            ease-in-out
            ${isFilled ? 'text-[#bef264]' : 'text-gray-400'}
            hover:scale-125
            hover:text-[#bef264]
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return <div className="rating flex space-x-1">{generateStars()}</div>;
}

export default Rating;
