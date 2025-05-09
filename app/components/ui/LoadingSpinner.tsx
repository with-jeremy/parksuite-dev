import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}