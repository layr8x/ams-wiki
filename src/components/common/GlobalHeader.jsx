import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Bell, User, BookOpen } from 'lucide-react'
import { useSearchStore } from '@/store/searchStore.jsx'

export default function GlobalHeader() {
  const { open } = useSearchStore()

  useEffect(() => {
    const h = (e) => {
      if (e.key === '/' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault(); open()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open])

  return (
    <header
      className="sticky top-0 z-40 flex items-center px-5 gap-4"
      style={{
        height:'56px',
        background:'rgba(255,255,255,0.85)',
        backdropFilter:'blur(12px)',
        borderBottom:'1px solid var(--color-border)',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 flex-shrink-0 mr-4" aria-label="AMS Wiki">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background:'var(--color-text-1)' }}>
          <BookOpen size={13} className="text-white" />
        </div>
        <span style={{ fontSize:'14px', fontWeight:700, color:'var(--color-text-1)', letterSpacing:'-0.01em' }}>
          AMS Wiki
        </span>
      </Link>

      {/* Search bar */}
      <button onClick={open}
        className="flex items-center gap-2.5 transition-all"
        style={{
          flex:1,
          maxWidth:'380px',
          height:'34px',
          padding:'0 12px',
          borderRadius:'10px',
          border:'1px solid var(--color-border)',
          background:'var(--color-bg-subtle)',
          fontSize:'13px',
          color:'var(--color-text-3)',
          textAlign:'left',
          boxShadow:'var(--shadow-xs)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'var(--color-border-hover)'
          e.currentTarget.style.background = 'var(--color-bg)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'var(--color-border)'
          e.currentTarget.style.background = 'var(--color-bg-subtle)'
        }}
      >
        <Search size={13} style={{ color:'var(--color-text-3)', flexShrink:0 }} />
        <span style={{ flex:1, textAlign:'left' }}>가이드 검색...</span>
        <kbd style={{
          fontFamily:'var(--font-mono)',
          fontSize:'10px',
          color:'var(--color-text-3)',
          background:'var(--color-bg)',
          border:'1px solid var(--color-border)',
          borderRadius:'4px',
          padding:'1px 5px',
        }}>/</kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        {/* Bell */}
        <button
          className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{ color:'var(--color-text-2)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-subtle)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
        >
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background:'var(--color-accent)' }} />
        </button>

        {/* Avatar */}
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-colors"
          style={{ background:'var(--color-text-1)' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#374151' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-text-1)' }}
        >
          <User size={14} />
        </button>
      </div>
    </header>
  )
}
