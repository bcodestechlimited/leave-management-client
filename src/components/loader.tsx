import React from "react";

interface LoaderProps {
  color?: string;
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ color = "black", isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="flex justify-center items-center py-4">
      <div
        className={`w-8 h-8 border-4 border-t-transparent animate-spin rounded-full`}
        style={{
          borderColor: `${color} transparent ${color} transparent`,
        }}
      ></div>
    </div>
  );
};

const AuthLoader: React.FC<LoaderProps> = ({ color = "blue", isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="flex justify-center items-center py-6">
      <div
        className={`w-10 h-10 border-4 border-t-transparent animate-spin rounded-full`}
        style={{
          borderColor: `${color} transparent ${color} transparent`,
        }}
      ></div>
    </div>
  );
};

export { Loader, AuthLoader };
