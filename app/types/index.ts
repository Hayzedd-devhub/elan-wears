export interface ItemProps {
  _id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  media: { type: 'image' | 'video'; url: string; publicId?: string }[];
  category: string;
  createdAt: Date;
}
