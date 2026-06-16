'use client';

import Image from 'next/image';
import { Heart, MessageCircle, DollarSign } from 'lucide-react';
import { ItemProps } from '@/app/types';
import MediaPreview from './MediaPreview';
const placeholderImage = 'https://res.cloudinary.com/dchucv6ut/image/upload/v1769350752/catalog-items/mbwb1hff7cludheemnoz.png';

interface ItemCardProps {
  item: ItemProps;
  isFavourite: boolean;
  onFavouriteToggle: (itemId: string) => void;
  onWhatsApp: (item: ItemProps) => void;
  onClick: (item: ItemProps) => void;
}

export function ItemCard({ 
  item, 
  isFavourite, 
  onFavouriteToggle, 
  onWhatsApp,
  onClick 
}: ItemCardProps) {
  const imageUrl = item.media.find(med => med.type === "image")?.url || placeholderImage;

  return (
    <article 
      className="bg-white dark:bg-chocolate-light rounded-2xl shadow-sm border border-gray-100 dark:border-gold/10 overflow-hidden cursor-pointer sm:hover:shadow-xl sm:hover:-translate-y-1 transition-[transform,box-shadow,background-color,border-color] duration-300 transform-gpu"
      onClick={() => onClick(item)}
    >
      <div className="relative aspect-[4/5] bg-gray-50 dark:bg-chocolate overflow-hidden">
        {imageUrl ? (
          <div className="w-full h-full transform-gpu">
            <MediaPreview media={{type: "image", url: imageUrl}} itemName={item.name} />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-300">
            No image
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavouriteToggle(item._id);
          }}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-white/95 dark:bg-chocolate/90 shadow-md hover:scale-110 transition-transform z-10"
          aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart 
            className={`w-4 h-4 ${isFavourite ? 'fill-red-500 text-red-500' : 'text-chocolate dark:text-gold'}`} 
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-chocolate dark:text-gold-light mb-1.5 line-clamp-1 tracking-tight">
          {item.name}
        </h3>
        <p className="text-xl font-extrabold text-chocolate dark:text-gold flex items-center gap-0.5 mb-4">
          <span className="text-sm font-normal opacity-80 mr-0.5">₦</span>
          {item.price.toLocaleString()}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onWhatsApp(item);
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-chocolate dark:bg-gold text-white dark:text-chocolate text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-[opacity,transform] shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Order Now
        </button>
      </div>
    </article>
  );
}

