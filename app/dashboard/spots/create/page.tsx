// app/dashboard/spots/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { db } from '@/utils/supabase/client';
import { TablesInsert } from "@/types/supabase";
import Image from "next/image";

type SpotInsert = TablesInsert<"parking_spots">;

export default function CreateSpotForm() {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerDay, setPricePerDay] = useState<number | null>(null);
  const [spacesAvailable, setSpacesAvailable] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amenities, setAmenities] = useState<{ id: string; name: string }[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    // Fetch amenities from Supabase
    db.from("amenities").select("id, name").then(({ data }) => {
      if (data) setAmenities(data);
    });
  }, []);

  useEffect(() => {
    // Generate image previews
    if (images.length === 0) {
      setImagePreviews([]);
      return;
    }
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn || !user) return <div>Sign in to create a parking spot.</div>;

  const handleAmenityChange = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (images.length + files.length > 3) return;
    setImages((prev) => [...prev, ...files].slice(0, 3));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (images.length + files.length > 3) return;
    setImages((prev) => [...prev, ...files].slice(0, 3));
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    let step = '';
    try {
      // Validation
      if (images.length < 1 || images.length > 3) {
        setError("Please upload 1 to 3 images.");
        setIsLoading(false);
        return;
      }
      if (selectedAmenities.length < 1) {
        setError("Please select at least one amenity.");
        setIsLoading(false);
        return;
      }
      step = 'Insert parking spot';
      const newSpot: SpotInsert = {
        title,
        address,
        city,
        state,
        zip_code: zipCode,
        description: description || null,
        price_per_day: pricePerDay || 0,
        spaces_available: spacesAvailable,
        is_active: isActive,
        owner_id: user.id,
        type: "driveway",
      };
      const { data: spotData, error: insertError } = await db.from("parking_spots").insert([newSpot]).select("id").single();
      if (insertError || !spotData) throw new Error(insertError?.message || "Failed to create spot");
      const spotId = spotData.id;
      step = 'Insert amenities';
      // Insert amenities
      if (selectedAmenities.length > 0) {
        const amenityRows = selectedAmenities.map((amenity_id) => ({ parking_spot_id: spotId, amenity_id }));
        const { error: amenityError } = await db.from("parking_spot_amenities").insert(amenityRows);
        if (amenityError) throw new Error(amenityError.message);
      }
      step = 'Upload images';
      // Upload images
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const filePath = `${spotId}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await db.storage.from('parking-spot-images').upload(filePath, file, { upsert: true });
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
        const { data: urlData } = db.storage.from('parking-spot-images').getPublicUrl(filePath);
        const imageUrl = urlData.publicUrl;
        const { error: imgError } = await db.from("parking_spot_images").insert({ parking_spot_id: spotId, image_url: imageUrl, is_primary: i === 0 });
        if (imgError) throw new Error(`Image DB insert failed: ${imgError.message}`);
      }
      setError("All steps completed successfully.");
      router.push("/dashboard/spots");
      router.refresh();
    } catch (err: any) {
      setError(`Error during step: ${step}. ${err.message || err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6 bg-gray-800 rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-white mb-4">Create Parking Spot</h1>
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <label className="block mb-1 text-white">Title</label>
        <input className="w-full p-2 border rounded text-black" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block mb-1 text-white">Address</label>
        <input className="w-full p-2 border rounded text-black" value={address} onChange={e => setAddress(e.target.value)} required />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-white">City</label>
          <input className="w-full p-2 border rounded text-black" value={city} onChange={e => setCity(e.target.value)} required />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-white">State</label>
          <input className="w-full p-2 border rounded text-black" value={state} onChange={e => setState(e.target.value)} required />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-white">Zip Code</label>
          <input className="w-full p-2 border rounded text-black" value={zipCode} onChange={e => setZipCode(e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="block mb-1 text-white">Description</label>
        <textarea className="w-full p-2 border rounded text-black" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-white">Price Per Day ($)</label>
          <input type="number" className="w-full p-2 border rounded text-black" value={pricePerDay === null ? '' : pricePerDay} onChange={e => setPricePerDay(e.target.value === '' ? null : Number(e.target.value))} required />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-white">Spaces Available</label>
          <input type="number" className="w-full p-2 border rounded text-black" value={spacesAvailable === null ? '' : spacesAvailable} onChange={e => setSpacesAvailable(e.target.value === '' ? null : Number(e.target.value))} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={isActive ?? false} onChange={e => setIsActive(e.target.checked)} />
        <label htmlFor="isActive" className="text-white">Active</label>
      </div>
      <div>
        <label className="block mb-1 text-white">Amenities</label>
        <div className="flex flex-wrap gap-3">
          {amenities.map((a) => (
            <label key={a.id} className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={selectedAmenities.includes(a.id)}
                onChange={() => handleAmenityChange(a.id)}
              />
              {a.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1 text-white">Photos (1-3)</label>
        <div
          className="border-2 border-dashed border-gray-400 rounded p-4 mb-2 bg-gray-700 flex flex-col items-center cursor-pointer"
          onDrop={handleImageDrop}
          onDragOver={e => e.preventDefault()}
        >
          <span className="text-gray-300 mb-2">Drag and drop images here</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer">Choose Photos</label>
        </div>
        <div className="flex gap-2">
          {imagePreviews.map((src, idx) => (
            <div key={idx} className="relative">
              <Image src={src} alt="preview" width={80} height={80} className="object-cover rounded" />
              <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">&times;</button>
            </div>
          ))}
        </div>
      </div>
      <button type="submit" disabled={isLoading} className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-blue-300">
        {isLoading ? "Creating..." : "Create Spot"
      }</button>
    </form>
  );
}
