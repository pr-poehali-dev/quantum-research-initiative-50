import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  Shield,
  Zap,
  Video,
  Phone,
  Users,
  Mic,
  MicOff,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Hash,
  ArrowRight,
  Smile,
  Lock,
  Star,
  Globe,
  ChevronDown,
  Send,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Тип сообщения для живого чата
interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  color: string;
  text: string;
  time: string;
}

const CHANNEL_MESSAGES: Record<string, ChatMessage[]> = {
  общий: [
    { id: 1, user: "Анна", avatar: "А", color: "from-purple-500 to-pink-500", text: "Привет всем! Только зарегистрировалась 🎉", time: "12:01" },
    { id: 2, user: "Максим", avatar: "М", color: "from-green-500 to-teal-500", text: "Добро пожаловать! Здесь всё очень удобно 👍", time: "12:02" },
    { id: 3, user: "Даша", avatar: "Д", color: "from-orange-400 to-red-500", text: "Качество звонков просто супер 🔥", time: "12:03" },
    { id: 4, user: "Игорь", avatar: "И", color: "from-blue-400 to-indigo-500", text: "Уже провёл первую встречу с командой 💼", time: "12:05" },
    { id: 5, user: "Вася", avatar: "В", color: "from-cyan-400 to-blue-500", text: "Регистрация за 30 секунд — это не шутки 😄", time: "12:08" },
    { id: 6, user: "Анна", avatar: "А", color: "from-purple-500 to-pink-500", text: "Уже зову всех подруг сюда 😍", time: "12:10" },
    { id: 7, user: "Максим", avatar: "М", color: "from-green-500 to-teal-500", text: "Наконец мессенджер без рекламы!", time: "12:12" },
  ],
  знакомства: [
    { id: 1, user: "Катя", avatar: "К", color: "from-pink-400 to-rose-500", text: "Привет! Кто из Москвы? 👋", time: "13:00" },
    { id: 2, user: "Артём", avatar: "Ар", color: "from-blue-400 to-sky-500", text: "Я из Питера, но привет всем! 🙌", time: "13:01" },
    { id: 3, user: "Лена", avatar: "Л", color: "from-violet-400 to-purple-500", text: "Ищу собеседника для общения на английском 🇬🇧", time: "13:03" },
    { id: 4, user: "Артём", avatar: "Ар", color: "from-blue-400 to-sky-500", text: "Лена, я могу! Пишу в личку ✉️", time: "13:04" },
    { id: 5, user: "Катя", avatar: "К", color: "from-pink-400 to-rose-500", text: "Тут такие милые люди 🥰", time: "13:06" },
    { id: 6, user: "Олег", avatar: "О", color: "from-amber-400 to-orange-500", text: "Всем привет! Только пришёл 😊", time: "13:08" },
    { id: 7, user: "Лена", avatar: "Л", color: "from-violet-400 to-purple-500", text: "Олег, добро пожаловать! 🎉", time: "13:09" },
  ],
  новости: [
    { id: 1, user: "ВайбБот", avatar: "🤖", color: "from-[#5865f2] to-indigo-500", text: "📣 Новая версия 2.5 — добавлены реакции на сообщения!", time: "09:00" },
    { id: 2, user: "Максим", avatar: "М", color: "from-green-500 to-teal-500", text: "Реакции наконец-то! Ждал этого 🎯", time: "09:05" },
    { id: 3, user: "ВайбБот", avatar: "🤖", color: "from-[#5865f2] to-indigo-500", text: "🛡️ Обновление безопасности: улучшено шифрование звонков.", time: "09:10" },
    { id: 4, user: "Даша", avatar: "Д", color: "from-orange-400 to-red-500", text: "Отличные новости! Безопасность — это важно 🔒", time: "09:12" },
    { id: 5, user: "ВайбБот", avatar: "🤖", color: "from-[#5865f2] to-indigo-500", text: "📱 iOS-приложение обновлено — исправлены баги с уведомлениями.", time: "09:20" },
    { id: 6, user: "Игорь", avatar: "И", color: "from-blue-400 to-indigo-500", text: "Да! Наконец-то уведомления работают 🙏", time: "09:22" },
    { id: 7, user: "Анна", avatar: "А", color: "from-purple-500 to-pink-500", text: "Команда ВайбЧат не перестаёт удивлять 🚀", time: "09:25" },
  ],
  помощь: [
    { id: 1, user: "Вася", avatar: "В", color: "from-cyan-400 to-blue-500", text: "Как поменять аватар профиля?", time: "14:00" },
    { id: 2, user: "Саппорт", avatar: "S", color: "from-[#5865f2] to-violet-500", text: "Привет! Зайди в Настройки → Профиль → Аватар 😊", time: "14:01" },
    { id: 3, user: "Вася", avatar: "В", color: "from-cyan-400 to-blue-500", text: "Нашёл, спасибо! ❤️", time: "14:02" },
    { id: 4, user: "Катя", avatar: "К", color: "from-pink-400 to-rose-500", text: "Как создать групповой чат?", time: "14:05" },
    { id: 5, user: "Саппорт", avatar: "S", color: "from-[#5865f2] to-violet-500", text: "Нажми '+' рядом с каналами и выбери 'Создать группу' 👍", time: "14:06" },
    { id: 6, user: "Катя", avatar: "К", color: "from-pink-400 to-rose-500", text: "Супер, всё получилось! Команда лучшая 🌟", time: "14:08" },
    { id: 7, user: "Олег", avatar: "О", color: "from-amber-400 to-orange-500", text: "Можно ли восстановить удалённое сообщение?", time: "14:10" },
  ],
  мемы: [
    { id: 1, user: "Игорь", avatar: "И", color: "from-blue-400 to-indigo-500", text: "Когда наконец починили уведомления 😭🎉", time: "15:00" },
    { id: 2, user: "Даша", avatar: "Д", color: "from-orange-400 to-red-500", text: "АХАХАХА это точно про меня 💀", time: "15:01" },
    { id: 3, user: "Максим", avatar: "М", color: "from-green-500 to-teal-500", text: "Кто придумывает эти мемы — гений 😂", time: "15:03" },
    { id: 4, user: "Анна", avatar: "А", color: "from-purple-500 to-pink-500", text: "Я уже час тут сижу вместо работы 💅", time: "15:05" },
    { id: 5, user: "Вася", avatar: "В", color: "from-cyan-400 to-blue-500", text: "Анна, я тебя понимаю 😅😅😅", time: "15:06" },
    { id: 6, user: "Игорь", avatar: "И", color: "from-blue-400 to-indigo-500", text: "Этот чат — лучшее что случалось с моей продуктивностью... нет. 💀", time: "15:08" },
    { id: 7, user: "Даша", avatar: "Д", color: "from-orange-400 to-red-500", text: "☠️☠️☠️ УМЕРЛА", time: "15:09" },
  ],
};

