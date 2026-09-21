"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { IconCheck, IconClose, IconDots, IconEdit, IconFolderMini, IconGrip, IconHelp, IconMemo, IconPin } from "./icons";
import { formatDotDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { UserTodo, ZipFolder } from "@/lib/types";
import { DONE_ID, FOLDER_SUGGESTIONS, UNSORTED_ID, folderTitle, tipsIn } from "@/lib/zip";

const ONBOARD = [
  {
    spot: "done",
    title: "완료된 TIP이 모이는 곳",
    body: "완료한 TIP은 이 폴더에 자동으로 모여요. 맨 위에 고정되어 있어 확인에 편해요!",
  },
  {
    spot: "unsorted",
    title: "아직 분류 안 된 TIP",
    body: "아티클에서 바로 담은 TIP은 여기부터 시작돼요. 원하는 폴더로 옮겨보세요.",
  },
  {
    spot: "check",
    title: "완료하면\n자동으로 변해요",
    body: "체크하면 완료 폴더로 자동 이동해요.\n다시 누르면 원래 있던 폴더로 돌아가요.",
  },
  {
    spot: "add",
    title: "폴더를 추가할 수 있어요",
    body: "폴더를 추가해서 일잘 TIP을 입맛대로 정리 해보세요",
  },
  {
    spot: "drag",
    title: "드래그해서 폴더 순서를 바꿀 수 있어요",
    body: "손잡이를 잡고 폴더를 순서를 바꾸고, ⋯ 메뉴로 TIP을 다른 폴더로 옮기거나 메모를 남길 수 있어요.",
  },
] as const;

const TOUR_DEMO_TIP: UserTodo = {
  id: "tour-demo-tip",
  text: "오프라인 매장에 냉담 인증샷 포인트 1개 기획하기",
  done: false,
  addedAt: 0,
  sourceTitle: "어른용 키즈카페, '피지컬 재현' 공간이 뜬다",
  folderId: UNSORTED_ID,
  memo: "",
};

export function TipZip() {
  const {
    todos,
    prefs,
    toggleTodo,
    deleteTodo,
    setTipMemo,
    moveTip,
    addZipFolder,
    renameZipFolder,
    deleteZipFolder,
    toggleZipFolder,
    reorderZipFolders,
    setOnboardingDone,
  } = useStore();
  const folders = prefs.zip.folders;
  const [tour, setTour] = useState<number | null>(prefs.zip.onboardingDone ? null : 0);
  const [composer, setComposer] = useState(false);
  const [name, setName] = useState("");
  const [flash, setFlash] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const allEmpty = todos.length === 0;
  const customIds = folders.map((f) => f.id);
  const touring = tour !== null;
  const showTourCheck = touring && tipsIn(todos, UNSORTED_ID).length === 0;
  const showTourFolder = touring && customIds.length === 0;

  const pulse = (id: string) => {
    setFlash(id);
    window.setTimeout(() => setFlash(null), 700);
  };

  const submitFolder = (raw: string) => {
    const res = addZipFolder(raw);
    if (!res.id) return;
    setComposer(false);
    setName("");
    pulse(res.id);
    if (!res.created) {
      // existing folder highlighted
    }
  };

  return (
    <div className="zip-board">
      <div className="zip-title-row" data-zip-spot="title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="zip-tab-img" src="/zip-folder-tab.png" width={168} height={82} alt="일잘 TIP .ZIP" />
        <h2>일잘 TIP .ZIP</h2>
      </div>

      {allEmpty && !touring ? (
        <div className="zip-empty">
          <p>아직 담은 일잘TIP이 없어요 🥲 캐릿이 추천해주는 업무 적용 꿀팁을 담아보세요</p>
          <Link href="/">트렌드 꿀팁 보러 가기</Link>
        </div>
      ) : null}

      <div className="zip-folders">
          <ZipFolderCard
            id={DONE_ID}
            title={folderTitle(DONE_ID, folders)}
            todos={tipsIn(todos, DONE_ID)}
            folders={folders}
            fixed
            flash={flash === DONE_ID}
            spot="done"
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            onToggleTip={toggleTodo}
            onMemo={setTipMemo}
            onMove={moveTip}
            onDeleteTip={deleteTodo}
          />
          <ZipFolderCard
            id={UNSORTED_ID}
            title={folderTitle(UNSORTED_ID, folders)}
            todos={showTourCheck ? [TOUR_DEMO_TIP] : tipsIn(todos, UNSORTED_ID)}
            folders={folders}
            fixed
            flash={flash === UNSORTED_ID}
            spot="unsorted"
            checkSpot
            preview={showTourCheck}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            onToggleTip={toggleTodo}
            onMemo={setTipMemo}
            onMove={moveTip}
            onDeleteTip={deleteTodo}
            onDropTip={(tipId) => moveTip(tipId, UNSORTED_ID)}
          />
          {folders.map((f, i) => (
            <ZipFolderCard
              key={f.id}
              id={f.id}
              title={f.name}
              todos={tipsIn(todos, f.id)}
              folders={folders}
              collapsed={f.collapsed}
              flash={flash === f.id}
              spot={i === 0 ? "drag" : undefined}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              onToggle={() => toggleZipFolder(f.id)}
              onRename={(next) => {
                const res = renameZipFolder(f.id, next);
                pulse(res.id);
              }}
              onDelete={() => deleteZipFolder(f.id)}
              onToggleTip={toggleTodo}
              onMemo={setTipMemo}
              onMove={moveTip}
              onDeleteTip={deleteTodo}
              onDropFolder={(fromId) => reorderZipFolders(fromId, f.id)}
              onDropTip={(tipId) => moveTip(tipId, f.id)}
            />
          ))}
          {showTourFolder ? (
            <ZipFolderCard
              id="tour-demo-folder"
              title="월별 프로모션"
              todos={[]}
              folders={folders}
              spot="drag"
              preview
              openMenu={null}
              setOpenMenu={() => undefined}
              onToggleTip={() => undefined}
              onMemo={() => undefined}
              onMove={() => undefined}
              onDeleteTip={() => undefined}
            />
          ) : null}
        </div>

      <AddFolder
        open={composer}
        name={name}
        folders={folders}
        onOpen={() => setComposer(true)}
        onName={setName}
        onCancel={() => {
          setComposer(false);
          setName("");
        }}
        onSubmit={submitFolder}
      />

      <button
        className="zip-help-fab"
        type="button"
        aria-label="온보딩 다시 보기"
        data-zip-spot="help"
        onClick={() => {
          setComposer(false);
          setName("");
          setOnboardingDone(false);
          setTour(0);
        }}
      >
        <IconHelp />
      </button>

      {tour !== null ? (
          <Onboarding
          step={tour}
          hasCustom={customIds.length > 0 || showTourFolder}
          onNext={() => {
            if (tour >= ONBOARD.length - 1) {
              setOnboardingDone(true);
              setTour(null);
              return;
            }
            setTour(tour + 1);
          }}
          onSkip={() => {
            setOnboardingDone(true);
            setTour(null);
          }}
        />
      ) : null}
    </div>
  );
}

function AddFolder({
  open,
  name,
  folders,
  onOpen,
  onName,
  onCancel,
  onSubmit,
}: {
  open: boolean;
  name: string;
  folders: ZipFolder[];
  onOpen: () => void;
  onName: (v: string) => void;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}) {
  const q = name.trim().toLowerCase();
  const filtered = FOLDER_SUGGESTIONS.filter((s) => !q || s.toLowerCase().includes(q));
  const exactFolder = folders.find((f) => f.name.trim().toLowerCase() === q);
  const showCreate = q.length > 0 && !exactFolder && !FOLDER_SUGGESTIONS.some((s) => s.toLowerCase() === q);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) {
    return (
      <button className="zip-add" type="button" data-zip-spot="add" onClick={onOpen}>
        + 새 폴더 추가
      </button>
    );
  }

  return (
    <div className="zip-composer" data-zip-spot="add">
      <input
        autoFocus
        value={name}
        placeholder="폴더 이름을 입력하세요"
        onChange={(e) => onName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit(name);
        }}
      />
      <div className="zip-suggest">
        <button type="button" className="direct" onClick={() => name.trim() && onSubmit(name)}>
          직접 입력하기
        </button>
        {filtered.map((s) => (
          <button key={s} type="button" onClick={() => onSubmit(s)}>
            <span>추천</span>
            {s}
          </button>
        ))}
        {showCreate ? (
          <button type="button" onClick={() => onSubmit(name)}>
            + “{name.trim()}” 폴더 만들기
          </button>
        ) : null}
      </div>
      <div className="zip-composer-actions">
        <button className="btn ghost" type="button" onClick={onCancel}>
          취소
        </button>
        <button className="btn primary" type="button" onClick={() => onSubmit(name)}>
          추가
        </button>
      </div>
    </div>
  );
}

