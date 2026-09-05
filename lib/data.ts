import type { Article, UserTodo } from "./types";

export const GNB = [
  { label: "캐릿 소개", href: "/about" },
  { label: "요즘어 사전", href: null },
  { label: "뉴스클리핑", href: null },
  { label: "이슈 캘린더", href: null },
  { label: "마이크로 트렌드 전광판", href: null },
] as const;

export const MENU_ITEMS = [
  { id: "membership", label: "멤버십 관리", href: null },
  { id: "coupon", label: "쿠폰 등록", href: null },
  { id: "points", label: "포인트 받기", href: null },
  { id: "read", label: "읽은 콘텐츠", href: "/me?tab=read" },
  { id: "saved", label: "저장한 콘텐츠", href: "/me?tab=saved" },
  { id: "todos", label: "나의 투두", href: "/me" },
  { id: "notes", label: "밑줄 노트", href: "/me?tab=notes" },
  { id: "edit", label: "내 정보 수정", href: "/me/edit" },
] as const;

export const CATEGORIES = ["트렌드", "라이프스타일", "소비트렌드", "업무문화트렌드", "커리어트렌드"] as const;

export const CRITERIA = [
  "① 행동 특정 가능성 — 콘텐츠에서 구체적 행동이 도출되는가",
  "② 즉시 착수 가능성 — 개인 차원에서 1주 내 시작 가능한가",
  "③ 재사용성 — 유사 상황에서도 반복 적용 가능한가",
] as const;

