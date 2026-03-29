interface SidebarProps {
  open: boolean;
}

const mainNav = [
  {
    icon: <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
    label: '홈',
    active: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
      </svg>
    ),
    label: 'Shorts',
    active: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zm-5-8H9v2h6V10zm-4 4H9v2h2v-2zm4 0h-2v2h2v-2zm2-4h-2v2h2V10z"/>
      </svg>
    ),
    label: '구독',
    active: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
    ),
    label: '내 페이지',
    active: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
      </svg>
    ),
    label: '기록',
    active: false,
  },
];

const exploreNav = [
  {
    icon: <svg viewBox="0 0 24 24"><path d="M19.78 8.2l-1.5-2.59-2.94.95-2.03-1.4-.46-3.07H9.15l-.46 3.07-2.03 1.4-2.94-.95L2.22 8.2l2.4 1.88v2.4L2.22 14.35l1.5 2.59 2.94-.95 2.03 1.4.46 3.07h3.7l.46-3.07 2.03-1.4 2.94.95 1.5-2.59-2.4-1.87v-2.4l2.4-1.88zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>,
    label: '쇼핑',
    active: false,
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
    label: '음악',
    active: false,
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>,
    label: '영화',
    active: false,
  },
];

const youtubeMoreNav = [
  {
    icon: <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>,
    label: 'YouTube Premium',
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
    label: 'YouTube Music',
  },
  {
    icon: <svg viewBox="0 0 24 24"><path d="M19.98 6.84c-.2-.77-.77-1.38-1.54-1.58C17 5 12 5 12 5s-5 0-6.44.26c-.77.2-1.38.81-1.58 1.58C3.72 8.28 3.72 12 3.72 12s0 3.72.26 5.16c.2.77.77 1.38 1.54 1.58C6.96 19 12 19 12 19s5 0 6.44-.26c.77-.2 1.38-.81 1.58-1.58.26-1.44.26-5.16.26-5.16s-.04-3.72-.3-5.16zM9.74 15.02V8.98L15.2 12l-5.46 3.02z"/></svg>,
    label: 'YouTube Kids',
  },
];

export default function Sidebar({ open }: SidebarProps) {
  return (
    <nav className={`yt-sidebar ${open ? 'open' : 'closed'}`}>
      {/* 메인 네비게이션 */}
      <div className="yt-sidebar-section">
        {mainNav.map((item) => (
          <div
            key={item.label}
            className={`yt-sidebar-item ${item.active ? 'active' : ''}`}
          >
            <span className="yt-sidebar-icon">{item.icon}</span>
            <span className="yt-sidebar-label">{item.label}</span>
          </div>
        ))}
      </div>

      {/* 로그인 안내 (사이드바 열림 시만 표시) */}
      {open && (
        <div className="yt-sidebar-section yt-sidebar-login-prompt">
          <p>로그인하면 동영상에 좋아요를 표시하고 댓글을 달거나 구독할 수 있습니다.</p>
          <button className="yt-sidebar-login-btn">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
            로그인
          </button>
        </div>
      )}

      {/* 탐색 */}
      <div className="yt-sidebar-section">
        {open && <div className="yt-sidebar-section-title">탐색</div>}
        {exploreNav.map((item) => (
          <div key={item.label} className="yt-sidebar-item">
            <span className="yt-sidebar-icon">{item.icon}</span>
            <span className="yt-sidebar-label">{item.label}</span>
          </div>
        ))}
        {open && (
          <div className="yt-sidebar-item">
            <span className="yt-sidebar-icon">
              <svg viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z"/></svg>
            </span>
            <span className="yt-sidebar-label">더보기</span>
          </div>
        )}
      </div>

      {/* YouTube 더보기 */}
      <div className="yt-sidebar-section">
        {open && <div className="yt-sidebar-section-title">YouTube 더보기</div>}
        {youtubeMoreNav.map((item) => (
          <div key={item.label} className="yt-sidebar-item">
            <span className="yt-sidebar-icon yt-sidebar-yt-icon">{item.icon}</span>
            <span className="yt-sidebar-label">{item.label}</span>
          </div>
        ))}
      </div>

      {/* 신고 기록 */}
      {open && (
        <div className="yt-sidebar-section">
          <div className="yt-sidebar-item">
            <span className="yt-sidebar-icon">
              <svg viewBox="0 0 24 24"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6h-5.6z"/></svg>
            </span>
            <span className="yt-sidebar-label">신고 기록</span>
          </div>
        </div>
      )}

      {/* 푸터 (사이드바 열림 시만 표시) */}
      {open && (
        <div className="yt-sidebar-footer">
          <div className="yt-sidebar-footer-links">
            <a href="#">정보</a>
            <a href="#">보도자료</a>
            <a href="#">저작권</a>
            <a href="#">문의하기</a>
            <a href="#">크리에이터</a>
            <a href="#">광고</a>
            <a href="#">개발자</a>
          </div>
          <div className="yt-sidebar-footer-links">
            <a href="#">약관</a>
            <a href="#">개인정보처리방침</a>
            <a href="#">정책 및 안전</a>
            <a href="#">YouTube 작동 방식</a>
          </div>
          <div className="yt-sidebar-footer-copyright">
            © 2025 Google LLC
          </div>
        </div>
      )}
    </nav>
  );
}