function ZipFolderCard({
  id,
  title,
  todos,
  folders,
  fixed,
  collapsed,
  flash,
  spot,
  checkSpot,
  preview,
  openMenu,
  setOpenMenu,
  onToggle,
  onRename,
  onDelete,
  onToggleTip,
  onMemo,
  onMove,
  onDeleteTip,
  onDropFolder,
  onDropTip,
}: {
  id: string;
  title: string;
  todos: UserTodo[];
  folders: ZipFolder[];
  fixed?: boolean;
  collapsed?: boolean;
  flash?: boolean;
  spot?: string;
  checkSpot?: boolean;
  preview?: boolean;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  onToggle?: () => void;
  onRename?: (name: string) => void;
  onDelete?: () => void;
  onToggleTip: (id: string) => void;
  onMemo: (id: string, memo: string) => void;
  onMove: (id: string, folderId: string) => void;
  onDeleteTip: (id: string) => void;
  onDropFolder?: (fromId: string) => void;
  onDropTip?: (tipId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const shut = Boolean(collapsed) && !fixed;

  return (
    <section
      className={`zip-folder${fixed ? " fixed" : ""}${shut ? " collapsed" : ""}${flash ? " section-flash" : ""}${preview ? " preview" : ""}`}
      onDragOver={(e) => {
        if (preview) return;
        if (onDropFolder || onDropTip) e.preventDefault();
      }}
      onDrop={(e) => {
        if (preview) return;
        e.preventDefault();
        const folderFrom = e.dataTransfer.getData("zip-folder");
        const tipFrom = e.dataTransfer.getData("zip-tip");
        if (folderFrom && onDropFolder) onDropFolder(folderFrom);
        if (tipFrom && onDropTip) onDropTip(tipFrom);
      }}
    >
      <header className="zip-folder-h">
        {fixed ? null : (
          <button
            className="zip-grip"
            type="button"
            aria-label="드래그 핸들"
            data-zip-spot={spot === "drag" ? "drag" : undefined}
            draggable={!preview}
            onDragStart={(e) => {
              if (preview) return;
              e.dataTransfer.setData("zip-folder", id);
              e.dataTransfer.effectAllowed = "move";
            }}
          >
            <IconGrip />
          </button>
        )}
        <div className="zip-spot" data-zip-spot={spot && spot !== "drag" ? spot : undefined}>
          {fixed ? (
            id === DONE_ID ? (
              <span className="zip-pin" aria-label="고정">
                <IconPin />
              </span>
            ) : (
              <span className="zip-pin spacer" aria-hidden />
            )
          ) : null}
          <span className="zip-folder-ico" aria-hidden>
            <IconFolderMini />
          </span>
          <button className="zip-fold-toggle" type="button" onClick={onToggle} disabled={fixed || preview}>
            <span className={`chev${shut ? "" : " open"}`}>▾</span>
            <strong>{title}</strong>
            <em>{todos.length}</em>
          </button>
        </div>
        <span className="zip-h-space" aria-hidden />
        {fixed || !onRename ? null : editing ? (
          <input
            className="zip-rename"
            value={draft}
            autoFocus
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => {
              onRename(draft);
              setEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onRename(draft);
                setEditing(false);
              }
              if (e.key === "Escape") setEditing(false);
            }}
          />
        ) : (
          <button
            className="ghost"
            type="button"
            aria-label="폴더 이름 수정"
            onClick={() => {
              setDraft(title);
              setEditing(true);
            }}
          >
            <IconEdit />
          </button>
        )}
        {fixed || !onDelete ? null : (
          <button className="ghost muted-x" type="button" aria-label="폴더 삭제" onClick={onDelete}>
            <IconClose />
          </button>
        )}
      </header>
      {shut ? null : (
        <div className="zip-tips">
          {todos.length === 0 ? (
            <div className="zip-folder-empty">{id === UNSORTED_ID ? "아직 담긴 TIP이 없어요" : "이 폴더에 담긴 TIP이 없어요"}</div>
          ) : (
            todos.map((t, i) => (
              <TipCard
                key={t.id}
                tip={t}
                folders={folders}
                currentId={id}
                checkSpot={checkSpot && i === 0}
                preview={preview}
                menuOpen={openMenu === t.id}
                onMenu={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                onCloseMenu={() => setOpenMenu(null)}
                onToggle={() => onToggleTip(t.id)}
                onMemo={(memo) => onMemo(t.id, memo)}
                onMove={(folderId) => {
                  onMove(t.id, folderId);
                  setOpenMenu(null);
                }}
                onDelete={() => onDeleteTip(t.id)}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}

function TipCard({
  tip,
  folders,
  currentId,
  checkSpot,
  preview,
  menuOpen,
  onMenu,
  onCloseMenu,
  onToggle,
  onMemo,
  onMove,
  onDelete,
}: {
  tip: UserTodo;
  folders: ZipFolder[];
  currentId: string;
  checkSpot?: boolean;
  preview?: boolean;
  menuOpen: boolean;
  onMenu: () => void;
  onCloseMenu: () => void;
  onToggle: () => void;
  onMemo: (memo: string) => void;
  onMove: (folderId: string) => void;
  onDelete: () => void;
}) {
  const [memoOpen, setMemoOpen] = useState(Boolean(tip.memo));
  const [memo, setMemo] = useState(tip.memo ?? "");
  const [popping, setPopping] = useState(false);
  const popTimer = useRef<number | null>(null);
  const targets = [
    { id: UNSORTED_ID, name: "미분류 TIP" },
    ...folders.map((f) => ({ id: f.id, name: f.name })),
  ].filter((f) => f.id !== currentId && f.id !== DONE_ID);

  useEffect(() => {
    return () => {
      if (popTimer.current) window.clearTimeout(popTimer.current);
    };
  }, []);

  const onCheck = () => {
    if (preview || popping) return;
    if (tip.done) {
      onToggle();
      return;
    }
    setPopping(true);
    popTimer.current = window.setTimeout(() => {
      onToggle();
      setPopping(false);
    }, 200);
  };

  return (
    <article className={`zip-tip${tip.done || popping ? " done" : ""}`}>
      <button
        className="zip-grip tip-grip"
        type="button"
        aria-label="TIP 드래그 핸들"
        draggable={!preview}
        onDragStart={(e) => {
          if (preview) return;
          e.dataTransfer.setData("zip-tip", tip.id);
          e.dataTransfer.effectAllowed = "move";
        }}
      >
        <IconGrip />
      </button>
      <div className="zip-check">
        <button
          className={`check round${popping ? " popping" : ""}`}
          type="button"
          aria-label="완료"
          data-zip-spot={checkSpot ? "check" : undefined}
          onClick={onCheck}
        >
          {tip.done || popping ? <IconCheck /> : null}
        </button>
        {popping ? <span className="check-pop">완료!</span> : null}
      </div>
      <div className="zip-tip-body">
        <div className="title-row">
          <div className="title">{tip.text}</div>
          <button
            className={`ghost memo-btn${tip.memo ? " has" : ""}`}
            type="button"
            aria-label="메모"
            onClick={() => setMemoOpen((v) => !v)}
          >
            <IconMemo filled={Boolean(tip.memo)} />
          </button>
          <div className="zip-more">
            <button className="ghost" type="button" aria-label="이동 메뉴" onClick={onMenu}>
              <IconDots />
            </button>
            {menuOpen ? (
              <div className="zip-menu">
                <p>다른 폴더로 이동</p>
                {targets.map((f) => (
                  <button key={f.id} type="button" onClick={() => onMove(f.id)}>
                    {f.name}
                  </button>
                ))}
                <button type="button" className="danger" onClick={onDelete}>
                  삭제
                </button>
                <button type="button" onClick={onCloseMenu}>
                  닫기
                </button>
              </div>
            ) : null}
          </div>
          <button className="ghost muted-x" type="button" aria-label="TIP 삭제" onClick={onDelete}>
            <IconClose />
          </button>
        </div>
        <div className="meta">
          {tip.sourceArticleId ? (
            <>
              원문: <Link href={`/articles/${tip.sourceArticleId}`}>{tip.sourceTitle}</Link>
            </>
          ) : (
            <>원문: {tip.sourceTitle || "직접 추가"}</>
          )}
          {" · "}
          {formatDotDate(tip.addedAt)}
          {tip.done && tip.sourceFolderName ? <span className="origin-badge">{tip.sourceFolderName}</span> : null}
        </div>
        {memoOpen ? (
          <div className="zip-memo-wrap">
            <textarea
              className="zip-memo"
              value={memo}
              placeholder="나만의 메모를 여기에 남겨요..."
              onChange={(e) => setMemo(e.target.value)}
              onBlur={() => onMemo(memo)}
            />
            <button
              className="zip-memo-save"
              type="button"
              onClick={() => onMemo(memo)}
            >
              완료
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function Onboarding({
  step,
  hasCustom,
  onNext,
  onSkip,
}: {
  step: number;
  hasCustom: boolean;
  onNext: () => void;
  onSkip: () => void;
}) {
  const item = ONBOARD[step];
  const last = step === ONBOARD.length - 1;
  const [box, setBox] = useState<DOMRect | null>(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const spot = item.spot === "drag" && !hasCustom ? "add" : item.spot;
    const measure = () => {
      setVp({ w: window.innerWidth, h: window.innerHeight });
      let nextSpot = spot;
      if (nextSpot === "check" && !document.querySelector('[data-zip-spot="check"]')) {
        nextSpot = "unsorted";
      }
      if (nextSpot === "drag" && !document.querySelector('[data-zip-spot="drag"]')) {
        nextSpot = "add";
      }
      const el = document.querySelector(`[data-zip-spot="${nextSpot}"]`) as HTMLElement | null;
      if (!el) {
        setBox(null);
        return;
      }
      setBox(el.getBoundingClientRect());
    };
    measure();
    const scrollEl = document.querySelector(
      `[data-zip-spot="${spot === "check" && !document.querySelector('[data-zip-spot="check"]') ? "unsorted" : spot}"]`,
    ) as HTMLElement | null;
    scrollEl?.scrollIntoView({ block: "center", behavior: "smooth" });
    const later = window.setTimeout(measure, 320);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.clearTimeout(later);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [item.spot, hasCustom, step]);

  const cardStyle = useMemo(() => {
    if (!box || !vp.w) return { top: "28%", left: "50%", transform: "translateX(-50%)" } as const;
    const cardW = 320;
    const cardH = 210;
    const gap = 16;
    const small = box.width < 140;
    let left = small ? box.right + gap : box.left + Math.min(box.width + gap, 184);
    let top = small ? box.top + box.height / 2 - 48 : box.top - 12;
    left = Math.min(Math.max(16, left), Math.max(16, vp.w - cardW - 16));
    top = Math.min(Math.max(88, top), Math.max(88, vp.h - cardH - 16));
    return { top, left, transform: "none" } as const;
  }, [box, vp]);

  return (
    <div className="zip-onboard">
      <svg className="zip-mask" aria-hidden width={vp.w} height={vp.h} viewBox={`0 0 ${vp.w} ${vp.h}`} preserveAspectRatio="none">
        <defs>
          <mask id="zip-cut">
            <rect width="100%" height="100%" fill="white" />
            {box ? (
              <rect
                x={Math.max(0, box.left - 8)}
                y={Math.max(0, box.top - 8)}
                width={box.width + 16}
                height={box.height + 16}
                rx="14"
                fill="black"
              />
            ) : null}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.55)" mask="url(#zip-cut)" />
      </svg>
      <button className="zip-skip" type="button" onClick={onSkip}>
        건너뛰기
      </button>
      <div className="zip-card" style={cardStyle}>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
        <div className="zip-dots">
          {ONBOARD.map((_, i) => (
            <i key={i} className={i === step ? "on" : undefined} />
          ))}
        </div>
        <button className="btn primary" type="button" onClick={onNext}>
          {last ? "시작하기" : "다음 →"}
        </button>
      </div>
    </div>
  );
}
