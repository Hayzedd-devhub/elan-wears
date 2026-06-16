import { connectToDatabase } from "@/lib/mongodb";
import { Item } from "@/models/Item";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Calendar, Tag, Share2 } from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ProductGallery } from "@/components/ProductGallery";

const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getItem(slug: string) {
  try {
    await connectToDatabase();
    const item = await Item.findOne({ slug });
    if (!item) return null;
    return { ...item.toObject(), _id: item._id.toString() };
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = await getItem(slug);

  if (!item) return {};

  const ogImage = item.media?.find(m => m.type === 'image')?.url || item.media?.[0]?.url;

  return {
    title: `${item.name} | ${process.env.NEXT_PUBLIC_BUSINESS_NAME || "My Catalog"}`,
    description: item.description || `Check out ${item.name} on our catalog.`,
    openGraph: {
      title: item.name,
      description: item.description,
      url: `${baseUrl}/item/${item.slug}`,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : [],
    },
  };
}

export default async function ItemPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getItem(slug);

  if (!item) notFound();

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-chocolate text-chocolate dark:text-gold-light">
      {/* Premium Header/Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-chocolate/80 backdrop-blur-md border-b border-gold/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-bold text-chocolate dark:text-gold hover:opacity-80 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
            Catalog
          </Link>
          <div className="text-xs font-black uppercase tracking-widest opacity-40">
            Product Details
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* Left: Gallery */}
          <ProductGallery media={item.media} itemName={item.name} />

          {/* Right: Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              {item.category && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 dark:bg-gold/20 text-chocolate dark:text-gold text-xs font-black uppercase tracking-wider rounded-lg border border-gold/20">
                  <Tag className="w-3.5 h-3.5" />
                  {item.category}
                </div>
              )}

              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-chocolate dark:text-white leading-tight">
                {item.name}
              </h1>

              <div className="flex items-center gap-4">
                <p className="text-4xl font-black text-chocolate dark:text-gold">
                  <span className="text-xl font-normal opacity-60 mr-1">₦</span>
                  {item.price.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Main Action Card */}
            <div className="p-6 bg-white dark:bg-chocolate-light/30 rounded-3xl border border-gold/10 shadow-sm space-y-4">
              <p className="text-sm font-medium opacity-70">
                Interested in this item? Contact us directly on WhatsApp to place your order or ask questions.
              </p>
              <WhatsAppButton slug={item.slug} itemName={item.name} price={item.price} />
            </div>

            {/* Description Section */}
            {item.description && (
              <div className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-widest text-gold opacity-80">
                  The Story
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg text-chocolate/80 dark:text-gold-light/80 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            )}

            {/* Metadata Footer */}
            <div className="pt-8 border-t border-gold/10 space-y-4">
              <div className="flex items-center gap-3 text-sm font-bold opacity-50">
                <Calendar className="w-4 h-4" />
                <span>Listed on {formatDate(item.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
