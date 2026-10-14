import React, { useState, useMemo } from 'react';
import { ArrowLeft, Search, Filter, Sparkles, BookOpen } from 'lucide-react';
import { Article, Category } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { NewsletterSection } from '../components/NewsletterSection';

interface BlogsPageProps {
  articles: Article[];
  onSelectArticle: (slugOrId: string) => void;
  onNavigateHome: () => void;
  onNavigateCategory: (category: Category) => void;
}

const CATEGORY_TABS: (Category | 'All')[] = [
  'All',
  'Beauty',
  'Style',
  'Money',
  'Digital',
  'Life',
];

export const BlogsPage: React.FC<BlogsPageProps> = ({
  articles,
  onSelectArticle,
  onNavigateHome,
  onNavigateCategory,
}) => {
  const [selectedTab, setSelectedTab] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchesCategory =
        selectedTab === 'All' || art.category === selectedTab;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        art.title.toLowerCase().includes(q) ||
        art.dek.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.slug.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedTab, searchQuery]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* 1. Header Banner */}
      <section className="pt-10 pb-14 border-b border-[#EAE3D9] bg-[#F7F2EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={onNavigateHome}
              className="text-xs uppercase tracking-wider text-[#8C7A70] hover:text-[#2A211D] flex items-center gap-1 cursor-pointer font-sans"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <span className="text-[#8C7A70]">/</span>
            <span className="text-xs uppercase tracking-wider text-[#BA7D70] font-semibold font-mono">
              Editorial Archive
            </span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-[#BA7D70] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Publications</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#2A211D] tracking-tight">
              ALL BLOGS &amp; GUIDES
            </h1>
            <p className="font-serif italic text-xl sm:text-2xl text-[#66564D] mt-2">
              Everyday discernment across beauty, wardrobe, money, and digital life.
            </p>
            <p className="font-sans text-sm sm:text-base text-[#66564D] mt-3 leading-relaxed">
              Explore our full collection of long-form breakdowns, practical routines, and consumer deconstructions. Every article has its own dedicated page with verified advice and no sponsored clutter.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Filter & Search Controls */}
      <section className="py-6 border-b border-[#EAE3D9] bg-[#FAF7F2] sticky top-18 sm:top-20 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 sm:pb-0">
              {CATEGORY_TABS.map((tab) => {
                const isActive = selectedTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-3.5 py-1.5 text-xs font-sans uppercase tracking-wider rounded-xs transition-all cursor-pointer whitespace-nowrap border ${
                      isActive
                        ? 'bg-[#2A211D] text-[#FAF7F2] border-[#2A211D] font-medium'
                        : 'bg-[#FAF7F2] text-[#66564D] border-[#EAE3D9] hover:border-[#BA7D70]'
                    }`}
                  >
                    {tab === 'All' ? 'All Stories' : tab}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px] sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A70]" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EAE3D9] focus:border-[#BA7D70] rounded-xs pl-8 pr-3 py-1.5 text-xs text-[#2A211D] placeholder-[#8C7A70] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Blogs Grid */}
      <section className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#EAE3D9]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#BA7D70]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#8C7A70]">
                Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'Blog' : 'Blogs'}
              </span>
            </div>
            {selectedTab !== 'All' && (
              <button
                onClick={() => setSelectedTab('All')}
                className="text-xs text-[#BA7D70] hover:underline cursor-pointer font-sans uppercase tracking-wider"
              >
                Reset Filter
              </button>
            )}
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="standard"
                  onSelect={(slug) => onSelectArticle(slug)}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#F7F2EA] border border-[#EAE3D9] rounded-xs p-8 max-w-xl mx-auto">
              <p className="font-serif text-2xl text-[#2A211D]">No articles found</p>
              <p className="text-xs text-[#66564D] mt-2">
                We couldn&apos;t find any articles matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTab('All');
                }}
                className="mt-4 px-4 py-2 bg-[#2A211D] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider hover:bg-[#BA7D70] transition-colors cursor-pointer"
              >
                Clear Search &amp; Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Newsletter */}
      <NewsletterSection />
    </div>
  );
};