const STATS = [
  { value: "2M+", label: "Пользователей", icon: <Users className="w-5 h-5" /> },
  { value: "50M+", label: "Сообщений в день", icon: <MessageCircle className="w-5 h-5" /> },
  { value: "99.9%", label: "Uptime", icon: <TrendingUp className="w-5 h-5" /> },
  { value: "150+", label: "Стран мира", icon: <Globe className="w-5 h-5" /> },
];

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Молниеносная скорость",
    desc: "Сообщения доставляются за миллисекунды. Никаких задержек и потерь.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "Сквозное шифрование",
    desc: "Все ваши переписки защищены end-to-end шифрованием. Никто кроме вас.",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Видеозвонки в HD",
    desc: "Кристально чёткое изображение и звук без задержек до 50 человек.",
    color: "from-blue-400 to-cyan-500",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Групповые чаты",
    desc: "До 1000 участников в одном канале. Для команды, сообщества или друзей.",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Работает везде",
    desc: "Web, iOS, Android, Windows, Mac — все устройства синхронизированы.",
    color: "from-indigo-400 to-violet-500",
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Бесплатно навсегда",
    desc: "Базовые функции абсолютно бесплатны. Без скрытых платежей и подписок.",
    color: "from-rose-400 to-pink-500",
  },
];

const CHANNELS = ["общий", "знакомства", "новости", "помощь", "мемы"];
const VOICE_ROOMS = ["Общий чат", "Видеозвонок", "Рабочая комната"];

