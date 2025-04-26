"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { db } from '@/utils/supabase/client';
import { Database, TablesUpdate } from "@/types/supabase";
import Image from "next/image";

const PARKING_TYPES = ["driveway", "garage", "lot", "street"];

type SpotUpdate = TablesUpdate<"parking_spots">;

export default function EditSpotPage() {
  const { id } = useParams<{ id: string }>();
  const { isLoaded, isSignedIn, user } = useUser();
  const [spot, setSpot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(PARKING_TYPES[0]);
  const [pricePerDay, setPricePerDay] = useState<number | null>(null);
  const [spacesAvailable, setSpacesAvailable] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [amenities, setAmenities] = useState<{ id: string; name: string }[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<any[]>([]); // { id, image_url, is_primary }
  const [signedImages, setSignedImages] = useState<{ id: string, signedUrl: string, is_primary: boolean | null }[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [deletingImageIds, setDeletingImageIds] = useState<string[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string | number | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || !id) return;
    setLoading(true);
    db.from("parking_spots")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else if (data) {
          setSpot(data);
          setTitle(data.title || "");
          setAddress(data.address || "");
          setCity(data.city || "");
          setState(data.state || "");
          setZipCode(data.zip_code || "");
          setDescription(data.description || "");
          setType(data.type || PARKING_TYPES[0]);
          setPricePerDay(data.price_per_day ?? null);
          setSpacesAvailable(data.spaces_available ?? null);
          setIsActive(data.is_active ?? true);
        }
        setLoading(false);
      });
    db.from("amenities").select("id, name").then(({ data }) => {
      if (data) setAmenities(data);
    });
    if (id) {
      db.from("parking_spot_amenities").select("amenity_id").eq("parking_spot_id", id).then(({ data }) => {
        if (data) setSelectedAmenities(data.map((a: any) => a.amenity_id));
      });
      db.from("parking_spot_images").select("id, image_url, is_primary").eq("parking_spot_id", id).then(async ({ data }) => {
        if (data) {
          // Generate signed URLs for all images
          const signed = await Promise.all(data.map(async (img: any) => {
            const { data: signedData } = await db.storage
              .from('parking-spot-images')
              .createSignedUrl(img.image_url.replace(/^.*parking-spot-images\//, ''), 60 * 60);
            return { id: img.id, signedUrl: signedData?.signedUrl || img.image_url, is_primary: img.is_primary };
          }));
          setSignedImages(signed);
          setImages(data);
          // Set default primary image if not set
          const primary = data.find((img: any) => img.is_primary);
          if (primary) setPrimaryImage(primary.id);
          else if (data.length > 0) setPrimaryImage(data[0].id);
        }
      });
    }
  }, [isLoaded, isSignedIn, user, id]);

  useEffect(() => {
    if (newImages.length === 0) {
      setImagePreviews([]);
      return;
    }
    const urls = newImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    // Clean up object URLs on unmount or when newImages changes
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImages]);

  useEffect(() => {
    // If there are no existing images and new images are added, set first new image as primary
    if (images.length === 0 && newImages.length > 0 && primaryImage === null) {
      setPrimaryImage(`new-${0}`);
    }
  }, [images, newImages, primaryImage]);

  const handleAmenityChange = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId) ? prev.filter((a) => a !== amenityId) : [...prev, amenityId]
    );
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (images.length + newImages.length + files.length > 3) return;
    setNewImages((prev) => [...prev, ...files].slice(0, 3 - images.length));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (images.length + newImages.length + files.length > 3) return;
    setNewImages((prev) => [...prev, ...files].slice(0, 3 - images.length));
  };

  const removeNewImage = (idx: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDeleteImage = async (imgId: string) => {
    setDeletingImageIds((prev) => [...prev, imgId]);
    await db.from("parking_spot_images").delete().eq("id", imgId);
    setImages((prev) => prev.filter((img) => img.id !== imgId));
    setDeletingImageIds((prev) => prev.filter((id) => id !== imgId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const update: SpotUpdate = {
        title,
        address,
        city,
        state,
        zip_code: zipCode,
        description: description || null,
        type,
        price_per_day: pricePerDay || 0,
        spaces_available: spacesAvailable,
        is_active: isActive,
      };
      const { error: updateError } = await db.from("parking_spots").update(update).eq("id", id);
      if (updateError) throw new Error(updateError.message);
      await db.from("parking_spot_amenities").delete().eq("parking_spot_id", id);
      if (selectedAmenities.length > 0) {
        const amenityRows = selectedAmenities.map((amenity_id) => ({ parking_spot_id: id, amenity_id }));
        await db.from("parking_spot_amenities").insert(amenityRows);
      }
      // Update existing images' is_primary
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const isPrimary = primaryImage === img.id;
        await db.from("parking_spot_images").update({ is_primary: isPrimary }).eq("id", img.id);
      }
      // Upload new images and set is_primary for the selected one
      for (let i = 0; i < newImages.length; i++) {
        const file = newImages[i];
        const filePath = `${id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await db.storage.from('parking-spot-images').upload(filePath, file, { upsert: true });
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);
        const { data: urlData } = db.storage.from('parking-spot-images').getPublicUrl(filePath);
        const imageUrl = urlData.publicUrl;
        const isPrimary = primaryImage === `new-${i}`;
        const { error: imgError } = await db.from("parking_spot_images").insert({ parking_spot_id: id, image_url: imageUrl, is_primary: isPrimary });
        if (imgError) throw new Error(`Image DB insert failed: ${imgError.message}`);
      }
      setNewImages([]);
      setImagePreviews([]);
      router.push("/dashboard/spots");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn || !user) return <div>Sign in to edit your parking spot.</div>;
  if (loading) return <div className="text-white">Loading spot...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!spot) return <div className="text-white">Spot not found.</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6 bg-gray-800 rounded-lg mt-8">
      <h1 className="text-2xl font-bold text-white mb-4">Edit Parking Spot</h1>
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
      <div>
        <label className="block mb-1 text-white">Type</label>
        <select className="w-full p-2 border rounded text-black" value={type} onChange={e => setType(e.target.value)}>
          {PARKING_TYPES.map((t) => (
            <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
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
        <div className="flex gap-2 mb-2">
          {signedImages.map((img, idx) => (
            <div key={img.id} className="relative flex flex-col items-center">
              <Image src={img.signedUrl} alt="spot" width={80} height={80} className="object-cover rounded" />
              <button type="button" onClick={() => handleDeleteImage(img.id)} disabled={deletingImageIds.includes(img.id)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">&times;</button>
              <label className="mt-1 text-xs text-white flex items-center gap-1">
              <input
                type="radio"
                name="primary-image"
                checked={primaryImage === img.id}
                onChange={() => setPrimaryImage(img.id)}
              />
              Make Primary
              </label>
            </div>
          ))}
          {imagePreviews.map((src, idx) => (
            <div key={idx} className="relative flex flex-col items-center">
              <Image src={src} alt="preview" width={80} height={80} className="object-cover rounded" />
              <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center">&times;</button>
              <label className="mt-1 text-xs text-white flex items-center gap-1">
              <input
                type="radio"
                name="primary-image"
                checked={primaryImage === `new-${idx}`}
                onChange={() => setPrimaryImage(`new-${idx}`)}
              />
              Make Primary
              </label>
            </div>
          ))}
        </div>
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
      </div>
      <button type="submit" disabled={isSaving} className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-blue-300">
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
