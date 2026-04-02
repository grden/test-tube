# Context & Goal
You are building a standalone React (Vite) web application for an HCI lab experiment. The app simulates a YouTube-like video player to test how "adaptive speeding" (dynamically speeding up to save time) affects ad acceptance in different conditions. 

# UI/UX Requirements: "Mimicking YouTube"
To maximize ecological validity, the user must feel like they are using the real YouTube desktop app.
1. **Theme**: Strict Dark Mode (Background `#0f0f0f`, Surface `#212121`, Text `#f1f1f1`).
2. **Layout**:
   - **Header**: Hamburger menu icon, YouTube Logo (using text or SVG), Search bar in the center (functional but fake), Create/Notification/Profile icons on the right.
   - **Sidebar**: Home, Shorts, Subscriptions, Library, etc. (Static links).
3. **The Pre-Experiment "Feed" State**: 
   When a participant lands on a condition URL (e.g., `/run/a1`), DO NOT start the video immediately. Instead, render a fake "Home Feed" grid.
   - **For Control, A1, A2 conditions**: The grid should contain exactly **ONE** prominent, clickable video thumbnail.
   - **For B1, B2 conditions**: The grid should contain exactly **TWO** prominent, clickable video thumbnails (Video 1 and Video 2).
   - Clicking a valid thumbnail transitions the app to the `/watch` view where the actual experiment flow begins.
4. **The `/watch` View**:
   - Big 16:9 video player on the left.
   - Video Title, Channel Info, Like/Dislike/Share/Save buttons below the player.
   - "Up Next" recommended videos column on the right (static dummy thumbnails).

# Tech Stack & Setup
- Framework: React (Vite)
- Routing: `react-router-dom`
- Video Player: `react-player`
- Styling: Plain CSS or Tailwind (whichever you prefer to replicate YouTube pixel-perfectly)
- All video files will be local (`.mp4`), so no YouTube iframe API.

# Core System Logic

## 1. Time Tracking & Adaptive Speeding (1.05x)
- "Adaptive Speed" in this experiment assumes users cannot detect a 5% speed increase. Thus, force the video to play at `1.05x` speed.
- Normal speed is `1.0x`.
- **Saved Time Visualization**: We want to actively show the user they are saving time. 
  - Calculate: `interval = video_duration_in_seconds / 15`
  - For every `interval` seconds that pass, increment `displayedSavedTime` by 1.
  - Show a small UI badge over the video player (e.g., top-right corner): `⏱️ 아낀 시간: {displayedSavedTime}초` (Saved Time: X sec). This number must actively tick up to 15s by the end of the video.

## 2. Ad Overlay (`<AdOverlay />`) & Assets
- We have TWO specific ad assets:
  1. A short **5~6s** ad video (used for `5s_skip` scenarios).
  2. A long **15s+** ad video (used for `15s_fixed` scenarios).
- The overlay must sit absolutely positioned over the `react-player`.
- Features a mock YouTube ad UI: yellow ad badge, "Ad · 1 of 1", and a countdown: "영상이 시작되기 전 광고: X초"
- **if 15s fixed**: Play the long ad. No skip button. After 15s, calls `onComplete(adWatchedTime, skipped=false)`.
- **if 5s+skip**: Play the short ad. Since it is 5-6s long, just show a "Skip Ad ⏭" button after 5 seconds of play. If clicked (or if video ends naturally at 6s), call `onComplete(adWatchedTime, skipped=true/false respectively)`.

## 3. The 5 Experiment Conditions (State Machine)
Implement a sequential flow for each route once a thumbnail is clicked:

**Control (General Play + 5s Skipsable Ad)**
1. Feed has 1 thumbnail. User clicks it.
2. Play short Ad (5s+skip Wrapper).
3. Play Main Video at 1.0x (No saved time UI).

**A1 (15s Fixed Ad -> 1.05x Reward)**
1. Feed has 1 thumbnail. User clicks it.
2. Play long Ad (15s Fixed Wrapper).
3. Play Main Video at 1.05x (Show Saved Time UI ticking up).

**A2 (5s Skip Ad -> 1.05x Reward if watching)**
1. Feed has 1 thumbnail. User clicks it.
2. Play short Ad (5s+skip Wrapper).
3. If user clicks Skip -> Play Main Video at 1.0x (No UI).
4. If user watches ad fully (doesn't skip) -> Play Main Video at 1.05x (Show Saved Time UI).

**B1 (15s Saved -> 15s Fixed Ad on Next Video)**
1. Feed has 2 thumbnails. User clicks Video 1.
2. Play Video 1 strictly at 1.05x. Show Saved Time UI ticking up to 15s.
3. When Video 1 finishes, user navigates back to Home Feed (or clicks Video 2 from the sidebar).
4. When User clicks Video 2, immediately show long Ad (15s Fixed Wrapper).
5. Play Video 2 at 1.0x (No UI).

**B2 (15s Saved -> 5s Skip Ad on Next Video)**
1. Feed has 2 thumbnails. User clicks Video 1.
2. Play Video 1 strictly at 1.05x. Show Saved Time UI ticking up to 15s.
3. When Video 1 finishes, user navigates back to Home Feed (or clicks Video 2 from the sidebar).
4. When User clicks Video 2, immediately show short Ad (5s+skip Wrapper).
5. Play Video 2 at 1.0x (No UI).