import React from "react";
import Image from "next/image";

interface ListingsCardProps {
  spot: any;
  amenities: { amenities: { name: string } }[];
  signedImages: { signedUrl: string | null; is_primary: boolean | null }[];
}

const ListingsCard: React.FC<ListingsCardProps> = ({ spot, amenities, signedImages }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-2">{spot.title}</h2>
      <p className="text-gray-600 mb-4">{spot.address || spot.city + ", " + spot.state}</p>
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {signedImages && signedImages.length > 0 ? (
          signedImages.map((img, idx) =>
            img.signedUrl ? (
              <Image
          key={idx}
          src={img.signedUrl}
          alt={spot.title + " image"}
          className={`h-32 w-48 object-cover rounded ${img.is_primary ? 'border-4 border-blue-500' : ''}`}
          width={192}
          height={128}
              />
            ) : null
          )
        ) : (
          <div className="text-gray-400">No images available</div>
        )}
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Amenities:</h3>
        <ul className="flex flex-wrap gap-2 mt-1">
          {amenities && amenities.length > 0 ? (
            amenities.map((a, idx) => (
              <li key={idx} className="bg-gray-100 px-2 py-1 rounded text-sm">
                {a.amenities?.name}
              </li>
            ))
          ) : (
            <li className="text-gray-400">No amenities listed</li>
          )}
        </ul>
      </div>
      <div className="text-gray-700">
        <p><span className="font-semibold">Description:</span> {spot.description || 'No description provided.'}</p>
        {/* Add more spot details as needed */}
      </div>
    </div>
  );
};

export default ListingsCard;
