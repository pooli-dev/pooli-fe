// App icon imports
import logo from "../assets/img/logo.svg";
import youtubeIcon from "../assets/img/app/youtube.png";
import instaIcon from "../assets/img/app/instagram.svg";
import tiktokIcon from "../assets/img/app/tiktok.svg";
import netflixIcon from "../assets/img/app/netflix.jpg";
import kakaotalkIcon from "../assets/img/app/kakaotalk.png";
import melonIcon from "../assets/img/app/melon.png";
import safariIcon from "../assets/img/app/safari.png";
import chromeIcon from "../assets/img/app/chrome.jpeg";
import naverIcon from "../assets/img/app/naver.jpeg";
import coupangIcon from "../assets/img/app/coupang.jpeg";
import tossIcon from "../assets/img/app/toss.jpeg";
import zoomIcon from "../assets/img/app/zoom.jpeg";
import whatsappIcon from "../assets/img/app/whatsapp.png";
import wechatIcon from "../assets/img/app/wechat.png";
import udemyIcon from "../assets/img/app/udemy.png";
import twitchIcon from "../assets/img/app/twitch.png";
import temuIcon from "../assets/img/app/temu.png";
import telegramIcon from "../assets/img/app/telegram.jpeg";
import teamsIcon from "../assets/img/app/teams.jpeg";
import spotifyIcon from "../assets/img/app/spotify.png";
import snapchatIcon from "../assets/img/app/snapchat.png";
import slackIcon from "../assets/img/app/slack.png";
import quizletIcon from "../assets/img/app/quizlet.webp";
import primevideoIcon from "../assets/img/app/primevideo.jpeg";
import operaIcon from "../assets/img/app/opera.jpg";
import notionIcon from "../assets/img/app/notion.png";
import lineIcon from "../assets/img/app/line.png";
import huluIcon from "../assets/img/app/hulu.jpeg";
import googlemapsIcon from "../assets/img/app/googlemaps.png";
import googledriveIcon from "../assets/img/app/googledrive.png";
import googleclassroomIcon from "../assets/img/app/googleclassroom.png";
import gmarketIcon from "../assets/img/app/gmarket.jpeg";
import gmailIcon from "../assets/img/app/gmail.png";
import firefoxIcon from "../assets/img/app/firefox.jpeg";
import facebookIcon from "../assets/img/app/facebook.png";
import edgeIcon from "../assets/img/app/edge.jpeg";
import ebayIcon from "../assets/img/app/ebay.jpg";
import duolingoIcon from "../assets/img/app/duolingo.png";
import disneyIcon from "../assets/img/app/disney+.jpeg";
import crunchyrollIcon from "../assets/img/app/crunchyroll.png";
import courseraIcon from "../assets/img/app/coursera.png";
import codecademyIcon from "../assets/img/app/codecademy.png";
import brilliantIcon from "../assets/img/app/brilliant.png";
import braveIcon from "../assets/img/app/brave.png";
import appletvIcon from "../assets/img/app/appletv.png";
import amazonIcon from "../assets/img/app/amazon.jpg";
import aliexpressIcon from "../assets/img/app/aliexpress.svg";
import elevenStIcon from "../assets/img/app/11st.png";
import oliveyoungIcon from "../assets/img/app/oliveyoung.png";

// 백엔드 영어 이름 -> 한글 표시 이름
const APP_NAME_KR_MAP: { [key: string]: string } = {
  "11st": "11번가",
  "Naver Store": "네이버 스토어",
  "Olive Young": "올리브영",
  Gmarket: "G마켓",
  KakaoTalk: "카카오톡",
  Coupang: "쿠팡",
  Duolingo: "듀오링고",
};