export const ARTICLES: Article[] = [
  {
    id: "chaekeup",
    category: "라이프스타일",
    title: "과몰입의 시대는 끝났다, '책없쾌' 라이프스타일의 부상",
    titleBreak: "과몰입의 시대는 끝났다,\n'책없쾌' 라이프스타일의 부상",
    dek: "쾌락은 필요하지만 정신적, 경제적, 시간적 부담은 느끼긴 싫어요",
    date: "2025.08.20",
    author: "캐릿 에디터팀",
    label: "유행중",
    cardTone: "pink",
    cardEyebrow: "책없쾌",
    cardLine: "부담 없이 즐기기",
    heroQuote: "쾌락은 필요하지만 정신적, 경제적, 시간적 부담을 느끼긴 싫어요.",
    lead: "책임감 없이 즐기는 쾌락, 이게 가능할까? 요즘 Z세대는 ‘제대로 몰입해야 한다’는 압박 대신, 가볍게 맛보고 흘려보내는 즐거움을 택하고 있습니다.",
    sections: [
      {
        id: "s1",
        heading: "1. 휴대폰 못 쓰게 하는 거 꼰대 문화 아니었어요? — 의도적 단절의 시작",
        body: "카페에서 폰을 치우고, 오프라인에서만 놀 수 있는 공간이 늘고 있습니다. ‘연결되지 않을 권리’가 라이프스타일 콘텐츠로 소비되면서, 단절은 더 이상 금지의 언어가 아니라 취향의 언어가 됐습니다.",
      },
      {
        id: "s2",
        heading: "2. 과몰입 대신 가벼움 — 새로운 라이프스타일 책없쾌의 정의",
        body: "책없쾌는 ‘책임 없는 쾌락’의 줄임입니다. 돈·시간·감정을 많이 쓰지 않고도 기분 전환이 되는 경험을 찾아요. 과몰입 팬덤, 긴 시리즈, 비싼 취미 대신 짧고 가벼운 즐거움이 우선입니다.",
      },
      {
        id: "s3",
        heading: "3. 책없쾌를 실천하는 MZ세대의 쾌락 소비 방식",
        body: "한 입 디저트, 짧은 팝업, 인증샷 한 장으로 끝나는 체험이 늘어납니다. 브랜드는 ‘오래 사랑받는 팬’보다 ‘지금 이 순간에 꽂히는 사람’을 위한 진입 장벽을 낮추는 쪽이 유효합니다.",
      },
    ],
    todos: [
      { id: "ck-1", text: "우리 브랜드 SNS에 '폰프리 챌린지' 콘텐츠 1건 기획하기" },
      { id: "ck-2", text: "오프라인 매장에 냉담 인증샷 포인트 1개 기획하기" },
      { id: "ck-3", text: "트렌드 키워드 3개 수집하기" },
    ],
    published: true,
  },
  {
    id: "danggim",
    category: "소비트렌드",
    title: "이유 없이 그냥 산다, '땡김소비'가 뜬다",
    titleBreak: "이유 없이 그냥 산다,\n'땡김소비'가 뜬다",
    dek: "이유 없이 그냥 산다? 요즘 뜨는 새 소비 심리 '땡김소비'를 파헤칩니다",
    date: "2026.08.31",
    author: "캐릿 에디터팀",
    label: "유행중",
    cardTone: "pink",
    cardEyebrow: "땡김소비",
    cardLine: "그냥 삽니다",
    cover: "/card-danggim.png",
    heroQuote: "설명은 나중에. 지금은 그냥 사고 싶어요.",
    lead: "계획 없이 사는 게, 이젠 부끄럽지 않다? 요즘 소비는 ‘왜 사야 하는지’보다 ‘왜 지금 끌리는지’가 먼저입니다.",
    sections: [
      {
        id: "s1",
        heading: "1. 요즘 다들 이유 없이 지르는 거, 알고 보니 이름이 있었다",
        body: "장바구니에 담아두고 비교하던 습관이 줄었습니다. 피드에서 본 순간, 할인 없이도 ‘땡겨서’ 결제하는 패턴이 반복되고 있어요. 충동이 아니라 새로운 소비 문법으로 불리기 시작했습니다.",
      },
      {
        id: "s2",
        heading: "2. '땡김소비' — 계획 없는 소비를 부끄러워하지 않는 새 소비 문화",
        body: "가성비 해명, 후기 탐색, 비교 차트는 오히려 피로합니다. ‘지금 기분’을 구매 이유로 인정하는 태도가 확산되면서, 브랜드는 논리보다 순간의 매력을 설계해야 합니다.",
      },
      {
        id: "s3",
        heading: "3. 브랜드는 지금 '땡김소비'를 어떻게 공략해야 할까",
        body: "구매 장벽을 낮추고, 인증샷이 되는 한 장면을 만들며, 카피 앵글을 ‘왜 사야 하나’에서 ‘왜 지금 끌리는지’로 바꾸는 실험이 유효합니다.",
      },
    ],
    todos: [
      { id: "dg-1", text: "다음 콘텐츠 카피 한 줄, \"왜 사야 하나\" 대신 \"왜 지금 끌리는지\"를 카피 앵글로 잡아 기획해보기" },
      { id: "dg-2", text: "인증샷 포인트 1가지를 이번 주 내로 시도해보기" },
      { id: "dg-3", text: "SNS 콘텐츠 1개 제작 후 업로드하기" },
    ],
    published: true,
  },
  {
    id: "volatile",
    category: "업무문화트렌드",
    title: "남기지 않아야 진짜다, '휘발성 보고'가 뜬다",
    titleBreak: "남기지 않아야 진짜다,\n'휘발성 보고'가 뜬다",
    dek: "말하고 흘려보내기. 완벽한 문서 대신 가벼운 음성으로 소통하는 방식",
    date: "2026.09.01",
    author: "캐릿 에디터팀",
    label: "유행중",
    cardTone: "amber",
    cardEyebrow: "휘발성 보고",
    cardLine: "말하고 흘려보내기",
    cover: "/card-career.png",
    heroQuote: "정리해서 보내려니 부담스러워서, 그냥 음성 메시지로 편하게 말해요.",
    lead: "완벽한 보고서, 이제 부담스럽다. 저장되지 않거나 다시 찾기 번거로운 음성 메모·짧은 보이스톡으로 업무를 공유하는 사람들이 늘고 있습니다.",
    sections: [
      {
        id: "s1",
        heading: "1. 기록하지 않는 보고가 왜 더 편할까",
        body: "문서로 남기는 순간 ‘완성도’를 요구받습니다. 음성은 휘발되기 때문에 오히려 솔직하고 빠릅니다. 완벽한 문장보다 지금 상태를 공유하는 쪽이 팀 속도를 올려 줍니다.",
      },
      {
        id: "s2",
        heading: "2. '휘발성 보고' — 완벽한 문서 대신 가벼운 음성으로 소통하는 방식",
        body: "슬랙 허들, 보이스톡, 사라지는 메모. 기록이 남지 않는 채널이 일상의 보고 창구가 됐습니다. ‘나중에 찾아볼 문서’가 아니라 ‘지금 맞추는 대화’가 우선입니다.",
      },
      {
        id: "s3",
        heading: "3. 팀은 '휘발성 보고'를 어떻게 받아들여야 할까",
        body: "모든 것을 문서로 남기지 않되, 결정과 액션만 한 줄로 고정하는 하이브리드가 현실적입니다. 보고의 무게를 줄이면 실행의 빈도가 올라갑니다.",
      },
    ],
    todos: [
      { id: "vo-1", text: "휘발성 마케팅 보고서 작성하기" },
      { id: "vo-2", text: "팀 미팅에서 업무 자율성 관련 아젠다 제안해보기" },
      { id: "vo-3", text: "이번 주 내로 상사와 1:1 미팅 일정 잡기" },
    ],
    published: true,
  },
  {
    id: "career",
    category: "커리어트렌드",
    title: "벌리지 않고 줄인다, '커리어 다이어트'가 뜬다",
    titleBreak: "벌리지 않고 줄인다,\n'커리어 다이어트'가 뜬다",
    dek: "n잡 대신 하나만 제대로. 커리어의 폭을 줄이고 깊이를 택하는 태도",
    date: "2026.09.01",
    author: "캐릿 에디터팀",
    label: "유행예감",
    cardTone: "green",
    cardEyebrow: "커리어 다이어트",
    cardLine: "줄여서 채우기",
    cover: "/card-volatile.png",
    heroQuote: "할 수 있는 일을 늘리기보다, 잘하고 싶은 일만 남기고 싶어요.",
    lead: "사이드 프로젝트, n잡, 병행 학습. 넓히기 경쟁이 피로해지자 ‘하나만 제대로’를 택하는 사람들이 늘고 있습니다. 이 아티클에는 실행 투두가 없습니다.",
    sections: [
      {
        id: "s1",
        heading: "1. n잡 대신 '하나만 제대로'를 택하는 사람들",
        body: "포트폴리오를 늘리는 대신, 대표 커리어 한 줄의 밀도를 높이는 선택이 눈에 띕니다. 줄이는 것이 포기가 아니라 전략이 되는 시점입니다.",
      },
      {
        id: "s2",
        heading: "2. '커리어 다이어트' — 커리어의 폭을 줄이고 깊이를 택하는 태도",
        body: "스킬 나열이 아니라 한 분야의 해석력, 한 직무의 실행력이 이력의 중심이 됩니다. 다이어트는 결핍이 아니라 선명함입니다.",
      },
      {
        id: "s3",
        heading: "3. 조직은 이 변화를 어떻게 받아들여야 할까",
        body: "멀티태스킹을 미덕으로 보던 평가 기준을 재검토할 때입니다. 깊이 있는 한 사람을 키우는 쪽이, 넓게 분산된 여러 역할보다 성과가 선명할 수 있습니다.",
      },
    ],
    todos: [],
    published: true,
  },
];

