export interface Team {
  id: string;
  name: string;
  tag: string;
  game: string;
  rank: string;
  points: string;
  winRate: string;
  championships: number;
  rosterCount: number;
  region: string;
  status: "ACTIVE" | "REPRESENTATIVE";
}

export const teamsData: Team[] = [
  {
    id: "lordz-ff-main",
    name: "LORDZ ESPORTS",
    tag: "LORDZ",
    game: "FREE FIRE MAX",
    rank: "#03",
    points: "1,240 PTS",
    winRate: "72%",
    championships: 3,
    rosterCount: 5,
    region: "INDIA (TN)",
    status: "REPRESENTATIVE",
  },
  {
    id: "dfg-esports",
    name: "DFG ESPORTS",
    tag: "DFG",
    game: "FREE FIRE MAX",
    rank: "#01",
    points: "1,480 PTS",
    winRate: "78%",
    championships: 4,
    rosterCount: 5,
    region: "INDIA",
    status: "ACTIVE",
  },
  {
    id: "tb-esports",
    name: "TB ESPORTS",
    tag: "TBE",
    game: "FREE FIRE MAX",
    rank: "#02",
    points: "1,390 PTS",
    winRate: "75%",
    championships: 2,
    rosterCount: 5,
    region: "INDIA",
    status: "ACTIVE",
  },
  {
    id: "eyeglaciers",
    name: "EYEGLACIERS",
    tag: "EYE",
    game: "FREE FIRE MAX",
    rank: "#04",
    points: "1,050 PTS",
    winRate: "64%",
    championships: 1,
    rosterCount: 4,
    region: "INDIA",
    status: "ACTIVE",
  },
  {
    id: "lordz-bgmi",
    name: "LORDZ BATTLEGROUNDS",
    tag: "LZR",
    game: "BGMI",
    rank: "#08",
    points: "920 PTS",
    winRate: "61%",
    championships: 1,
    rosterCount: 4,
    region: "INDIA",
    status: "REPRESENTATIVE",
  },
  {
    id: "lordz-val",
    name: "LORDZ PROTOCOL",
    tag: "LZP",
    game: "VALORANT",
    rank: "#12",
    points: "840 PTS",
    winRate: "59%",
    championships: 0,
    rosterCount: 5,
    region: "INDIA",
    status: "REPRESENTATIVE",
  },
];
