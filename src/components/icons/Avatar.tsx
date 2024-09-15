import React from 'react';

interface AvatarProps {
  name: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, className = '' }) => {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const initials = getInitials(name);
  const bgColor = `hsl(${name.length * 30 % 360}, 70%, 50%)`;

  return (
    <div 
      className={`flex items-center justify-center rounded-md text-white font-semibold ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
};

export default Avatar;