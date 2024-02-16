"use client";
import Link from "next/link";
import Image from "next/image";
import { cn } from "../../lib/utils";
import { unsplash } from "@/lib/unsplash";
import { defaultImages } from "@/constants/images";
import { useEffect, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { Check, Loader2 } from "lucide-react";
import FormError from "./FormError";
export default function FormPicker({ id, errors }) {
  const { pending } = useFormStatus();
  const [images, setImages] = useState(defaultImages);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState(null);
  const inputRef = useRef(null);
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });

        if (result && result.response) {
          const newImages = result.response;
          setImages(newImages);
        } else {
          console.error("Failed to get images from Unsplash");
        }
      } catch (error) {
        console.log(error);
        setImages(defaultImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted",
              pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id);
            }}
          >
            <input
              ref={inputRef}
              onChange={() => {}}
              type="radio"
              id={image.id}
              name={id}
              className="hidden"
              checked={selectedImageId === image.id}
              disabled={pending}
              value={`${image.urls.full}`}
            />
            <Image
              aria-label={image.description}
              src={image.urls.thumb}
              alt={image.alt_description}
              className="object-cover rounded-sm"
              sizes="auto"
              fill
            />
            {selectedImageId === image.id && (
              <div className="absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormError id={id} errors={errors} />
    </div>
  );
}
