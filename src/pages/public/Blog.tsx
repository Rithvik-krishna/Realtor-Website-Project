import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, ArrowLeft, Heart, Share2, Bookmark, TrendingUp, Clock, Compass, BookOpenCheck } from 'lucide-react';

export const Blog: React.FC = () => {
  const { blogArticles, showToast } = useApp();
  
  // Search, Categories, & Interactive States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  
  // Custom Interaction Cache (likes & bookmarks)
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({});
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Record<string, boolean>>({});
  
  // Progress tracker inside full reader
  const [readProgress, setReadProgress] = useState(0);

  // Filters articles
  const filteredArticles = blogArticles.filter(art => {
    const matchesCat = activeCategory === 'All' || art.category === activeCategory;
    const matchesSearch = !searchTerm || 
                          art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          art.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const activeArticle = blogArticles.find(art => art.id === activeArticleId);

  // Monitor scroll progress in Reader Overlay
  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById('blog-reader-body');
      if (container) {
        const totalHeight = container.scrollHeight - container.clientHeight;
        if (totalHeight > 0) {
          const progress = (container.scrollTop / totalHeight) * 100;
          setReadProgress(progress);
        }
      }
    };
    const container = document.getElementById('blog-reader-body');
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) container.removeEventListener('scroll', handleScroll);
    };
  }, [activeArticleId]);

  // Reset scroll progress when active article changes
  useEffect(() => {
    setReadProgress(0);
  }, [activeArticleId]);

  // Social interactions
  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedArticles(prev => {
      const state = !prev[id];
      showToast(state ? 'Article added to your appreciation ledger' : 'Appreciation retracted', 'info');
      return { ...prev, [id]: state };
    });
  };

  const handleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setBookmarkedArticles(prev => {
      const state = !prev[id];
      showToast(state ? 'Article secured in private library' : 'Removed from private library', 'success');
      return { ...prev, [id]: state };
    });
  };

  const handleShare = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Magazine secure access link copied to clipboard', 'success');
    } else {
      showToast(`Sharing secure link for: "${title}"`, 'info');
    }
  };

  // Extract Category Categories
  const categories = [
    'All',
    'Market Insights', 'Buying Guides', 'Selling Guides', 'Mortgage Tips', 
    'Investment Articles', 'Community News', 'AI Real Estate Tips', 
    'Interior Design', 'Luxury Home Inspiration'
  ];

  // Pick first article for Featured story
  const featuredArticle = blogArticles[0];
  // Trending contains next 4
  const trendingArticles = blogArticles.slice(1, 5);
  // Grid holds the rest
  const gridArticles = filteredArticles.filter(art => art.id !== featuredArticle?.id);

  return (
    <div className="fade-in" style={{ paddingTop: '20px', minHeight: '100vh', paddingBottom: '40px', position: 'relative' }}>
      <div className="container">

        {/* 1. HEADER HERO BANNER */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '30px' }}>
            <div>
              <span className="badge badge-lavender badge-glow" style={{ marginBottom: '12px' }}>THE CHRONICLE</span>
              <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 600, letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'var(--font-display)' }}>
                NovaEstate <span className="text-gradient-electric">Magazine</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px', maxWidth: '550px' }}>
                Academic analyses, market intelligence indexes, and award-winning architectural designs curated for sovereign collectors.
              </p>
            </div>

            {/* Premium Search Bar */}
            <div style={{ position: 'relative', width: '340px', maxWidth: '100%' }}>
              <input
                type="text"
                placeholder="Search articles, trends, tags..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(167, 139, 250, 0.15)',
                  borderRadius: '12px',
                  padding: '12px 16px 12px 42px',
                  color: '#ffffff',
                  fontSize: '0.88rem',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'var(--font-sans)',
                  transition: '0.2s',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--color-lavender)'}
                onBlur={e => e.target.style.borderColor = 'rgba(167, 139, 250, 0.15)'}
              />
              <Search size={16} style={{ position: 'absolute', left: '16px', top: '15px', color: 'var(--text-muted)' }} />
            </div>
          </div>
        </section>

        {/* 2. CHRONICLE CATEGORIES NAV (12 custom categories) */}
        <section style={{ marginBottom: '40px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div className="tabs-nav" style={{ display: 'flex', gap: '8px', paddingBottom: '10px', minWidth: 'max-content' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                style={{
                  fontSize: '0.78rem',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* 3. EXCLUSIVE HERO COVER STORY (Featured) */}
        {activeCategory === 'All' && !searchTerm && featuredArticle && (
          <section style={{ marginBottom: '60px' }}>
            <div
              className="glass-panel hover-lift"
              onClick={() => setActiveArticleId(featuredArticle.id)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.3fr 1fr',
                borderRadius: '24px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(167, 139, 250, 0.2)',
                boxShadow: '0 30px 60px rgba(0,0,0,0.6), 0 0 30px rgba(167, 139, 250, 0.05)',
                minHeight: '420px',
                background: 'rgba(7,13,36,0.5)'
              }}
            >
              {/* Cover Photo */}
              <div style={{ position: 'relative', overflow: 'hidden', minHeight: '300px' }}>
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '1s ease' }}
                  className="blog-hero-image"
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 70%, rgba(7,13,36,0.85) 100%)' }} />
                <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
                  <span className="badge badge-lavender badge-glow" style={{ textTransform: 'uppercase', fontSize: '0.68rem', fontWeight: 700 }}>FEATURED CHRONICLE</span>
                </div>
              </div>

              {/* Cover Meta & Copy */}
              <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--color-lavender)', fontWeight: 600 }}>{featuredArticle.category}</span>
                  <span>•</span>
                  <span>{featuredArticle.readTime}</span>
                </div>

                <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', fontWeight: 600, color: '#ffffff', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                  {featuredArticle.title}
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                  {featuredArticle.excerpt}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-blue-primary), var(--color-lavender))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', color: '#ffffff', fontWeight: 600 }}>
                      {featuredArticle.author[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 500 }}>{featuredArticle.author}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{featuredArticle.date}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={(e) => handleLike(e, featuredArticle.id)} style={{ background: 'none', border: 'none', color: likedArticles[featuredArticle.id] ? '#ef4444' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }} className="hover-lift">
                      <Heart size={14} fill={likedArticles[featuredArticle.id] ? '#ef4444' : 'none'} />
                      <span style={{ fontSize: '0.72rem' }}>{featuredArticle.likes + (likedArticles[featuredArticle.id] ? 1 : 0)}</span>
                    </button>
                    <button onClick={(e) => handleBookmark(e, featuredArticle.id)} style={{ background: 'none', border: 'none', color: bookmarkedArticles[featuredArticle.id] ? 'var(--color-lavender)' : 'var(--text-secondary)', cursor: 'pointer' }} className="hover-lift">
                      <Bookmark size={14} fill={bookmarkedArticles[featuredArticle.id] ? 'var(--color-lavender)' : 'none'} />
                    </button>
                    <button onClick={(e) => handleShare(e, featuredArticle.title)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} className="hover-lift">
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. TRENDING CHRONICLES (Horizontal Slider) */}
        {activeCategory === 'All' && !searchTerm && (
          <section style={{ marginBottom: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <TrendingUp size={18} style={{ color: 'var(--color-lavender)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>Trending Chronicles</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {trendingArticles.map((art, idx) => (
                <div
                  key={art.id}
                  className="glass-panel hover-lift"
                  onClick={() => setActiveArticleId(art.id)}
                  style={{
                    borderRadius: '16px',
                    padding: '24px',
                    border: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    background: 'rgba(7,13,36,0.3)',
                    position: 'relative'
                  }}
                >
                  <span style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '2.5rem', fontWeight: 800, color: 'rgba(167, 139, 250, 0.04)', fontFamily: 'var(--font-display)', userSelect: 'none' }}>
                    0{idx + 1}
                  </span>
                  
                  <span style={{ color: 'var(--color-lavender)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {art.category}
                  </span>

                  <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff', lineHeight: '1.4', marginTop: '4px', paddingRight: '30px' }}>
                    {art.title}
                  </h4>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {art.excerpt}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{art.readTime} • {art.author.split(' ')[0]}</span>
                    
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={(e) => handleLike(e, art.id)} style={{ background: 'none', border: 'none', color: likedArticles[art.id] ? '#ef4444' : 'var(--text-secondary)', cursor: 'pointer' }} className="hover-lift">
                        <Heart size={12} fill={likedArticles[art.id] ? '#ef4444' : 'none'} />
                      </button>
                      <button onClick={(e) => handleBookmark(e, art.id)} style={{ background: 'none', border: 'none', color: bookmarkedArticles[art.id] ? 'var(--color-lavender)' : 'var(--text-secondary)', cursor: 'pointer' }} className="hover-lift">
                        <Bookmark size={12} fill={bookmarkedArticles[art.id] ? 'var(--color-lavender)' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. INDEPENDENT ARTICLE CHRONICLES GRID (40-50 Articles) */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={18} style={{ color: 'var(--color-lavender)' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#ffffff', letterSpacing: '-0.01em' }}>
                {activeCategory === 'All' ? 'Curated Chronicles Portfolio' : `${activeCategory} Ledger`}
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{filteredArticles.length} Chronicles Available</span>
          </div>

          {filteredArticles.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }} className="glass-panel">
              <span className="badge badge-lavender" style={{ marginBottom: '12px' }}>LEDGER VACANT</span>
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: 500 }}>No matching chronicles found</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '4px' }}>Refine your keyword indices or toggle the filtering tabs.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
              {gridArticles.map(art => (
                <div
                  key={art.id}
                  className="glass-panel hover-lift"
                  onClick={() => setActiveArticleId(art.id)}
                  style={{
                    borderRadius: '18px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.03)',
                    background: 'rgba(7,13,36,0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '380px'
                  }}
                >
                  {/* Photo */}
                  <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={art.imageUrl}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(7,13,36,0.85) 0%, transparent 50%)' }} />
                    <span style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(167, 139, 250, 0.12)', border: '1px solid rgba(167, 139, 250, 0.25)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', color: 'var(--color-lavender)', fontWeight: 600 }}>
                      {art.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      <span>{art.date}</span>
                      <span>•</span>
                      <span>{art.readTime}</span>
                    </div>

                    <h4 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {art.title}
                    </h4>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {art.excerpt}
                    </p>

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {art.tags.map(t => (
                        <span key={t} style={{ fontSize: '0.62rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.03)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.04)' }}>
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* Lower Card row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>By {art.author}</span>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={(e) => handleLike(e, art.id)} style={{ background: 'none', border: 'none', color: likedArticles[art.id] ? '#ef4444' : 'var(--text-muted)', cursor: 'pointer' }} className="hover-lift">
                          <Heart size={12} fill={likedArticles[art.id] ? '#ef4444' : 'none'} />
                        </button>
                        <button onClick={(e) => handleBookmark(e, art.id)} style={{ background: 'none', border: 'none', color: bookmarkedArticles[art.id] ? 'var(--color-lavender)' : 'var(--text-muted)', cursor: 'pointer' }} className="hover-lift">
                          <Bookmark size={12} fill={bookmarkedArticles[art.id] ? 'var(--color-lavender)' : 'none'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* 6. IMMERSIVE FULL-PAGE MAGAZINE READER OVERLAY */}
      {activeArticle && (
        <div
          className="fade-in"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#030712',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Top Progress Bar & Header controls */}
          <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ height: '100%', width: `${readProgress}%`, background: 'linear-gradient(90deg, var(--color-lavender), var(--color-blue-primary))', transition: '0.1s ease', boxShadow: '0 0 10px rgba(167, 139, 250, 0.6)' }} />
          </div>

          <div
            className="glass-panel"
            style={{
              height: '70px',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(8, 14, 36, 0.8)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <button
              onClick={() => setActiveArticleId(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              className="hover-lift"
            >
              <ArrowLeft size={16} />
              <span>Back to Magazine</span>
            </button>

            {/* Title Mini Indicator */}
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: '1', WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '40%', fontFamily: 'var(--font-display)' }} className="desktop-menu-only">
              {activeArticle.title}
            </span>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <button onClick={(e) => handleLike(e, activeArticle.id)} style={{ background: 'none', border: 'none', color: likedArticles[activeArticle.id] ? '#ef4444' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }} className="hover-lift">
                <Heart size={14} fill={likedArticles[activeArticle.id] ? '#ef4444' : 'none'} />
                <span style={{ fontSize: '0.72rem' }}>{activeArticle.likes + (likedArticles[activeArticle.id] ? 1 : 0)}</span>
              </button>

              <button onClick={(e) => handleBookmark(e, activeArticle.id)} style={{ background: 'none', border: 'none', color: bookmarkedArticles[activeArticle.id] ? 'var(--color-lavender)' : 'var(--text-secondary)', cursor: 'pointer' }} className="hover-lift">
                <Bookmark size={14} fill={bookmarkedArticles[activeArticle.id] ? 'var(--color-lavender)' : 'none'} />
              </button>

              <button onClick={(e) => handleShare(e, activeArticle.title)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }} className="hover-lift">
                <Share2 size={14} />
              </button>

              <button
                onClick={() => setActiveArticleId(null)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
                className="hover-lift"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Reader Body (Scrollable Panel) */}
          <div
            id="blog-reader-body"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '60px 24px',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Category and Read time */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--color-lavender)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{activeArticle.category}</span>
                <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {activeArticle.readTime}</span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 600, color: '#ffffff', lineHeight: '1.15', letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>
                {activeArticle.title}
              </h1>

              {/* Author Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '24px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-blue-primary), var(--color-lavender-dark))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>
                  {activeArticle.author[0]}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>{activeArticle.author}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '10px' }}>
                    <span>Published {activeArticle.date}</span>
                    <span>•</span>
                    <span>Academic Peer-Review Authorized</span>
                  </div>
                </div>
              </div>

              {/* Cover Image */}
              <div style={{ width: '100%', height: '400px', borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <img
                  src={activeArticle.imageUrl}
                  alt={activeArticle.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Main Text Content */}
              <article
                className="blog-full-article"
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '1.05rem',
                  lineHeight: '1.8',
                  letterSpacing: '0.01em',
                  fontFamily: 'var(--font-sans)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                {/* Paragraphs split by \n */}
                {activeArticle.content.split('\n\n').map((p, idx) => {
                  if (p.startsWith('### ')) {
                    return (
                      <h3 key={idx} style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 600, marginTop: '24px', letterSpacing: '-0.01em', fontFamily: 'var(--font-display)' }}>
                        {p.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (idx === 0) {
                    // First letter elegant drop-cap!
                    const firstChar = p.charAt(0);
                    const restText = p.slice(1);
                    return (
                      <p key={idx} style={{ textIndent: '0' }}>
                        <span style={{ float: 'left', fontSize: '3.6rem', lineHeight: '0.8', fontWeight: 700, paddingRight: '8px', paddingTop: '4px', color: 'var(--color-lavender)' }}>
                          {firstChar}
                        </span>
                        {restText}
                      </p>
                    );
                  }
                  return <p key={idx}>{p}</p>;
                })}
              </article>

              {/* Tag row */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 0', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '6px' }}>TAG ARCHIVES:</span>
                {activeArticle.tags.map(t => (
                  <span key={t} style={{ fontSize: '0.7rem', color: 'var(--color-lavender)', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)', padding: '4px 10px', borderRadius: '6px' }}>
                    #{t.toUpperCase()}
                  </span>
                ))}
              </div>

              {/* RELATED ARTICLES SECTIONS */}
              <div style={{ marginTop: '30px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '20px' }}>
                  <BookOpenCheck size={18} style={{ color: 'var(--color-lavender)' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#ffffff' }}>Related Academic Chronicles</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                  {blogArticles
                    .filter(a => a.id !== activeArticle.id && (a.category === activeArticle.category || a.tags.some(t => activeArticle.tags.includes(t))))
                    .slice(0, 3)
                    .map(rel => (
                      <div
                        key={rel.id}
                        className="glass-panel hover-lift"
                        onClick={() => {
                          setActiveArticleId(rel.id);
                          const element = document.getElementById('blog-reader-body');
                          if (element) element.scrollTop = 0;
                        }}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.03)',
                          background: 'rgba(255,255,255,0.01)',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{ height: '110px', borderRadius: '8px', overflow: 'hidden' }}>
                          <img src={rel.imageUrl} alt={rel.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontSize: '0.62rem', color: 'var(--color-lavender)', fontWeight: 600, textTransform: 'uppercase' }}>{rel.category}</span>
                        <h4 style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {rel.title}
                        </h4>
                      </div>
                    ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
