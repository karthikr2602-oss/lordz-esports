export interface MediaItem {
  id: string;
  type: "VIDEOS" | "HIGHLIGHTS" | "PHOTOS" | "SHORTS";
  title: string;
  duration?: string;
  views: string;
  date: string;
  game: string;
  youtubeId?: string;
  tag: string;
}

export const mediaData: MediaItem[] = [
  {
    id: "media-vid-1",
    type: "VIDEOS",
    title: "FLAME OF GLORY S2 • OFFICIAL TRAILER & TEAM REVEAL",
    duration: "02:45",
    views: "48K VIEWS",
    date: "2 DAYS AGO",
    game: "FREE FIRE MAX",
    youtubeId: "dQw4w9WgXcQ",
    tag: "FEATURED",
  },
  {
    id: "media-hl-1",
    type: "HIGHLIGHTS",
    title: "BEAST 1v4 CLUTCH TO SECURE MATCH 2 BOOYAH",
    duration: "01:18",
    views: "34K VIEWS",
    date: "YESTERDAY",
    game: "FREE FIRE MAX",
    youtubeId: "dQw4w9WgXcQ",
    tag: "CLUTCH",
  },
  {
    id: "media-hl-2",
    type: "HIGHLIGHTS",
    title: "LORDZ SQUAD WIPE VS EYEGLACIERS • FINAL CIRCLE",
    duration: "00:54",
    views: "21K VIEWS",
    date: "3 DAYS AGO",
    game: "FREE FIRE MAX",
    youtubeId: "dQw4w9WgXcQ",
    tag: "TOP PLAY",
  },
  {
    id: "media-sh-1",
    type: "SHORTS",
    title: "HOW BEAST CONTROLS RECOIL AT 200M",
    duration: "00:30",
    views: "89K VIEWS",
    date: "LAST WEEK",
    game: "FREE FIRE MAX",
    youtubeId: "dQw4w9WgXcQ",
    tag: "PRO TIP",
  },
  {
    id: "media-ph-1",
    type: "PHOTOS",
    title: "BEHIND THE SCENES: 2026 PRO JERSEY SHOOT",
    views: "15K VIEWS",
    date: "5 DAYS AGO",
    game: "LORDZ TEAM",
    tag: "LIFESTYLE",
  },
  {
    id: "media-ph-2",
    type: "PHOTOS",
    title: "FLAME OF GLORY TROPHY TOUR IN CHENNAI",
    views: "19K VIEWS",
    date: "LAST WEEK",
    game: "FLAME OF GLORY",
    tag: "COMMUNITY",
  },
];