export const SEED_TODOS: UserTodo[] = [
  {
    id: "seed-1",
    text: "우리 브랜드 SNS에 '폰프리 챌린지' 콘텐츠 1건 기획하기",
    sourceArticleId: "chaekeup",
    sourceTitle: "요즘 립스터들이 '폰 프리' 한 이유",
    addedAt: new Date("2026-07-01T10:00:00").getTime(),
    done: true,
  },
  {
    id: "seed-2",
    text: "오프라인 매장에 냉담 인증샷 포인트 1개 기획하기",
    sourceArticleId: "chaekeup",
    sourceTitle: "어른용 키즈카페, '피지컬 제한' 공간이 뜬다",
    addedAt: new Date("2026-06-25T10:00:00").getTime(),
    done: true,
  },
  {
    id: "seed-3",
    text: "경쟁사 '피지컬 타임' 마케팅 사례 3개 스크랩하기",
    sourceArticleId: "chaekeup",
    sourceTitle: "요즘 벤치마킹 트렌드",
    addedAt: new Date("2026-07-28T10:00:00").getTime(),
    done: false,
  },
  {
    id: "seed-4",
    text: "휘발성 마케팅 보고서 작성하기",
    sourceArticleId: "volatile",
    sourceTitle: "남기지 않아야 진짜다, 휘발성 보고가 뜬다",
    addedAt: new Date("2026-08-31T10:00:00").getTime(),
    done: false,
  },
  {
    id: "seed-5",
    text: "다음 콘텐츠 카피 한 줄, \"왜 사야 하나\" 대신 \"왜 지금 끌리는지\"를 카피 앵글로 잡아 기획해보기",
    sourceArticleId: "danggim",
    sourceTitle: "이유없이 그냥 산다. '땡김소비'가 뜬다",
    addedAt: new Date("2026-08-31T12:00:00").getTime(),
    done: false,
  },
];

export const HOME_CARD_IDS = ["danggim", "volatile", "career"] as const;
