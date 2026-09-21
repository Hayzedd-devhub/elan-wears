'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Plus, Trash2, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        if (data.fromCollection && Array.isArray(data.categories)) {
          setCategories(data.categories.map((cat: any, ind: number) => ({
            _id: ind.toString(),
            name: cat,
            createdAt: new Date().toISOString(),
          })));
        } else {
          setCategories(data.categories.map((name: string, index: number) => ({
            _id: `legacy-${index}`,
            name,
            createdAt: new Date().toISOString(),
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newCategoryName.trim()) {
      setError('Category name is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Category created successfully');
        setNewCategoryName('');
        setShowForm(false);
        fetchCategories();
      } else {
        setError(data.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will not delete items with this category.`)) {
      return;
    }

    try {
      alert('Category deletion is currently disabled to prevent accidental data loss. Please contact support if you need to remove a category permanently.');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-chocolate dark:text-gold tracking-tight">
              Product Categories
            </h1>
            <p className="text-gray-500 dark:text-gold/60 mt-1">
              Organize your catalog into logical groups.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => {
                setShowForm(true);
                setError('');
                setSuccess('');
              }}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-chocolate dark:bg-gold text-white dark:text-chocolate rounded-2xl font-bold shadow-lg shadow-chocolate/20 dark:shadow-gold/10 hover:opacity-95 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              New Category
            </button>
          )}
        </div>

        {showForm && (
          <div className="bg-white dark:bg-chocolate-light/20 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gold/10 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-chocolate dark:text-gold mb-8 flex items-center gap-3">
              <div className="p-2 bg-gold/10 rounded-lg">
                <Tag className="w-5 h-5" />
              </div>
              Define New Category
            </h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-700 dark:text-red-400 font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center gap-3 text-green-700 dark:text-green-400 font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-chocolate dark:text-gold-light ml-1 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Casual Sneakers, Formal Boots"
                  className="w-full px-5 py-3.5 border border-gray-200 dark:border-gold/20 rounded-xl bg-gray-50 dark:bg-chocolate text-chocolate dark:text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                  required
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setNewCategoryName('');
                    setError('');
                  }}
                  className="flex-1 px-5 py-4 border border-gray-200 dark:border-gold/20 rounded-xl text-chocolate dark:text-gold font-bold hover:bg-gray-50 dark:hover:bg-gold/5 transition-all"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-5 py-4 bg-chocolate dark:bg-gold text-white dark:text-chocolate rounded-xl font-bold shadow-lg shadow-chocolate/20 dark:shadow-gold/10 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white dark:bg-chocolate-light/20 rounded-3xl p-16 shadow-sm border border-gray-100 dark:border-gold/10 text-center backdrop-blur-sm">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="w-10 h-10 text-gold" />
            </div>
            <h3 className="text-xl font-bold text-chocolate dark:text-gold mb-2">No Categories Defined</h3>
            <p className="text-gray-500 dark:text-gold/50 mb-8 max-w-sm mx-auto">
              Organization is key to a great catalog. Create your first category to group your products.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-chocolate dark:bg-gold text-white dark:text-chocolate rounded-2xl font-bold shadow-lg shadow-chocolate/20 dark:shadow-gold/10 hover:opacity-95 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
              Define First Category
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-chocolate-light/20 rounded-3xl shadow-sm border border-gray-100 dark:border-gold/10 overflow-hidden backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gold/5 border-b border-gray-100 dark:border-gold/10">
                    <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 dark:text-gold/40 uppercase tracking-widest">
                      Category Identification
                    </th>
                    <th className="px-6 py-4 text-right text-[11px] font-black text-gray-400 dark:text-gold/40 uppercase tracking-widest">
                      Management
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gold/10">
                  {categories.map((category) => (
                    <tr key={category._id} className="hover:bg-gray-50 dark:hover:bg-gold/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-gold/10 rounded-xl group-hover:scale-110 transition-transform">
                            <Tag className="w-5 h-5 text-chocolate dark:text-gold" />
                          </div>
                          <span className="font-bold text-chocolate dark:text-white tracking-tight">
                            {category.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(category._id, category.name)}
                          className="p-3 text-red-400/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-xl transition-all"
                          title="Delete Category"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