const MEMBERS = [
  { name: "Анна", status: "В видеозвонке", avatar: "А", color: "from-purple-500 to-pink-500", statusColor: "bg-[#5865f2]", online: true },
  { name: "Максим", status: "В сети", avatar: "М", color: "from-green-500 to-teal-500", statusColor: "bg-[#3ba55c]", online: true },
  { name: "Даша", status: "Не беспокоить", avatar: "Д", color: "from-orange-400 to-red-500", statusColor: "bg-[#ed4245]", online: true },
  { name: "Игорь", status: "В сети", avatar: "И", color: "from-blue-400 to-indigo-500", statusColor: "bg-[#3ba55c]", online: true },
  { name: "Вася", status: "Печатает...", avatar: "В", color: "from-cyan-400 to-blue-500", statusColor: "bg-[#3ba55c]", online: true },
];

const API_URL = "https://functions.poehali.dev/b3eb4588-879d-4ad1-86a1-f3d5a18fd386";

const USER = { name: "Вася", avatar: "В", color: "from-[#5865f2] to-[#7c3aed]" };

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState("общий");
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [soundActive, setSoundActive] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef(0);

  // Загрузка сообщений при смене канала
  useEffect(() => {
    setVisibleMessages([]);
    lastIdRef.current = 0;
    setLoading(true);
    fetch(`${API_URL}?channel=${encodeURIComponent(activeChannel)}`)
      .then((r) => r.json())
      .then((msgs: ChatMessage[]) => {
        setVisibleMessages(msgs);
        if (msgs.length > 0) lastIdRef.current = msgs[msgs.length - 1].id;
      })
      .finally(() => setLoading(false));
  }, [activeChannel]);

  // Поллинг новых сообщений каждые 3 секунды
  useEffect(() => {
    const poll = () => {
      fetch(`${API_URL}?channel=${encodeURIComponent(activeChannel)}`)
        .then((r) => r.json())
        .then((msgs: ChatMessage[]) => {
          const newMsgs = msgs.filter((m) => m.id > lastIdRef.current);
          if (newMsgs.length > 0) {
            setVisibleMessages((prev) => [...prev, ...newMsgs]);
            lastIdRef.current = newMsgs[newMsgs.length - 1].id;
          }
        })
        .catch(() => {});
    };
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [activeChannel]);

  // Прокрутка чата вниз — только внутри контейнера, не всей страницы
  useEffect(() => {
    const container = chatScrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [visibleMessages]);

  // Intersection Observer для анимации секций
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === statsRef.current && entry.isIntersecting) {
            setStatsVisible(true);
          }
          if (entry.target === featuresRef.current && entry.isIntersecting) {
            setFeaturesVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSendMessage = async () => {
    const text = inputText.trim();
    if (!text || sending) return;
    setInputText("");
    setSending(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: activeChannel,
          user: USER.name,
          avatar: USER.avatar,
          color: USER.color,
          text,
        }),
      });
      const msg: ChatMessage = await res.json();
      setVisibleMessages((prev) => [...prev, msg]);
      lastIdRef.current = msg.id;
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#36393f] text-white overflow-x-hidden">
      {/* Навигация */}
      <nav className="bg-[#2f3136]/95 backdrop-blur-md border-b border-[#202225] px-4 sm:px-6 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#5865f2] rounded-xl flex items-center justify-center shadow-lg shadow-[#5865f2]/30">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">ВайбЧат</h1>
              <p className="text-[10px] text-[#b9bbbe] hidden sm:block leading-tight">Общайся. Звони. Будь на связи.</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] text-sm px-4">
              О нас
            </Button>
            <Button variant="ghost" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] text-sm px-4">
              Возможности
            </Button>
            <Button variant="ghost" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] text-sm px-4">
              Цены
            </Button>
            <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-lg shadow-[#5865f2]/25 transition-all hover:shadow-[#5865f2]/40">
              Начать бесплатно
            </Button>
          </div>

          <Button
            variant="ghost"
            className="sm:hidden text-[#b9bbbe] hover:text-white hover:bg-[#40444b] p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-[#202225] animate-fade-in">
            <div className="flex flex-col gap-2">
              <Button variant="ghost" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] justify-start text-sm">О нас</Button>
              <Button variant="ghost" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] justify-start text-sm">Возможности</Button>
              <Button variant="ghost" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] justify-start text-sm">Цены</Button>
              <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white rounded-lg text-sm font-semibold">
                Начать бесплатно
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero + Discord UI */}
      <div className="flex" style={{ height: "calc(100vh - 57px)" }}>
        {/* Боковая панель серверов */}
        <div className="hidden lg:flex w-[72px] bg-[#202225] flex-col items-center py-3 gap-2 flex-shrink-0">
          <div className="w-12 h-12 bg-[#5865f2] rounded-2xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer shadow-lg shadow-[#5865f2]/30">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div className="w-8 h-[2px] bg-[#36393f] rounded-full my-1"></div>
          {["🏠", "👥", "📢", "⭐", "🎮", "🎨"].map((emoji, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-[#36393f] rounded-3xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer hover:bg-[#5865f2] text-xl relative group"
            >
              {emoji}
              <div className="absolute left-full ml-3 bg-[#18191c] text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                Сервер {i + 1}
              </div>
            </div>
          ))}
          <div className="w-12 h-12 bg-[#36393f] rounded-3xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer hover:bg-[#3ba55c] text-2xl mt-auto mb-2">
            +
          </div>
        </div>

        {/* Каналы */}
        <div
          className={`${
            mobileSidebarOpen ? "fixed inset-0 z-40 flex" : "hidden"
          } lg:relative lg:flex w-full lg:w-60 bg-[#2f3136] flex-col flex-shrink-0`}
        >
          {/* Шапка каналов */}
          <div className="p-4 border-b border-[#202225] flex items-center justify-between shadow-sm">
            <div>
              <h2 className="text-white font-bold text-sm">ВайбЧат</h2>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-2 h-2 bg-[#3ba55c] rounded-full"></div>
                <span className="text-[#3ba55c] text-[10px]">5 онлайн</span>
              </div>
            </div>
            <Button
              variant="ghost"
              className="lg:hidden text-[#b9bbbe] hover:text-white hover:bg-[#40444b] p-1"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 p-2 overflow-y-auto">
            {/* Текстовые каналы */}
            <div className="mb-3">
              <button className="flex items-center gap-1 px-2 py-1 text-[#8e9297] text-xs font-semibold uppercase tracking-wider w-full hover:text-[#dcddde] transition-colors">
                <ChevronDown className="w-3 h-3" />
                <span>Текстовые каналы</span>
              </button>
              <div className="mt-1 space-y-0.5">
                {CHANNELS.map((channel) => (
                  <button
                    key={channel}
                    onClick={() => { setActiveChannel(channel); setMobileSidebarOpen(false); }}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded w-full text-left transition-all ${
                      activeChannel === channel
                        ? "bg-[#393c43] text-white"
                        : "text-[#8e9297] hover:text-[#dcddde] hover:bg-[#34373c]"
                    }`}
                  >
                    <Hash className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{channel}</span>
                    {channel === "общий" && (
                      <span className="ml-auto bg-[#ed4245] text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                        12
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Голосовые каналы */}
            <div>
              <button className="flex items-center gap-1 px-2 py-1 text-[#8e9297] text-xs font-semibold uppercase tracking-wider w-full hover:text-[#dcddde] transition-colors">
                <ChevronDown className="w-3 h-3" />
                <span>Голосовые комнаты</span>
              </button>
              <div className="mt-1 space-y-0.5">
                {VOICE_ROOMS.map((room, i) => (
                  <button
                    key={room}
                    className="flex items-center gap-2 px-2 py-1.5 rounded w-full text-left text-[#8e9297] hover:text-[#dcddde] hover:bg-[#34373c] transition-all"
                  >
                    <Volume2 className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate">{room}</span>
                    {i === 0 && (
                      <div className="ml-auto flex items-center gap-0.5">
                        {["А", "М"].map((a) => (
                          <div key={a} className="w-4 h-4 bg-[#5865f2] rounded-full flex items-center justify-center text-[8px] text-white font-bold -ml-1 first:ml-0 border border-[#2f3136]">
                            {a}
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Пользователь снизу */}
          <div className="p-2 bg-[#292b2f] flex items-center gap-2 border-t border-[#202225]">
            <div className="w-8 h-8 bg-gradient-to-br from-[#5865f2] to-[#7c3aed] rounded-full flex items-center justify-center relative">
              <span className="text-white text-sm font-bold">В</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#3ba55c] border-2 border-[#292b2f] rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">Вася</div>
              <div className="text-[#b9bbbe] text-[10px] truncate">#вася0001</div>
            </div>
            <div className="flex gap-0.5">
              <button
                onClick={() => setMicActive(!micActive)}
                className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${micActive ? "text-[#ed4245] hover:bg-[#ed4245]/20" : "text-[#b9bbbe] hover:bg-[#40444b] hover:text-white"}`}
              >
                {micActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setSoundActive(!soundActive)}
                className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${!soundActive ? "text-[#ed4245] hover:bg-[#ed4245]/20" : "text-[#b9bbbe] hover:bg-[#40444b] hover:text-white"}`}
              >
                {soundActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button className="w-7 h-7 rounded flex items-center justify-center text-[#b9bbbe] hover:bg-[#40444b] hover:text-white transition-colors">
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Основная область чата */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Шапка канала */}
          <div className="h-12 bg-[#36393f] border-b border-[#202225] flex items-center px-4 gap-2 flex-shrink-0 shadow-sm z-10">
            <button
              className="lg:hidden text-[#8e9297] hover:text-[#dcddde] hover:bg-[#40444b] p-1 rounded mr-1 transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <Hash className="w-4 h-4 text-[#8e9297]" />
            <span className="text-white font-semibold text-sm">{activeChannel}</span>
            <div className="w-px h-5 bg-[#40444b] mx-2 hidden sm:block"></div>
            <span className="text-[#8e9297] text-xs hidden sm:block truncate">
              Добро пожаловать в #{activeChannel}! Здесь общаются люди со всего мира.
            </span>
            <div className="ml-auto flex items-center gap-3">
              <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors hidden sm:block">
                <Phone className="w-4 h-4" />
              </button>
              <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors hidden sm:block">
                <Video className="w-4 h-4" />
              </button>
              <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors hidden md:block">
                <Users className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Сообщения */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1">
            {/* Приветствие канала */}
            <div className="flex flex-col items-start mb-6">
              <div className="w-16 h-16 bg-[#5865f2] rounded-full flex items-center justify-center mb-3 shadow-lg shadow-[#5865f2]/30">
                <Hash className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-1">Добро пожаловать в #{activeChannel}!</h2>
              <p className="text-[#b9bbbe] text-sm">
                Это начало канала <span className="text-white font-medium">#{activeChannel}</span>. Начни общаться с людьми прямо сейчас!
              </p>
              <div className="w-full h-px bg-[#40444b] my-4"></div>
            </div>

            {/* Загрузка */}
            {loading && (
              <div className="flex items-center gap-2 px-2 py-3 text-[#b9bbbe] text-sm">
                <div className="w-4 h-4 border-2 border-[#5865f2] border-t-transparent rounded-full animate-spin"></div>
                Загрузка сообщений...
              </div>
            )}

            {/* Сообщения из БД */}
            {!loading && visibleMessages.filter(Boolean).map((msg) => (
              <div
                key={msg.id}
                className="flex gap-3 px-1 py-1 rounded-lg hover:bg-[#32353b] group transition-colors animate-msg-in"
              >
                <div
                  className={`w-9 h-9 bg-gradient-to-br ${msg.color ?? "from-[#5865f2] to-[#7c3aed]"} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}
                >
                  <span className="text-white text-xs font-bold">{msg.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-semibold text-sm hover:underline cursor-pointer">{msg.user}</span>
                    <span className="text-[#72767d] text-[10px]">в {msg.time}</span>
                  </div>
                  <p className="text-[#dcddde] text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}

            {/* Пустой канал */}
            {!loading && visibleMessages.length === 0 && (
              <p className="text-[#72767d] text-sm px-2">Сообщений пока нет. Напиши первым!</p>
            )}
          </div>

          {/* Поле ввода */}
          <div className="p-3 sm:p-4 flex-shrink-0">
            <div className="bg-[#40444b] rounded-xl px-4 py-2.5 flex items-center gap-3 border border-transparent focus-within:border-[#5865f2]/30 transition-all">
              <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors flex-shrink-0">
                <Smile className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={`Написать в #${activeChannel}`}
                className="flex-1 bg-transparent text-[#dcddde] placeholder-[#72767d] text-sm outline-none"
              />
              <div className="flex items-center gap-2">
                <button className="text-[#b9bbbe] hover:text-[#dcddde] transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !inputText.trim()}
                  className={`transition-colors ${inputText.trim() && !sending ? "text-[#5865f2] hover:text-[#4752c4]" : "text-[#b9bbbe]"}`}
                >
                  {sending
                    ? <div className="w-4 h-4 border-2 border-[#5865f2] border-t-transparent rounded-full animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Список участников */}
        <div className="hidden xl:flex w-60 bg-[#2f3136] flex-col flex-shrink-0 p-3">
          <h3 className="text-[#8e9297] text-xs font-semibold uppercase tracking-wider mb-3 px-2">
            В сети — {MEMBERS.length}
          </h3>
          <div className="space-y-1">
            {MEMBERS.map((member, i) => (
              <button
                key={i}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-md w-full text-left hover:bg-[#393c43] transition-colors group"
              >
                <div className={`w-8 h-8 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center relative flex-shrink-0`}>
                  <span className="text-white text-xs font-bold">{member.avatar}</span>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${member.statusColor} border-2 border-[#2f3136] rounded-full`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[#b9bbbe] group-hover:text-white text-sm font-medium truncate transition-colors">
                    {member.name}
                  </div>
                  <div className={`text-[10px] truncate ${member.status === "Печатает..." ? "text-[#3ba55c] animate-pulse" : "text-[#72767d]"}`}>
                    {member.status}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Секция статистики ===== */}
      <div ref={statsRef} className="bg-[#2f3136] border-t border-[#202225] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#5865f2]/10 border border-[#5865f2]/20 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#5865f2]" />
              <span className="text-[#5865f2] text-xs font-semibold">Нам доверяют миллионы</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              ВайбЧат в цифрах
            </h2>
            <p className="text-[#b9bbbe] text-sm sm:text-base max-w-xl mx-auto">
              Каждый день миллионы людей общаются, работают и дружат с помощью ВайбЧат
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className={`bg-[#36393f] border border-[#40444b] rounded-2xl p-6 text-center transition-all duration-700 ${
                  statsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 bg-[#5865f2]/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-[#5865f2]">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-[#b9bbbe] text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Секция возможностей ===== */}
      <div ref={featuresRef} className="bg-[#36393f] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#3ba55c]/10 border border-[#3ba55c]/20 rounded-full px-4 py-1.5 mb-4">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3ba55c]" />
              <span className="text-[#3ba55c] text-xs font-semibold">Всё что нужно</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Почему выбирают ВайбЧат?
            </h2>
            <p className="text-[#b9bbbe] text-sm sm:text-base max-w-xl mx-auto">
              Мы собрали всё необходимое для современного общения в одном приложении
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className={`bg-[#2f3136] border border-[#40444b] rounded-2xl p-6 hover:border-[#5865f2]/40 hover:-translate-y-1 transition-all duration-500 group ${
                  featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-[#b9bbbe] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Секция "Как начать" ===== */}
      <div className="bg-[#2f3136] py-20 px-4 border-t border-[#202225]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Начни за 3 шага
            </h2>
            <p className="text-[#b9bbbe] text-sm sm:text-base">
              Регистрация занимает меньше минуты
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Линия между шагами на десктопе */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-[#5865f2] via-[#5865f2]/50 to-transparent" style={{ left: "calc(16.6% + 20px)", right: "calc(16.6% + 20px)" }}></div>

            {[
              { step: "1", title: "Зарегистрируйся", desc: "Создай аккаунт за 30 секунд. Только email и пароль.", icon: <Star className="w-5 h-5" /> },
              { step: "2", title: "Найди людей", desc: "Ищи по интересам или пригласи друзей по ссылке.", icon: <Users className="w-5 h-5" /> },
              { step: "3", title: "Общайся!", desc: "Текст, голос, видео — всё в одном месте без ограничений.", icon: <MessageCircle className="w-5 h-5" /> },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#5865f2] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#5865f2]/30 text-white font-bold text-2xl relative z-10">
                  {item.step}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-[#b9bbbe] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-12">
            <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-8 py-3 rounded-xl text-base font-semibold shadow-lg shadow-[#5865f2]/30 hover:shadow-[#5865f2]/50 transition-all hover:-translate-y-0.5">
              <MessageCircle className="w-5 h-5 mr-2" />
              Начать бесплатно
            </Button>
            <Button
              variant="outline"
              className="border-[#4f545c] text-[#b9bbbe] hover:bg-[#40444b] hover:text-white hover:border-[#6d6f78] px-8 py-3 rounded-xl text-base font-semibold bg-transparent transition-all hover:-translate-y-0.5"
            >
              <Phone className="w-5 h-5 mr-2" />
              Демо-звонок
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Отзывы ===== */}
      <div className="bg-[#36393f] py-20 px-4 border-t border-[#202225]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Что говорят пользователи</h2>
            <p className="text-[#b9bbbe] text-sm">Реальные отзывы настоящих людей</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                name: "Анна К.",
                role: "Дизайнер",
                text: "Наконец-то нашла мессенджер, где можно нормально работать с командой. Видеозвонки просто улёт!",
                avatar: "А",
                color: "from-purple-500 to-pink-500",
                stars: 5,
              },
              {
                name: "Максим Р.",
                role: "Разработчик",
                text: "Использую для рабочих созвонов каждый день. Качество звука лучше чем у конкурентов. Однозначно рекомендую.",
                avatar: "М",
                color: "from-green-500 to-teal-500",
                stars: 5,
              },
              {
                name: "Даша В.",
                role: "Маркетолог",
                text: "Перевела всю команду с другого мессенджера. Теперь не понимаю, как мы раньше без этого жили 😄",
                avatar: "Д",
                color: "from-orange-400 to-red-500",
                stars: 5,
              },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-[#2f3136] border border-[#40444b] rounded-2xl p-6 hover:border-[#5865f2]/30 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: review.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]" />
                  ))}
                </div>
                <p className="text-[#dcddde] text-sm leading-relaxed mb-5">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 bg-gradient-to-br ${review.color} rounded-full flex items-center justify-center`}>
                    <span className="text-white text-sm font-bold">{review.avatar}</span>
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{review.name}</div>
                    <div className="text-[#72767d] text-xs">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== CTA баннер ===== */}
      <div className="bg-gradient-to-r from-[#5865f2] via-[#6f7bf7] to-[#7c3aed] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Готов начать? 🚀
          </div>
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Присоединяйся к 2 миллионам пользователей которые уже общаются в ВайбЧат
          </p>
          <Button className="bg-white text-[#5865f2] hover:bg-white/90 px-10 py-4 rounded-xl text-base font-bold shadow-xl hover:-translate-y-0.5 transition-all">
            Зарегистрироваться бесплатно
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* ===== Footer ===== */}
      <footer className="bg-[#202225] border-t border-[#18191c] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#5865f2] rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-bold">ВайбЧат</span>
              </div>
              <p className="text-[#72767d] text-xs leading-relaxed mb-4">
                Современный мессенджер для общения, работы и жизни.
              </p>
              <div className="flex gap-2">
                {["🐦", "📘", "📸", "💬"].map((icon, i) => (
                  <button
                    key={i}
                    className="w-8 h-8 bg-[#36393f] hover:bg-[#40444b] rounded-lg flex items-center justify-center text-sm transition-colors"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {[
              {
                title: "Продукт",
                links: ["Возможности", "Цены", "Безопасность", "Что нового"],
              },
              {
                title: "Компания",
                links: ["О нас", "Блог", "Карьера", "Контакты"],
              },
              {
                title: "Поддержка",
                links: ["Документация", "FAQ", "Статус", "Сообщить о баге"],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-white text-sm font-semibold mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <button className="text-[#72767d] hover:text-[#b9bbbe] text-xs transition-colors">
                        {link}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-[#2f3136] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[#72767d] text-xs">
              © 2025 ВайбЧат. Все права защищены.
            </p>
            <div className="flex items-center gap-4">
              <button className="text-[#72767d] hover:text-[#b9bbbe] text-xs transition-colors">Конфиденциальность</button>
              <button className="text-[#72767d] hover:text-[#b9bbbe] text-xs transition-colors">Условия использования</button>
              <button className="text-[#72767d] hover:text-[#b9bbbe] text-xs transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;