// 검색 키워드 매핑 (영어/한글 검색 지원)
const APP_SEARCH_KEYWORDS: { [key: string]: string[] } = {
  "11st": ["11번가", "11st", "십일번가"],
  "Naver Store": ["네이버스토어", "네이버 스토어", "naver store", "naverstore"],
  "Olive Young": ["올리브영", "olive young", "oliveyoung"],
  Gmarket: ["G마켓", "지마켓", "gmarket", "g마켓"],
  KakaoTalk: ["카카오톡", "kakaotalk", "kakao"],
  Coupang: ["쿠팡", "coupang"],
  Duolingo: ["듀오링고", "duolingo"],
  Instagram: ["인스타그램", "인스타", "instagram", "insta"],
  TikTok: ["틱톡", "tiktok"],
  Melon: ["멜론", "melon"],
  YouTube: ["유튜브", "youtube"],
  Netflix: ["넷플릭스", "netflix"],
  Safari: ["사파리", "safari"],
  Chrome: ["크롬", "chrome"],
  Naver: ["네이버", "naver"],
  Toss: ["토스", "toss"],
  Zoom: ["줌", "zoom"],
  WhatsApp: ["왓츠앱", "whatsapp"],
  WeChat: ["위챗", "wechat"],
  Udemy: ["유데미", "udemy"],
  Twitch: ["트위치", "twitch"],
  Temu: ["테무", "temu"],
  Telegram: ["텔레그램", "telegram"],
  Teams: ["팀즈", "teams"],
  Spotify: ["스포티파이", "spotify"],
  Snapchat: ["스냅챗", "snapchat"],
  Slack: ["슬랙", "slack"],
  Quizlet: ["퀴즐렛", "quizlet"],
  "Prime Video": ["프라임비디오", "프라임 비디오", "prime video", "primevideo"],
  Opera: ["오페라", "opera"],
  Notion: ["노션", "notion"],
  LINE: ["라인", "line"],
  Hulu: ["훌루", "hulu"],
  "Google Maps": ["구글맵", "구글 맵", "google maps", "googlemaps"],
  "Google Drive": ["구글드라이브", "구글 드라이브", "google drive", "googledrive"],
  "Google Classroom": ["구글클래스룸", "구글 클래스룸", "google classroom", "googleclassroom"],
  Gmail: ["지메일", "gmail"],
  Firefox: ["파이어폭스", "firefox"],
  Facebook: ["페이스북", "facebook"],
  Edge: ["엣지", "edge"],
  eBay: ["이베이", "ebay"],
  "Disney+": ["디즈니+", "디즈니플러스", "disney+", "disney"],
  Crunchyroll: ["크런치롤", "crunchyroll"],
  Coursera: ["코세라", "coursera"],
  Codecademy: ["코드카데미", "codecademy"],
  Brilliant: ["브릴리언트", "brilliant"],
  Brave: ["브레이브", "brave"],
  "Apple TV": ["애플티비", "애플 티비", "apple tv", "appletv"],
  Amazon: ["아마존", "amazon"],
  AliExpress: ["알리익스프레스", "알리", "aliexpress"],
};

export const APP_ICONS: { [key: string]: string } = {
  Zoom: zoomIcon,
  YouTube: youtubeIcon,
  WhatsApp: whatsappIcon,
  WeChat: wechatIcon,
  Udemy: udemyIcon,
  Twitch: twitchIcon,
  TikTok: tiktokIcon,
  Temu: temuIcon,
  Telegram: telegramIcon,
  Teams: teamsIcon,
  Spotify: spotifyIcon,
  Snapchat: snapchatIcon,
  Slack: slackIcon,
  Safari: safariIcon,
  Quizlet: quizletIcon,
  "Prime Video": primevideoIcon,
  Opera: operaIcon,
  "Olive Young": oliveyoungIcon,
  Notion: notionIcon,
  Netflix: netflixIcon,
  "Naver Store": naverIcon,
  LINE: lineIcon,
  KakaoTalk: kakaotalkIcon,
  Instagram: instaIcon,
  Hulu: huluIcon,
  "Google Maps": googlemapsIcon,
  "Google Drive": googledriveIcon,
  "Google Classroom": googleclassroomIcon,
  Gmarket: gmarketIcon,
  Gmail: gmailIcon,
  Firefox: firefoxIcon,
  Facebook: facebookIcon,
  Edge: edgeIcon,
  eBay: ebayIcon,
  Duolingo: duolingoIcon,
  "Disney+": disneyIcon,
  Crunchyroll: crunchyrollIcon,
  Coursera: courseraIcon,
  Coupang: coupangIcon,
  Codecademy: codecademyIcon,
  Chrome: chromeIcon,
  Brilliant: brilliantIcon,
  Brave: braveIcon,
  "Apple TV": appletvIcon,
  Amazon: amazonIcon,
  AliExpress: aliexpressIcon,
  "11st": elevenStIcon,
  Naver: naverIcon,
  Toss: tossIcon,
  Melon: melonIcon,
};

export const getAppIcon = (appName: string): string => {
  return APP_ICONS[appName] || logo;
};

export const getDisplayAppName = (appName: string): string => {
  return APP_NAME_KR_MAP[appName] || appName;
};

// 영어/한글 검색 지원
export const matchesSearchQuery = (appName: string, searchQuery: string): boolean => {
  if (!searchQuery) return true;
  
  const normalizedSearch = searchQuery.toLowerCase().trim().replace(/\s+/g, '');
  
  const normalizedAppName = appName.toLowerCase().replace(/\s+/g, '');
  if (normalizedAppName.includes(normalizedSearch)) return true;
  
  const displayName = getDisplayAppName(appName);
  const normalizedDisplayName = displayName.toLowerCase().replace(/\s+/g, '');
  if (normalizedDisplayName.includes(normalizedSearch)) return true;
  
  const keywords = APP_SEARCH_KEYWORDS[appName] || [];
  return keywords.some(keyword => {
    const normalizedKeyword = keyword.toLowerCase().replace(/\s+/g, '');
    return normalizedKeyword.includes(normalizedSearch) || 
           normalizedSearch.includes(normalizedKeyword);
  });
};
