import type { Article, UserTodo } from "./types";

export const GNB = [
  { label: "캐릿 소개", href: "/about" },
  { label: "요즘어 사전", href: "/dictionary" },
  { label: "뉴스클리핑", href: "/clipping" },
  { label: "이슈 캘린더", href: "/calendar" },
  { label: "마이크로 트렌드 전광판", href: "/billboard" },
] as const;

export const MENU_ITEMS = [
  { id: "membership", label: "멤버십 관리", href: "/membership" },
  { id: "coupon", label: "쿠폰 등록", href: "/coupons" },
  { id: "points", label: "포인트 받기", href: "/points" },
  { id: "read", label: "읽은 콘텐츠", href: "/me?tab=read" },
  { id: "saved", label: "저장한 콘텐츠", href: "/me?tab=saved" },
  { id: "todos", label: "나의 투두", href: "/me" },
  { id: "notes", label: "밑줄 노트", href: "/me?tab=notes" },
  { id: "edit", label: "내 정보 수정", href: "/me/edit" },
] as const;

export const EDITOR_EMAIL = "editor@careet.com";
export const EDITOR_PASSWORD = "editor";

export function isEditorEmail(email: string) {
  return email.trim().toLowerCase() === EDITOR_EMAIL;
}

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
    id: "truefan",
    category: "트렌드",
    title: "요즘 브랜드들이 '찐팬'을 관리하는 방식 4가지",
    titleBreak: "요즘 브랜드들이 '찐팬'을\n관리하는 방식 4가지",
    dek: "요즘 브랜드들이 '찐팬'을 관리하는 방식 4가지",
    date: "2026.09.08",
    author: "캐릿 에디터팀",
    label: "유행중",
    cardTone: "lime",
    cardEyebrow: "찐팬 관리",
    cardLine: "트렌드",
    cover: "/figma/home-thumb-c.png",
    heroQuote: "",
    lead: "",
    sections: [],
    bodyImages: [
      "/figma/truefan-s1.png",
      "/figma/truefan-s2.png",
      "/figma/truefan-s3.png",
      "/figma/truefan-s4.png",
      "/figma/truefan-s5.png",
    ],
    todos: [
      {
        id: "tf-1",
        text: "최근 게시물 중 댓글·저장 유독 높았던 게시물 3개 뽑아보기: 인사이트 확인해서 고관여 팔로워 반응 패턴 찾아 정리",
      },
      {
        id: "tf-2",
        text: "오픈채팅방 개설 조건부 초대 방식 실행 가능한지 검토: 댓글 단 사람 DM으로 초대하는 플로우, 우리 계정 규모로 가능한지 체크",
      },
      {
        id: "tf-3",
        text: "국내 Z세대 인플루언서 신뢰도, 자체 설문 문항 1개 만들기: \"브랜드 광고 vs 인플루언서 게시물 중 뭘 더 믿나요\" 초안",
      },
      {
        id: "tf-4",
        text: "현재 준비 중인 프로모션에 '한정 조건' 하나 추가해보기: 시간·장소·수량 중 하나 제약 걸어서 문구 초안 작성",
      },
    ],
    published: true,
  },
  {
    id: "asean",
    category: "소비트렌드",
    title: "다음 10년의 기회는 동남아시아에 있다.",
    titleBreak: "다음 10년의 기회는\n동남아시아에 있다.",
    dek: "다음 10년의 기회는 동남아시아에 있다.",
    date: "2026.09.08",
    author: "캐릿 에디터팀",
    label: "유행중",
    cardTone: "pink",
    cardEyebrow: "동남아시아",
    cardLine: "소비자 트렌드",
    cover: "/figma/home-thumb-a.png",
    heroQuote: "",
    lead: "",
    sections: [],
    bodyImages: ["/figma/asean-body.png"],
    todos: [
      {
        id: "as-1",
        text: "진출 희망국 뜨는 캐릭터 IP 콜라보 사례 검색: 라부부·크라이베이비 등 표에 나온 IP로 국내 유사 브랜드 협업 사례 있는지 확인",
      },
      {
        id: "as-2",
        text: "타겟국 주요 기념일 캘린더에 표시하고 콘텐츠 기획: 인니는 라마단, 태국은 송크란 등 국가별 기념일에 맞춘 프로모션 아이디어 1개",
      },
      {
        id: "as-3",
        text: "타겟국 주요 커머스앱 입점조건 검색: 쇼피·라자다 등 표에 나온 플랫폼별 브랜드 입점 절차·수수료 확인",
      },
      {
        id: "as-4",
        text: "표의 마케팅 방식 중 1개 골라 실행 가능성 검토: 라이브 커머스·팝업스토어 등 국가별 특화 방식이 우리 리소스로 가능한지 체크",
      },
    ],
    published: true,
  },
  {
    id: "ghost",
    category: "트렌드",
    title: "전 세계 알고리즘을 흔드는 콘셉트, '괴담'",
    titleBreak: "전 세계 알고리즘을 흔드는\n콘셉트, '괴담'",
    dek: "전 세계 알고리즘을 흔드는 콘셉트, '괴담'",
    date: "2026.09.08",
    author: "캐릿 에디터팀",
    label: "유행중",
    cardTone: "green",
    cardEyebrow: "괴담 트렌드",
    cardLine: "요즘 대세",
    cover: "/figma/home-thumb-b.png",
    heroQuote: "",
    lead: "",
    sections: [],
    bodyImages: ["/figma/ghost-body.png"],
    todos: [
      {
        id: "gh-1",
        text: "백룸처럼 브랜드 매장을 괴담 컨셉으로 패러디할 여지 검토: 이케아·맥도날드처럼 우리 매장 공간을 활용한 괴담풍 콘텐츠 아이디어 스케치",
      },
      {
        id: "gh-2",
        text: "'나폴리탄 괴담' 관련 콘텐츠 유튜브·SNS 검색해 소재 파악: 최근 활용 마케팅 사례 있는지 확인 후 우리 브랜드 적용 가능성 메모",
      },
      {
        id: "gh-3",
        text: "오프라인 괴담 체험(테크노마트 사례) 유사 공간 우리 지역서 있는지 찾기: 팝업·매장 연계 이벤트 소재로 쓸 로컬 명소 리스트업",
      },
      {
        id: "gh-4",
        text: "AI 생성 괴담 콘텐츠 포맷이 우리 계정에 맞을지 분석: 인스타 릴스 조회수 잘 나오는 AI 괴담 포맷 3개 찾아 톤 비교",
      },
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
        visual: { tone: "pink", kicker: "땡김소비", title: "그냥 삽니다" },
        caption: "설명보다 감각이 먼저인 결제 장면",
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
        visuals: [
          { tone: "pink", kicker: "카피 앵글", title: "왜 지금 끌리는지" },
          { tone: "lime", kicker: "한 장면", title: "3초 결제 이유" },
        ],
      },
    ],
    todos: [
      { id: "dg-1", text: "다음 콘텐츠 카피 한 줄을 \"왜 사야 하나\" 대신 \"왜 지금 끌리는지\" 앵글로 바꿔 기획해보기" },
      { id: "dg-2", text: "3초 안에 결제 이유가 보이는 장면 1개를 이번 주 캠페인에 넣기" },
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
    cover: "/card-volatile.png",
    heroQuote: "정리해서 보내려니 부담스러워서, 그냥 음성 메시지로 편하게 말해요.",
    lead: "완벽한 보고서, 이제 부담스럽다. 저장되지 않거나 다시 찾기 번거로운 음성 메모·짧은 보이스톡으로 업무를 공유하는 사람들이 늘고 있습니다.",
    sections: [
      {
        id: "s1",
        heading: "1. 기록하지 않는 보고가 왜 더 편할까",
        body: "문서로 남기는 순간 ‘완성도’를 요구받습니다. 음성은 휘발되기 때문에 오히려 솔직하고 빠릅니다. 완벽한 문장보다 지금 상태를 공유하는 쪽이 팀 속도를 올려 줍니다.",
        visual: { tone: "amber", kicker: "휘발성 보고", title: "말하고 흘려보내기" },
        caption: "남기지 않는 보고가 일상을 바꾸는 장면",
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
      { id: "vo-1", text: "이번 주 보고 1건을 문서 대신 3분 음성으로 먼저 공유해보기" },
      { id: "vo-2", text: "결정·액션만 슬랙에 한 줄로 남기는 템플릿을 팀 채널에 붙여보기" },
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
    cover: "/card-career.png",
    heroQuote: "할 수 있는 일을 늘리기보다, 잘하고 싶은 일만 남기고 싶어요.",
    lead: "사이드 프로젝트, n잡, 병행 학습. 넓히기 경쟁이 피로해지자 ‘하나만 제대로’를 택하는 사람들이 늘고 있습니다. 이 아티클에는 실행 투두가 없습니다.",
    sections: [
      {
        id: "s1",
        heading: "1. n잡 대신 '하나만 제대로'를 택하는 사람들",
        body: "포트폴리오를 늘리는 대신, 대표 커리어 한 줄의 밀도를 높이는 선택이 눈에 띕니다. 줄이는 것이 포기가 아니라 전략이 되는 시점입니다.",
        visual: { tone: "green", kicker: "커리어 다이어트", title: "줄여서 채우기" },
        caption: "넓히기 대신 줄여서 채우는 커리어",
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

export const HOME_CARD_IDS = ["asean", "truefan", "ghost"] as const;
export const HOME_HIDDEN_IDS = ["chaekeup", "career", "danggim", "volatile"] as const;

export const DICTIONARY = [
  {
    term: "책없쾌",
    reading: "책임 없는 쾌락",
    cat: "라이프스타일",
    def: "돈·시간·감정을 많이 쓰지 않고도 기분 전환이 되는 가벼운 즐거움. 과몰입 대신 짧게 맛보고 흘려보내는 취향.",
    articleId: "chaekeup",
  },
  {
    term: "찐팬",
    reading: "진짜 팬",
    cat: "트렌드",
    def: "팔로워 수가 아니라 저장·공유·반복 댓글로 남는 고관여 독자. 규모보다 반응의 밀도를 본다.",
    articleId: "truefan",
  },
  {
    term: "땡김소비",
    reading: "이유 없이 그냥 산다",
    cat: "소비트렌드",
    def: "효용·가성비 설명이 없어도 ‘지금 땡겨서’ 결제하는 소비. 충동이 아니라 감각을 정당화하는 새로운 구매 언어.",
    articleId: "danggim",
  },
  {
    term: "휘발성 보고",
    reading: "남기지 않는 보고",
    cat: "업무문화트렌드",
    def: "완성된 문서 대신 음성·짧은 말로 상태를 공유하고, 결정만 한 줄로 남기는 업무 습관.",
    articleId: "volatile",
  },
  {
    term: "커리어 다이어트",
    reading: "경력의 군살 빼기",
    cat: "커리어트렌드",
    def: "스펙을 더 쌓기보다 불필요한 업무·타이틀을 걷어내 핵심 역량만 남기는 커리어 전략.",
    articleId: "career",
  },
  {
    term: "폰프리",
    reading: "의도적 단절",
    cat: "라이프스타일",
    def: "카페·팝업에서 휴대폰을 치우고 오프라인만 허용하는 경험. 연결되지 않을 권리가 취향이 된 말.",
    articleId: "chaekeup",
  },
  {
    term: "마이크로 트렌드",
    reading: "아주 짧은 유행",
    cat: "트렌드",
    def: "전국구 메가 트렌드가 아니라 특정 커뮤니티에서 2~6주 반짝하는 신호. 전광판에서 순위를 본다.",
    articleId: "danggim",
  },
] as const;

export const CLIPPINGS = [
  {
    date: "2026.09.07",
    source: "캐릿 에디터",
    title: "팔로워 그래프가 올라도 팬이 안 보이는 이유",
    summary: "저장·공유·반복 댓글이 겹치는 계정이 찐팬이다. 규모보다 반응 밀도를 먼저 재는 브랜드가 늘고 있습니다.",
    articleId: "truefan",
  },
  {
    date: "2026.09.04",
    source: "캐릿 에디터",
    title: "이유 없이 결제하는 세대, 브랜드 카피가 바뀐다",
    summary: "가성비 대신 ‘땡김’을 말하는 캠페인이 늘고 있습니다. 설득하지 말고 감각을 허가하라는 메시지.",
    articleId: "danggim",
  },
  {
    date: "2026.09.02",
    source: "라이프 데스크",
    title: "과몰입 대신 책없쾌 — 짧은 즐거움이 매장 동선을 바꿨다",
    summary: "한 입 디저트, 10분 팝업, 인증샷 한 장. 체류 시간보다 진입 장벽을 낮추는 오프라인 실험.",
    articleId: "chaekeup",
  },
  {
    date: "2026.08.29",
    source: "컬처 브리프",
    title: "기록하지 않는 보고가 팀 속도를 바꾼다",
    summary: "완벽한 문서 대신 3분 음성. 휘발성 보고는 완성도 압박을 낮추고 실행 빈도를 올립니다.",
    articleId: "volatile",
  },
  {
    date: "2026.08.22",
    source: "커리어 리포트",
    title: "이력서에서 빼는 것이 경력이다",
    summary: "사이드 프로젝트 나열 대신 한 줄 성과. 커리어 다이어트가 채용 시장 언어로 번지고 있습니다.",
    articleId: "career",
  },
] as const;

export const CALENDAR = [
  {
    date: "2026.09.08",
    tag: "이슈",
    title: "서울 스트리트 캐치 — 늦여름 레이어드",
    body: "광장·성수 일대에서 비닐·메시 레이어드가 다시 보입니다. 숏폼보다 매장 윈도우에 먼저 반영할 타이밍.",
  },
  {
    date: "2026.09.12",
    tag: "팝업",
    title: "폰프리 카페 팝업 3곳 오픈",
    body: "입장 시 폰 파우치. 책없쾌 키워드와 묶인 브랜드 협업 공간이니 현장 스케치 투두를 미리 담아 두세요.",
  },
  {
    date: "2026.09.18",
    tag: "소비",
    title: "페이 앱 ‘땡김’ 캠페인 송출",
    body: "충동구매 비난 대신 허가를 주는 카피 테스트. 자사 프로모션 카피 벤치마크 일정.",
  },
  {
    date: "2026.09.24",
    tag: "커리어",
    title: "하반기 채용 시즌 · 포트폴리오 다이어트",
    body: "10페이지 이력서 대신 한 페이지. 팀 내부 이력 템플릿을 줄이는 워크숍 추천일.",
  },
  {
    date: "2026.10.02",
    tag: "콘텐츠",
    title: "마이크로 트렌드 전광판 월간 리셋",
    body: "9월 키워드 아카이브 후 10월 시드 키워드 교체. 에디터 마감은 전날 18시.",
  },
] as const;

export const BILLBOARD = [
  { rank: 1, word: "찐팬", delta: "+21", heat: 98, articleId: "truefan" },
  { rank: 2, word: "땡김소비", delta: "+18", heat: 96, articleId: "danggim" },
  { rank: 3, word: "책없쾌", delta: "+9", heat: 88, articleId: "chaekeup" },
  { rank: 4, word: "폰프리", delta: "+7", heat: 74, articleId: "chaekeup" },
  { rank: 5, word: "휘발성 보고", delta: "+6", heat: 61, articleId: "volatile" },
  { rank: 6, word: "커리어 다이어트", delta: "-2", heat: 48, articleId: "career" },
] as const;

export const COUPON_CATALOG = [
  { code: "CAREET10", title: "웰컴 쿠폰 · 멤버십 할인 코드", perk: "perk" as const },
  { code: "TREND2026", title: "트렌드 레터 보너스 500P", perk: "points" as const, points: 500 },
  { code: "PLUS30", title: "캐릿 플러스 체험 등록", perk: "plus" as const },
];
