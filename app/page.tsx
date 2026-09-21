import { connectToDatabase } from '@/lib/mongodb';
import { Item } from '@/models/Item';
import { Favourite } from '@/models/Favourite';
import CatalogClient from '@/components/CatalogClient';

export const revalidate = 0;

async function getFavouriteCounts() {
  try {
    await connectToDatabase();
    const counts = await Favourite.aggregate([
      { $group: { _id: '$itemId', count: { $sum: 1 } } },
    ]);
    return counts.reduce((acc, { _id, count }) => {
      acc[_id.toString()] = count;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error('Error fetching favourite counts:', error);
    return {};
  }
}

async function getItems() {
  try {
    await connectToDatabase();
    const [items, favouriteCounts] = await Promise.all([
      Item.find().sort({ createdAt: -1 }),
      getFavouriteCounts(),
    ]);
    return items.map(item => ({
      ...item.toObject(),
      _id: item._id.toString(),
      favouritesCount: favouriteCounts[item._id.toString()] || 0,
    }));
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

async function getCategories() {
  try {
    await connectToDatabase();
    const categories = await Item.distinct('category');
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home() {
  const [items, categories] = await Promise.all([getItems(), getCategories()]);
  
  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-chocolate">
      <CatalogClient items={items} categories={categories} />
    </main>
  );
}

