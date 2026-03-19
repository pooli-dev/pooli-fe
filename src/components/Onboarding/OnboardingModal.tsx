import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PanInfo } from "framer-motion";
import { getSlides } from "./slides";
import type { SlideData } from "./slides";
import { NotificationMock } from "./MockUI";
import screenshot1 from "@/assets/img/screenshot1.png";
import screenshot2 from "@/assets/img/screenshot2.png";
import screenshot3 from "@/assets/img/screenshot3.png";
import screenshot4 from "@/assets/img/screenshot4.png";
import screenshot5 from "@/assets/img/screenshot5.png";
import screenshot7 from "@/assets/img/screenshot7.png";
import screenshot8 from "@/assets/img/screenshot8.png";

const SCREENSHOT_PATHS: Record<number, string> = {
  2: screenshot1,
  3: screenshot2,
  4: screenshot3,
  5: screenshot4,
  6: screenshot5,
  // 7번은 NotificationMock으로 대체 — 여기서 제거
  8: screenshot7,
  9: screenshot8,
};

const MUNEO_CONFIGS: Record<
  number,
  {
    right?: string;
    left?: string;
    size: string;
    rotate?: number;
    floatY?: number;
  }
> = {
  1: { left: "50%", size: "w-44 h-44", floatY: 14 },
  2: { right: "5%", size: "w-28 h-28", rotate: -6, floatY: 8 },
  3: { left: "5%", size: "w-28 h-28", floatY: 7 },
  4: { right: "5%", size: "w-28 h-28", rotate: 5, floatY: 8 },
  5: { left: "5%", size: "w-28 h-28", rotate: -4, floatY: 7 },
  6: { right: "5%", size: "w-28 h-28", floatY: 7 },
  7: { left: "5%", size: "w-28 h-28", rotate: 6, floatY: 8 },
  8: { right: "5%", size: "w-28 h-28", rotate: -5, floatY: 7 },
  9: { left: "5%", size: "w-28 h-28", rotate: 4, floatY: 7 },
  10: { left: "50%", size: "w-48 h-48", floatY: 16 },
};

