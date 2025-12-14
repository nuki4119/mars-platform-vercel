'use client';

import { useUser } from '../../hooks/useUser';
import { useState, useEffect } from 'react';
import { supabase } from '../../supabase/client';

export default function Topbar() {
  const user = useUser();
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingSearch(true);

      // Empty search → show trending
      if (searchQuery.trim() === '') {
        const { data, error } = await supabase
          .from('buzz_posts')
          .select('id, title, content, category_symbol, media_url')
          .order('boost_count', { ascending: false })
          .limit(8);

        if (!error && data) {
          setSearchResults([
            { group: '🔥 Trending Posts', posts: data },
          ]);
        } else {
          console.error('Trending fetch error:', error?.message);
          setSearchResults([]);
        }

        setLoadingSearch(false);
        return;
      }

      // Real search
      const { data, error } = await supabase
        .from('buzz_posts')
        .select('id, title, content, category_symbol, media_url')
        .or(
          `title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,category_symbol.ilike.%${searchQuery}%`
        )
        .limit(20);

      if (error) {
        console.error('Search error:', error.message);
        setSearchResults([]);
      } else {
        const titleMatches = data.filter((p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const contentMatches = data.filter((p) =>
          p.content?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const categoryMatches = data.filter((p) =>
          p.category_symbol?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults([
          { group: '📝 Title Matches', posts: titleMatches },
          { group: '🧠 Content Matches', posts: contentMatches },
          { group: '🏷️ Category Matches', posts: categoryMatches },
        ]);
      }

      setLoadingSearch(false);
    };

    const delay = setTimeout(fetchPosts, 400);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0b1220] text-white w-full border-b border-[#1a2131] px-4 py-2">
        <div className="flex flex-col items-center justify-center gap-1 text-center">

          {/* Username + Avatar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-300">{user?.email}</span>
            <div className="w-7 h-7 bg-gray-400 rounded-full" />
          </div>

          {/* Buy - Search - Sell */}
          <div className="flex items-center justify-center gap-3 mt-1">
            <button
              onClick={() => setShowBuyModal(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-green-500 text-green-500 hover:bg-green-500/10 transition"
            >
              Buy
            </button>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-orange-400 text-orange-400 hover:bg-orange-400/10 transition"
            >
              Search
            </button>

            <button
              onClick={() => setShowSellModal(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-red-600 text-red-600 hover:bg-red-600/10 transition"
            >
              Sell
            </button>
          </div>

          {/* Search Input + Dropdown */}
          {searchOpen && (
            <div className="relative w-full max-w-xs mt-2">
              <input
                type="text"
                placeholder="Search for anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-1.5 rounded-full bg-[#1a2131] text-sm text-white placeholder-gray-400 focus:outline-none"
              />

              <div className="absolute z-10 mt-1 w-full bg-[#1a2131] border border-[#2a2f40] rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {loadingSearch ? (
                  <div className="p-3 text-sm text-gray-400">Searching...</div>
                ) : (
                  searchResults.map(({ group, posts }) => (
                    posts.length > 0 && (
                      <div key={group}>
                        <div className="px-3 py-1 text-xs uppercase text-gray-500 tracking-wider">
                          {group}
                        </div>
                        {posts.map((post) => (
                          <a
                            key={post.id}
                            href={`/post/${post.id}`}
                            className="flex items-center gap-3 p-3 hover:bg-[#2a2f40] cursor-pointer transition"
                          >
                            <img
                              src={post.media_url || '/default-thumbnail.jpg'}
                              alt={post.title}
                              className="w-10 h-10 rounded-md object-cover"
                            />
                            <div className="text-left">
                              <p className="text-sm font-medium text-white">{post.title}</p>
                              <p className="text-xs text-gray-400">{post.category_symbol}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                    )
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Buy Modal */}
      {showBuyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
          <div className="bg-[#121826] p-6 rounded-lg w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={() => setShowBuyModal(false)}>✖️</button>
            <h2 className="text-lg font-bold text-white mb-4">Add Credit Balance</h2>
            <p className="text-sm text-gray-300">[Future: Add credit balance / Stripe integration]</p>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
          <div className="bg-[#121826] p-6 rounded-lg w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-white" onClick={() => setShowSellModal(false)}>✖️</button>
            <h2 className="text-lg font-bold text-white mb-4">Withdraw Credits</h2>
            <p className="text-sm text-gray-300">[Future: Bank details, amount, ACH / wire transfer]</p>
          </div>
        </div>
      )}
    </>
  );
}
