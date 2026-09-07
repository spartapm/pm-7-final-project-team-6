"use client";

import { SiteShell } from "@/components/chrome";
import { CALENDAR } from "@/lib/data";

export default function CalendarPage() {
  return (
    <SiteShell>
      <div className="catalog">
        <div className="wrap">
          <p className="kicker">GNB</p>
          <h1>이슈 캘린더</h1>
          <p className="lede">현장 스케치와 캠페인 송출 일정을 미리 잡아 두는 판입니다.</p>
          <ol className="cal-list">
            {CALENDAR.map((item) => (
              <li key={item.date}>
                <time>{item.date}</time>
                <div>
                  <span className="cal-tag">{item.tag}</span>
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SiteShell>
  );
}