// ── 타이핑 훅: 컴포넌트 mount 시 자동 시작 ──────────────────────────────────
function useSequentialTyping(title: string, desc: string) {
  const [typedTitle, setTypedTitle] = useState("");
  const [typedDesc, setTypedDesc] = useState("");
  const [titleDone, setTitleDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let i = 0;

    const titleTimer = setInterval(() => {
      if (cancelled) return;
      i++;
      setTypedTitle(title.slice(0, i));
      if (i >= title.length) {
        clearInterval(titleTimer);
        setTitleDone(true);

        let j = 0;
        const descTimer = setInterval(() => {
          if (cancelled) return;
          j++;
          setTypedDesc(desc.slice(0, j));
          if (j >= desc.length) clearInterval(descTimer);
        }, 25);
      }
    }, 40);

    return () => {
      cancelled = true;
      clearInterval(titleTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { typedTitle, typedDesc, titleDone };
}

// ── 물결 구분선 ──────────────────────────────────────────────────────────────
function OceanWave() {
  return (
    <div
      className="w-full overflow-hidden"
      style={{ marginTop: "-2px", lineHeight: 0 }}
    >
      <svg
        viewBox="0 0 480 36"
        preserveAspectRatio="none"
        style={{ width: "100%", height: "36px", display: "block" }}
      >
        <motion.path
          fill="#b3dcff"
          animate={{
            d: [
              "M0,18 C80,36 160,0 240,18 C320,36 400,0 480,18 L480,36 L0,36 Z",
              "M0,10 C80,0 160,28 240,10 C320,0 400,28 480,10 L480,36 L0,36 Z",
              "M0,18 C80,36 160,0 240,18 C320,36 400,0 480,18 L480,36 L0,36 Z",
            ],
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        />
        <motion.path
          fill="#bfe2ff"
          animate={{
            d: [
              "M0,26 C120,12 240,34 360,22 C420,16 460,28 480,26 L480,36 L0,36 Z",
              "M0,22 C120,32 240,14 360,28 C420,34 460,18 480,22 L480,36 L0,36 Z",
              "M0,26 C120,12 240,34 360,22 C420,16 460,28 480,26 L480,36 L0,36 Z",
            ],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </svg>
    </div>
  );
}

// ── 수영장 장식 ───────────────────────────────────────────────────────────────
function PoolDeco() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <motion.div
        className="absolute text-4xl"
        style={{ top: "12%", right: "4%", opacity: 0.5 }}
        animate={{ rotate: [0, 10, -8, 0], y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      >
        🐳
      </motion.div>
      <motion.div
        className="absolute text-3xl"
        style={{ top: "3%", left: "6%", opacity: 0.5 }}
        animate={{ rotate: [0, 360], y: [0, -8, 0] }}
        transition={{
          rotate: { repeat: Infinity, duration: 10, ease: "linear" },
          y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
        }}
      >
        🪸
      </motion.div>
      <motion.div
        className="absolute text-sm"
        style={{ top: "28%", left: "3%", opacity: 1 }}
        animate={{ y: [0, -10, 0], opacity: [0.3, 0.5, 0.2] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        💧
      </motion.div>
      <motion.div
        className="absolute text-sm"
        style={{ top: "52%", right: "3%", opacity: 1 }}
        animate={{ y: [0, -10, 0], opacity: [0.5, 0.3, 0.5] }}
        transition={{
          repeat: Infinity,
          duration: 5,
          delay: 0.8,
          ease: "easeInOut",
        }}
      >
        🫧
      </motion.div>
      <motion.div
        className="absolute text-sm"
        style={{ top: "98%", left: "12%", opacity: 1 }}
        animate={{ y: [0, -10, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{
          repeat: Infinity,
          duration: 5,
          delay: 0.8,
          ease: "easeInOut",
        }}
      >
        🦀
      </motion.div>
    </div>
  );
}

// ── 커서 컴포넌트 ─────────────────────────────────────────────────────────────
function Cursor({
  height = "h-5",
  color = "bg-white",
}: {
  height?: string;
  color?: string;
}) {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ repeat: Infinity, duration: 0.5 }}
      className={`inline-block w-[2px] ${height} ${color} ml-1 align-middle rounded-full`}
    />
  );
}

// ── 슬라이드 컨텐츠 ───────────────────────────────────────────────────────────
function SlideContent({
  slide,
  direction,
}: {
  slide: SlideData;
  direction: number;
}) {
  const muneoConfig = MUNEO_CONFIGS[slide.id] ?? MUNEO_CONFIGS[1];
  const screenshotSrc = SCREENSHOT_PATHS[slide.id];
  const isNotificationSlide = slide.id === 7;
  const isCentered = muneoConfig.left === "50%";

  const titleText = slide.title.replace(/\n/g, " ");
  const descText = slide.description.replace(/\n/g, " ");

  const { typedTitle, typedDesc, titleDone } = useSequentialTyping(
    titleText,
    descText,
  );

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <motion.div
      key={slide.id}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="absolute inset-0 flex flex-col"
    >
      {screenshotSrc || isNotificationSlide ? (
        <>
          {/* 상단 3/4: 스크린샷 or NotificationMock */}
          <div
            className="relative flex items-center justify-center"
            style={{
              height: "75%",
              background:
                "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 60%, #d4eeff 100%)",
            }}
          >
            <PoolDeco />

            {/* 7번 슬라이드: NotificationMock */}
            {isNotificationSlide ? (
              <div
                className="relative z-10"
                style={{
                  height: "90%",
                  width: "auto",
                  maxWidth: "80%",
                  aspectRatio: "9 / 19.5", // 스크린샷 비율에 맞게 조정
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                }}
              >
                <NotificationMock />
              </div>
            ) : (
              <motion.img
                src={screenshotSrc}
                alt="화면 미리보기"
                className="relative z-10 object-contain"
                style={{
                  height: "90%",
                  width: "auto",
                  maxWidth: "80%",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                }}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "0";
                }}
              />
            )}

            <motion.img
              src={slide.muneoImg}
              alt="무너"
              className={`absolute bottom-0 z-20 ${muneoConfig.size} object-contain`}
              style={{
                ...(isCentered
                  ? { left: "50%", transform: "translateX(-50%)" }
                  : muneoConfig.left
                    ? { left: muneoConfig.left }
                    : { right: muneoConfig.right }),
                rotate: muneoConfig.rotate
                  ? `${muneoConfig.rotate}deg`
                  : undefined,
                filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.18))",
              }}
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={{
                y: [0, -(muneoConfig.floatY ?? 8), 0],
                opacity: 1,
                scale: 1,
              }}
              transition={{
                opacity: { duration: 0.35 },
                scale: { duration: 0.4, type: "spring", damping: 14 },
                y: {
                  repeat: Infinity,
                  duration: 3.2,
                  ease: "easeInOut",
                  delay: 0.4,
                },
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* 물결 */}
          <OceanWave />

          {/* 하단: 텍스트 */}
          <div
            className="flex-1 flex flex-col items-center justify-start px-6 gap-1 pt-4 pb-[120px]"
            style={{
              background:
                "linear-gradient(180deg, #bfe2ff 0%, #b3dcff 40%, #b3dcff 100%)",
            }}
          >
            {slide.repOnly && (
              <span className="border border-yellow-300/60 bg-yellow-300/15 text-yellow-500 text-[11px] font-semibold rounded-full px-4 py-1 mb-1">
                ⭐ 대표자 전용
              </span>
            )}
            <p className="text-[#0284c7] text-[20px] font-bold text-center leading-snug min-h-[40px]">
              {typedTitle}
              {!titleDone && <Cursor height="h-5" color="bg-white" />}
            </p>
            <p className="text-white text-[13px] text-center leading-relaxed min-h-[38px] mt-1">
              {typedDesc}
              {titleDone && typedDesc.length < descText.length && (
                <Cursor height="h-[13px]" color="bg-sky-300" />
              )}
            </p>
          </div>
        </>
      ) : (
        <>
          {/* 1번/10번: 스크린샷 없는 슬라이드 */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 35%, #bae6fd 65%, #bfe2ff 85%, #97cefc 100%)",
            }}
          />
          <PoolDeco />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 px-6">
            <div className="relative flex items-center justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full border border-sky-300/35"
                  style={{ width: 130 + i * 55, height: 130 + i * 55 }}
                  animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.08, 0.4] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5 + i * 0.5,
                    delay: i * 0.4,
                  }}
                />
              ))}
              <motion.div
                className="w-28 h-28 rounded-full flex items-center justify-center text-5xl"
                style={{
                  background: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255,255,255,0.65)",
                }}
                animate={{
                  boxShadow: [
                    "0 4px 24px rgba(56,189,248,0.2)",
                    "0 4px 42px rgba(56,189,248,0.55)",
                    "0 4px 24px rgba(56,189,248,0.2)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
                {slide.id === 1 ? "👋" : "🚀"}
              </motion.div>
            </div>

            <motion.img
              src={slide.muneoImg}
              alt="무너"
              className={`${muneoConfig.size} object-contain`}
              style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.15))" }}
              initial={{ y: 20, opacity: 0, scale: 0.8 }}
              animate={{
                y: [0, -(muneoConfig.floatY ?? 10), 0],
                opacity: 1,
                scale: 1,
              }}
              transition={{
                opacity: { duration: 0.35 },
                scale: { duration: 0.4, type: "spring", damping: 14 },
                y: {
                  repeat: Infinity,
                  duration: 3.5,
                  ease: "easeInOut",
                  delay: 0.5,
                },
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />

            <div className="flex flex-col items-center gap-2">
              <p className="text-sky-900 text-[24px] font-bold text-center leading-snug min-h-[58px]">
                {typedTitle}
                {!titleDone && <Cursor height="h-6" color="bg-sky-700" />}
              </p>
              <p className="text-sky-700 text-[14px] text-center leading-relaxed min-h-[38px]">
                {typedDesc}
                {titleDone && typedDesc.length < descText.length && (
                  <Cursor height="h-[14px]" color="bg-sky-500" />
                )}
              </p>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
interface OnboardingModalProps {
  onComplete: () => void;
  isRepresentative?: boolean;
}

export default function OnboardingModal({
  onComplete,
  isRepresentative = false,
}: OnboardingModalProps) {
  const slides = getSlides(isRepresentative);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const current = slides[currentIndex];
  const isLast = currentIndex === slides.length - 1;
  const progress = ((currentIndex + 1) / slides.length) * 100;

  const goTo = (index: number, dir = 1) => {
    setDirection(dir);
    setCurrentIndex(index);
  };
  const handleNext = () => (isLast ? onComplete() : goTo(currentIndex + 1, 1));
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x < -60 && currentIndex < slides.length - 1)
      goTo(currentIndex + 1, 1);
    else if (info.offset.x > 60 && currentIndex > 0) goTo(currentIndex - 1, -1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="absolute inset-0 z-[200] flex flex-col overflow-hidden"
      style={{
        background: "#d4eeff",
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.08}
      onDragEnd={handleDragEnd}
    >
      {/* 진행 바 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30">
        <motion.div
          className="h-full rounded-r-full"
          style={{ background: "linear-gradient(90deg, #38bdf8, #fff)" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* 건너뛰기 */}
      {!isLast && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onComplete}
          className="absolute top-5 right-4 z-30 bg-white/40 backdrop-blur-sm rounded-full text-sky-800 text-xs font-semibold px-4 py-2 hover:bg-white/60 transition-colors shadow-sm"
        >
          건너뛰기
        </motion.button>
      )}

      {/* 슬라이드 — key=slide.id 로 매번 새로 mount */}
      <AnimatePresence mode="wait" custom={direction}>
        <SlideContent key={current.id} slide={current} direction={direction} />
      </AnimatePresence>

      {/* 하단 고정 바 */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-8 pt-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2">
          {slides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => goTo(i, i > currentIndex ? 1 : -1)}
              animate={{
                width: i === currentIndex ? 22 : 7,
                background:
                  i === currentIndex ? "#fff" : "rgba(255,255,255,0.28)",
              }}
              className="h-[7px] rounded-full"
              transition={{ duration: 0.25 }}
            />
          ))}
        </div>
        <motion.button
          onClick={handleNext}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.01 }}
          className="w-full h-[52px] rounded-2xl font-bold text-[16px] text-white relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0282c4, #0ea5e9)",
            boxShadow: "0 4px 18px rgba(14,165,233,0.4)",
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
          />
          <span className="relative z-10">
            {isLast ? "🏊 지금 시작하기" : "다음 →"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
