"use client";

// lib/icons/iconsConfig.js
import dynamic from "next/dynamic";

// 🧩 Small fallback (shows while icon is loading)
const loader = () => (
  <span
    style={{
      display: "block",
      width: 24,
      height: 24,
      borderRadius: 4,
      background: "rgba(255, 255, 255, 0.1)",
    }}
  />
);

// 🧠 Helper for cleaner syntax
const lazy = (importFn) => dynamic(importFn, { ssr: false, loading: loader });

export const iconsConfig = {
  // MUI icons
  school: lazy(() => import("@mui/icons-material/School")),
  rocket: lazy(() => import("@mui/icons-material/RocketLaunch")),
  institute: lazy(() => import("@mui/icons-material/Apartment")),
  code: lazy(() => import("@mui/icons-material/Code")),
  person: lazy(() => import("@mui/icons-material/Person")),
  group: lazy(() => import("@mui/icons-material/Groups2")),
  check: lazy(() => import("@mui/icons-material/Check")),
  barChart: lazy(() => import("@mui/icons-material/BarChart")),
  security: lazy(() => import("@mui/icons-material/Security")),
  mobile: lazy(() => import("@mui/icons-material/PhoneAndroid")),
  handShake: lazy(() => import("@mui/icons-material/Handshake")),
  settingsSuggest: lazy(() => import("@mui/icons-material/SettingsSuggest")),
  lightBulb: lazy(() => import("@mui/icons-material/EmojiObjects")),
  calendar: lazy(() => import("@mui/icons-material/CalendarMonth")),
  discount: lazy(() => import("@mui/icons-material/Discount")),
  clock: lazy(() => import("@mui/icons-material/AccessTimeFilled")),
  facebook: lazy(() => import("@mui/icons-material/Facebook")),
  instagram: lazy(() => import("@mui/icons-material/Instagram")),
  x: lazy(() => import("@mui/icons-material/X")),
  linkedIn: lazy(() => import("@mui/icons-material/LinkedIn")),
  github: lazy(() => import("@mui/icons-material/GitHub")),
  rightAngle: lazy(() => import("@mui/icons-material/ChevronRight")),
  angleDown: lazy(() => import("@mui/icons-material/KeyboardArrowDown")),
  campaign: lazy(() => import("@mui/icons-material/Campaign")),
  palette: lazy(() => import("@mui/icons-material/Palette")),
  dollarCoin: lazy(() => import("@mui/icons-material/PaidOutlined")),
  globe: lazy(() => import("@mui/icons-material/Public")),
  phoneCall: lazy(() => import("@mui/icons-material/Call")),
  email: lazy(() => import("@mui/icons-material/Email")),
  whatsapp: lazy(() => import("@mui/icons-material/WhatsApp")),
  location: lazy(() => import("@mui/icons-material/LocationPin")),
  support: lazy(() => import("@mui/icons-material/SupportAgent")),
  direction: lazy(() => import("@mui/icons-material/Directions")),
  map: lazy(() => import("@mui/icons-material/Map")),
  circle: lazy(() => import("@mui/icons-material/Circle")),
  coffee: lazy(() => import("@mui/icons-material/Coffee")),
  moon: lazy(() => import("@mui/icons-material/Bedtime")),
  computer: lazy(() => import("@mui/icons-material/Computer")),
  videoCamera: lazy(() => import("@mui/icons-material/Videocam")),
  certificate: lazy(() => import("@mui/icons-material/WorkspacePremium")),
  cloud: lazy(() => import("@mui/icons-material/Cloud")),
  fire: lazy(() => import("@mui/icons-material/LocalFireDepartment")),
  grid: lazy(() => import("@mui/icons-material/Grid3x3")),
  close: lazy(() => import("@mui/icons-material/Close")),
  event: lazy(() => import("@mui/icons-material/EmojiEvents")),
  mic: lazy(() => import("@mui/icons-material/Mic")),
  tag: lazy(() => import("@mui/icons-material/LocalOffer")),
  search: lazy(() => import("@mui/icons-material/Search")),
  images: lazy(() => import("@mui/icons-material/PermMedia")),
  play: lazy(() => import("@mui/icons-material/PlayArrow")),
  eye: lazy(() => import("@mui/icons-material/RemoveRedEye")),
  youtube: lazy(() => import("@mui/icons-material/YouTube")),
  trendingUp: lazy(() => import("@mui/icons-material/TrendingUp")),
  target: lazy(() => import("@mui/icons-material/AdsClick")),
  connectWithPeople: lazy(() =>
    import("@mui/icons-material/ConnectWithoutContact")
  ),
  copywriting: lazy(() => import("@mui/icons-material/RateReview")),
  automode: lazy(() => import("@mui/icons-material/AutoMode")),
  autorenew: lazy(() => import("@mui/icons-material/Autorenew")),
  verifiedUser: lazy(() => import("@mui/icons-material/VerifiedUser")),
  tool: lazy(() => import("@mui/icons-material/BuildCircle")),
  motion: lazy(() => import("@mui/icons-material/AutoAwesomeMotion")),
  home: lazy(() => import("@mui/icons-material/Home")),
  settings: lazy(() => import("@mui/icons-material/Settings")),
  logout: lazy(() => import("@mui/icons-material/Logout")),
  notification: lazy(() => import("@mui/icons-material/Notifications")),
  add: lazy(() => import("@mui/icons-material/Add")),
  download: lazy(() => import("@mui/icons-material/FileDownload")),
  save: lazy(() => import("@mui/icons-material/Save")),
  eyeOff: lazy(() => import("@mui/icons-material/VisibilityOff")),
  

  // Lucide icons (from 'lucide-react')
  filter: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Funnel }))
  ),
  server: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Server }))
  ),
  book: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.BookOpenText }))
  ),
  crown: lazy(() => import("lucide-react").then((m) => ({ default: m.Crown }))),
  services: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.HandPlatter }))
  ),
  brain: lazy(() => import("lucide-react").then((m) => ({ default: m.Brain }))),
  link: lazy(() => import("lucide-react").then((m) => ({ default: m.Link }))),
  briefcase: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.BriefcaseBusiness }))
  ),
  award: lazy(() => import("lucide-react").then((m) => ({ default: m.Award }))),
  chart: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.ChartSpline }))
  ),
  database: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Database }))
  ),
  star: lazy(() => import("lucide-react").then((m) => ({ default: m.Star }))),
  send: lazy(() => import("lucide-react").then((m) => ({ default: m.Send }))),
  liveChat: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.MessagesSquare }))
  ),
  externalLink: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.ExternalLink }))
  ),
  sheet: lazy(() => import("lucide-react").then((m) => ({ default: m.Sheet }))),
  brusH: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.BrushCleaning }))
  ),
  calculator: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Calculator }))
  ),
  cog: lazy(() => import("lucide-react").then((m) => ({ default: m.Cog }))),
  layers: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Layers }))
  ),
  bot: lazy(() => import("lucide-react").then((m) => ({ default: m.Bot }))),
  lock: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.LockKeyhole }))
  ),
  rightArrow: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.ArrowRight }))
  ),
  hamburger: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Menu }))
  ),
  ticket: lazy(() =>
    import("lucide-react").then((m) => ({ default: m.Ticket }))
  ),
};
