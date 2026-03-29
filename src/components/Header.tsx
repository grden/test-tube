interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="yt-header">
      {/* Left */}
      <div className="yt-header-left">
        <button className="yt-icon-btn" onClick={onMenuClick} aria-label="메뉴">
          <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
        </button>
        <a href="/" className="yt-logo" aria-label="YouTube 홈">
          <img
            src="/youtube-icon-dark.jpg"
            alt="YouTube"
            className="yt-logo-img"
            decoding="async"
          />
        </a>
      </div>

      {/* Center */}
      <div className="yt-header-center">
        <div className="yt-search-bar">
          <input
            type="text"
            className="yt-search-input"
            placeholder="검색"
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          />
          <button className="yt-search-btn" aria-label="검색">
            <svg viewBox="0 0 24 24"><path d="M20.87 20.17l-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/></svg>
          </button>
        </div>
        <button className="yt-icon-btn" aria-label="음성 검색">
          <svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        </button>
      </div>

      {/* Right */}
      <div className="yt-header-right">
        <button className="yt-icon-btn" aria-label="더보기">
          <svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
        </button>
        <button className="yt-signin-btn">
          <svg viewBox="0 0 24 24" className="yt-signin-icon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          로그인
        </button>
      </div>
    </header>
  );
}
