import { Fragment, ReactNode } from "react";

const IMAGE = /<!--\s*IMAGE:\s*([^>]+?)\s*-->/i;
const H2 = /^##\s+(.*)$/;
const H1 = /^#\s+(.*)$/;
const UL = /^\*\s+(.*)$/;
const OL_SHORT = /^\d+\.\s+(.{1,80})$/;
const SECTION_NUM = /^\d+\.\s+(.+)$/;
const NOTE = /^(?:>\s*)?(?:참고\s*[:：]\s*)(.+)$/;

function stripMd(s: string) {
  return s.replace(/\*\*/g, "").trim();
}

function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
      )}
    </>
  );
}

function resolveImage(name: string, images: Record<string, string>) {
  const key = name.trim();
  const lower = key.toLowerCase();
  for (const [k, v] of Object.entries(images)) {
    if (k.toLowerCase() === lower) return v;
  }
  return null;
}

export function extractToc(markdown: string) {
  const items: { id: string; heading: string }[] = [];
  for (const raw of markdown.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim();
    const h2 = line.match(H2);
    if (h2) {
      items.push({ id: `s${items.length + 1}`, heading: stripMd(h2[1]) });
      continue;
    }
    if (H1.test(line) || IMAGE.test(line) || UL.test(line) || NOTE.test(line) || line === "<br>") continue;
    if (line === "정리하면") {
      items.push({ id: `s${items.length + 1}`, heading: line });
      continue;
    }
    const num = line.match(SECTION_NUM);
    if (num && !OL_SHORT.test(line) && num[1].length > 12) {
      items.push({ id: `s${items.length + 1}`, heading: stripMd(num[0]) });
    }
  }
  return items;
}

export function ArticleBody({
  markdown,
  images,
}: {
  markdown: string;
  images: Record<string, string>;
}) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let skippedTitle = false;
  let headingCount = 0;
  let i = 0;

  const pushHeading = (text: string) => {
    headingCount += 1;
    const id = `s${headingCount}`;
    nodes.push(
      <h2 key={`h-${id}`} id={id}>
        {stripMd(text)}
      </h2>,
    );
  };

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();
    i += 1;
    if (!line || line === "<br>") continue;

    const img = line.match(IMAGE);
    if (img) {
      const src = resolveImage(img[1], images);
      if (src) {
        nodes.push(
          <figure key={`img-${nodes.length}`} className="article-inline-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" />
          </figure>,
        );
      }
      continue;
    }

    const h1 = line.match(H1);
    if (h1 && !line.startsWith("##")) {
      if (!skippedTitle) {
        skippedTitle = true;
        continue;
      }
      pushHeading(h1[1]);
      continue;
    }

    const h2 = line.match(H2);
    if (h2) {
      pushHeading(h2[1]);
      continue;
    }

    if (UL.test(line)) {
      const items = [line.match(UL)![1]];
      while (i < lines.length && UL.test(lines[i].trim())) {
        items.push(lines[i].trim().match(UL)![1]);
        i += 1;
      }
      nodes.push(
        <ul key={`ul-${nodes.length}`} className="article-md-list">
          {items.map((item, idx) => (
            <li key={idx}>
              <Rich text={item} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    if (OL_SHORT.test(line) && i < lines.length && OL_SHORT.test(lines[i].trim())) {
      const items = [line.match(OL_SHORT)![1]];
      while (i < lines.length && OL_SHORT.test(lines[i].trim())) {
        items.push(lines[i].trim().match(OL_SHORT)![1]);
        i += 1;
      }
      nodes.push(
        <ol key={`ol-${nodes.length}`} className="article-md-list">
          {items.map((item, idx) => (
            <li key={idx}>
              <Rich text={item} />
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    const note = line.match(NOTE);
    if (note) {
      nodes.push(
        <p key={`note-${nodes.length}`} className="article-ref">
          참고: {stripMd(note[1])}
        </p>,
      );
      continue;
    }

    if (line === "정리하면") {
      pushHeading(line);
      continue;
    }

    const section = line.match(SECTION_NUM);
    if (section && section[1].length > 12) {
      pushHeading(line);
      continue;
    }

    const para = [line];
    while (i < lines.length) {
      const next = lines[i].trim();
      if (!next) break;
      if (
        IMAGE.test(next) ||
        H2.test(next) ||
        H1.test(next) ||
        UL.test(next) ||
        NOTE.test(next) ||
        next === "<br>" ||
        (SECTION_NUM.test(next) && next.replace(SECTION_NUM, "$1").length > 12)
      ) {
        break;
      }
      para.push(next);
      i += 1;
    }
    nodes.push(
      <p key={`p-${nodes.length}`} className="body">
        {para.map((chunk, idx) => (
          <Fragment key={idx}>
            {idx ? <br /> : null}
            <Rich text={chunk} />
          </Fragment>
        ))}
      </p>,
    );
  }

  return <div className="article-md">{nodes}</div>;
}
