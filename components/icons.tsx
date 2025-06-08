import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Circle,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  ImageIcon,
  Laptop,
  Loader2,
  Moon,
  MoreVertical,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  Heart,
  Share,
  Download,
  Upload,
  Search,
  Filter,
  Menu,
  Home,
  Users,
  Bell,
  MessageSquare,
  Wrench,
  Car,
  Smartphone,
  Monitor,
  Zap,
  Shield,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  DollarSign,
  Euro,
  Percent,
  Tag,
  Gift,
  Copy,
  Edit,
  Save,
  RefreshCw,
  LogOut,
  LogIn,
  UserPlus,
  Lock,
  Unlock,
  Key,
  Database,
  Server,
  Cloud,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Volume2,
  VolumeX,
  Play,
  Pause,
  CircleStopIcon as Stop,
  SkipForward,
  SkipBack,
  FastForward,
  Rewind,
} from "lucide-react"

export const Icons = {
  // Alerts & Status
  alertCircle: AlertCircle,
  check: Check,
  circle: Circle,
  helpCircle: HelpCircle,
  loader: Loader2,

  // Navigation
  arrowRight: ArrowRight,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronUp: ChevronUp,
  chevronDown: ChevronDown,
  menu: Menu,
  home: Home,

  // UI Elements
  plus: Plus,
  x: X,
  moreVertical: MoreVertical,
  settings: Settings,
  search: Search,
  filter: Filter,

  // Theme
  sun: SunMedium,
  moon: Moon,

  // Files & Media
  file: File,
  fileText: FileText,
  image: ImageIcon,
  download: Download,
  upload: Upload,

  // User & Auth
  user: User,
  users: Users,
  userPlus: UserPlus,
  logIn: LogIn,
  logOut: LogOut,
  lock: Lock,
  unlock: Unlock,
  key: Key,

  // Visibility
  eye: Eye,
  eyeOff: EyeOff,

  // Communication
  mail: Mail,
  phone: Phone,
  messageSquare: MessageSquare,
  bell: Bell,

  // Location & Time
  mapPin: MapPin,
  calendar: Calendar,
  clock: Clock,

  // Social & Interaction
  star: Star,
  heart: Heart,
  share: Share,
  twitter: Twitter,

  // Business & Finance
  creditCard: CreditCard,
  dollarSign: DollarSign,
  euro: Euro,
  percent: Percent,
  tag: Tag,
  gift: Gift,

  // Charts & Analytics
  trendingUp: TrendingUp,
  barChart: BarChart3,
  pieChart: PieChart,

  // Actions
  copy: Copy,
  edit: Edit,
  save: Save,
  trash: Trash,
  refreshCw: RefreshCw,

  // Devices & Tech
  laptop: Laptop,
  smartphone: Smartphone,
  monitor: Monitor,
  car: Car,
  wrench: Wrench,

  // Status & Quality
  zap: Zap,
  shield: Shield,
  award: Award,

  // Connectivity
  wifi: Wifi,
  wifiOff: WifiOff,
  battery: Battery,
  batteryLow: BatteryLow,

  // Media Controls
  volume2: Volume2,
  volumeX: VolumeX,
  play: Play,
  pause: Pause,
  stop: Stop,
  skipForward: SkipForward,
  skipBack: SkipBack,
  fastForward: FastForward,
  rewind: Rewind,

  // Infrastructure
  database: Database,
  server: Server,
  cloud: Cloud,
}

export type IconName = keyof typeof Icons
