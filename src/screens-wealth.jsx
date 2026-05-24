// =========================================================================
// screens-wealth.jsx — Dashboard, Wealth Assets, Liabilities, MF list/detail
// =========================================================================

const { useState: useStateW } = React;

// -------------------------------------------------------------------------
// S1: Dashboard
// -------------------------------------------------------------------------
const Dashboard = () => {
  const app = useApp();
  const [page, setPage] = useStateW(0); // for wealth carousel dots
  const isFamily = app.profile === "Mehta Family";
  const dashGoals = isFamily ? MOCK.goalsDashboard : MOCK.goalsFull.slice(0, 3);
  const _days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const _months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const _now = new Date();
  const dateStr = `${_days[_now.getDay()]}, ${_now.getDate()} ${_months[_now.getMonth()]} ${_now.getFullYear()}`;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <PurpleHeader label="Dashboard" profile={app.profile} showEye showAdvisory showBell />
      <div className="scroll-area flex-1 overflow-y-auto pb-24">
        {/* Greeting */}
        <div className="px-4 pt-4 pb-2">
          <div style={{ fontSize: 20, fontWeight: 600 }}>Namaste Deepen <span style={{ filter: "saturate(1.2)" }}>🙏</span></div>
          <div className="ink-2" style={{ fontSize: 12, marginTop: 2 }}>{dateStr} · markets are closed</div>
        </div>

        {/* Wealth carousel (Net Worth + Assets) */}
        <div className="px-4">
          <div style={{ background: "#FAFAFB", border: "1px solid #ECECF1", borderRadius: 18, padding: 12 }}>
            <div className="flex items-center justify-between mb-2">
              <div style={{ fontWeight: 700, fontSize: 15 }}>Wealth</div>
              <div className="flex justify-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: i === page ? 14 : 5, height: 5, borderRadius: 3, background: i === page ? "var(--brand)" : "#D1D5DB", transition: "all 200ms ease" }} />
                ))}
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto scroll-area" style={{ scrollSnapType: "x mandatory" }} onScroll={(e) => {
              const w = e.currentTarget.firstChild.offsetWidth + 12;
              setPage(Math.round(e.currentTarget.scrollLeft / w));
            }}>
              <WealthCard
                title="Net Worth"
                value={MOCK.netWorth.value}
                change={MOCK.netWorth.change}
                period={MOCK.netWorth.period}
                positive
                onClick={() => app.go("wealth")}
              />
              <WealthCard
                title="Assets"
                value={MOCK.assetsTotal.value}
                change={MOCK.assetsTotal.change}
                period={MOCK.assetsTotal.period}
                positive
                onClick={() => app.go("wealth")}
              />
              <WealthCard
                title="Liabilities"
                value="₹18 L"
                change="−2%"
                period="1Y"
                positive={false}
                onClick={() => app.go("wealth-liab")}
              />
            </div>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="px-4 mt-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Asset Allocation</div>
                <div className="ink-3" style={{ fontSize: 11, marginTop: 2 }}>As of 04 Feb, 2026</div>
              </div>
            </div>

            {/* Stacked bar */}
            <div className="flex gap-1 mt-3 rounded-full overflow-hidden" style={{ height: 10 }}>
              {MOCK.assetAllocation.map((a, i) => (
                <div key={i} style={{ width: `${a.pct}%`, background: a.color }} />
              ))}
            </div>

            <div className="mt-3 divide-y" style={{ borderColor: "var(--border)" }}>
              {MOCK.assetAllocation.map((a, i) => (
                <button key={i} onClick={() => app.go("wealth")} className="flex items-center w-full py-2.5 text-left">
                  <div style={{ width: 4, height: 28, background: a.color, borderRadius: 2, marginRight: 10 }} />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{a.label}</div>
                    <div className="ink-3" style={{ fontSize: 11 }}>{a.pct}%</div>
                  </div>
                  <div className="text-right">
                    <Masked style={{ fontSize: 14, fontWeight: 600 }}>{a.value}</Masked>
                    <div><Trend positive={a.positive} value={a.change} /></div>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={() => app.go("wealth")} className="mt-2" style={{ color: "var(--brand)", fontWeight: 700, fontSize: 12, letterSpacing: 0.6 }}>VIEW ALL</button>
          </div>
        </div>

        {/* Goals */}
        <div className="px-4 mt-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div style={{ fontSize: 16, fontWeight: 700 }}>Goals</div>
              <button onClick={() => app.go("goals")} className="ink-3" style={{ fontSize: 11 }}>{dashGoals.length} goals →</button>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {dashGoals.map(g => (
                <button key={g.id} onClick={() => app.go("goal-detail", { goalId: g.id })} className="flex items-center w-full py-2.5 text-left gap-3">
                  <div className="flex items-center justify-center" style={{ width: 40, height: 40, background: g.iconBg, borderRadius: 10, fontSize: 22 }}>{g.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{g.name}</div>
                    <div className="ink-3 flex items-center gap-2" style={{ fontSize: 11 }}>
                      <span>{g.date}</span>
                      {isFamily && <AvatarStack items={[{ initial: "D", color: "#5B2EE0" }, { initial: "S", color: "#E91E63" }]} size={16} />}
                    </div>
                  </div>
                  <div className="text-right">
                    <Masked style={{ fontSize: 14, fontWeight: 600 }}>{g.value}</Masked>
                    <div className="mt-0.5">
                      {isFamily ? (
                        <Tag kind={tagKind(g.tag)}>{g.tag}</Tag>
                      ) : (
                        <span style={{ fontSize: 11, fontWeight: 600, color: g.status === "ahead" || g.status === "achieved" ? "#16A34A" : g.status === "lagging" ? "#DC2626" : g.status === "ontrack" ? "#3B82F6" : "#9CA3AF" }}>
                          {g.status === "ahead" ? "↗ Ahead" : g.status === "lagging" ? "↘ Lagging" : g.status === "ontrack" ? "On Track" : g.status === "achieved" ? "✓ Achieved" : "⊘ Unfunded"}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => app.go("goals")} className="mt-2" style={{ color: "var(--brand)", fontWeight: 700, fontSize: 12, letterSpacing: 0.6 }}>VIEW ALL</button>
          </div>
        </div>

        {/* Insurance */}
        <div className="px-4 mt-4">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <div style={{ fontSize: 16, fontWeight: 700 }}>Insurance</div>
              <button onClick={() => app.toast("Insurance — coming soon")} className="ink-3" style={{ fontSize: 11 }}>View all →</button>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {(app.profile === "Mehta Family" ? MOCK.insuranceFamily : MOCK.insurance.slice(0, 3)).map((p, i) => (
                <button key={i} onClick={() => app.toast(`${p.label} policy detail`)} className="flex items-center w-full py-2.5 text-left gap-3">
                  <IconCircle icon={p.icon} bg="#E6F0FF" color="#1F4FBA" />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{p.label}</div>
                    <div className="ink-3 truncate" style={{ fontSize: 11 }}>{p.policy}</div>
                    {p.owners && <div className="mt-1"><AvatarStack items={p.owners} size={16} /></div>}
                  </div>
                  <div className="text-right shrink-0">
                    <Masked style={{ fontSize: 13, fontWeight: 600 }}>{p.sumAssured}</Masked>
                    <div className="ink-3" style={{ fontSize: 11 }}>sum assured</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Credit Score */}
        <div className="px-4 mt-4">
          <button onClick={() => app.go("credit")} className="card p-4 w-full text-left">
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Credit Score</div>
                <div className="ink-3 flex items-center gap-1" style={{ fontSize: 11, marginTop: 2 }}>As on {MOCK.creditScore.asOf} <Icon name="info" size={11} color="#9CA3AF" /></div>
              </div>
              <div style={{ background: "#DCFCE7", color: "#15803D", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>{MOCK.creditScore.category}</div>
            </div>
            <div className="flex items-end gap-2 mt-2">
              <Masked style={{ fontSize: 28, fontWeight: 700 }}>{MOCK.creditScore.score}</Masked>
              <div className="ink-2 pb-1.5" style={{ fontSize: 12 }}>{MOCK.creditScore.change} this month</div>
            </div>
            <ScoreBar score={MOCK.creditScore.score} />
            <div className="ink-3 flex items-center gap-1 mt-2" style={{ fontSize: 10 }}>Powered by <span style={{ fontWeight: 700, color: "#0A4F8A" }}>Experian</span></div>
          </button>
        </div>

        {/* Fund Insights */}
        <div className="px-4 mt-4">
          <div className="card p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <div style={{ fontSize: 16, fontWeight: 700 }}>Fund Insights</div>
              <Icon name="info" size={14} color="#9CA3AF" />
            </div>
            <div className="ink-3" style={{ fontSize: 11, marginBottom: 6 }}>As of 04 Feb, 2026</div>
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {MOCK.fundInsights.map((f, i) => (
                <button key={i} onClick={() => app.go("mf-list")} className="flex items-center w-full py-2.5 text-left gap-3">
                  <TrendBadge kind={f.trend} color={f.color} />
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{f.label}</div>
                    <div className="ink-3" style={{ fontSize: 11 }}>{f.sub}</div>
                  </div>
                  <div className="ink-2" style={{ fontSize: 13, fontWeight: 500 }}>{f.count}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Account Hygiene */}
        <div className="px-4 mt-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div style={{ fontSize: 16, fontWeight: 700 }}>Account Hygiene</div>
              <Tag kind="warn">{MOCK.hygiene.banks.issues + MOCK.hygiene.folios.issues + MOCK.hygiene.demat.issues} issues</Tag>
            </div>
            <div className="mt-2 p-2.5 rounded-xl flex items-center gap-2" style={{ background: "#FEF3C7" }}>
              <Icon name="alert-triangle" size={14} color="#92400E" />
              <span style={{ fontSize: 12, color: "#92400E", fontWeight: 600 }}>Your account needs attention</span>
            </div>
            <div className="mt-2 divide-y" style={{ borderColor: "var(--border)" }}>
              <HygieneRow icon="landmark" label="Bank Accounts" total={MOCK.hygiene.banks.total} issues={MOCK.hygiene.banks.issues} onClick={() => app.go("account-hygiene")} />
              <HygieneRow icon="folder" label="Folios" total={MOCK.hygiene.folios.total} issues={MOCK.hygiene.folios.issues} onClick={() => app.go("account-hygiene")} />
              <HygieneRow icon="line-chart" label="Demat Accounts" total={MOCK.hygiene.demat.total} issues={MOCK.hygiene.demat.issues} onClick={() => app.go("account-hygiene")} />
            </div>
            <button onClick={() => app.go("account-hygiene")} className="flex items-center gap-1 mt-2" style={{ color: "var(--brand)", fontWeight: 600, fontSize: 13 }}>
              Review Accounts <Icon name="chevron-right" size={14} color="#5B2EE0" />
            </button>
          </div>
        </div>

        {/* Spending */}
        <div className="px-4 mt-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div style={{ fontSize: 16, fontWeight: 700 }}>Spending</div>
              <button onClick={() => app.go("transactions")} className="ink-3" style={{ fontSize: 11 }}>View details →</button>
            </div>
            {app.profile === "Mehta Family" ? (
              <>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full flex items-center justify-center" style={{ width: 40, height: 40, background: "var(--brand-soft)" }}>
                      <Icon name="banknote" size={20} color="#5B2EE0" />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{MOCK.spendingFamily.month}</div>
                      <div className="ink-3" style={{ fontSize: 11 }}>Across 4 members</div>
                    </div>
                  </div>
                  <Masked style={{ fontSize: 17, fontWeight: 700 }}>{MOCK.spendingFamily.value}</Masked>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {MOCK.spendingFamily.byMember.map((m, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl" style={{ background: "#F7F7FA" }}>
                      <Avatar initial={m.initial} color={m.color} size={26} />
                      <div className="flex-1 min-w-0">
                        <div className="truncate" style={{ fontSize: 12, fontWeight: 600 }}>{m.name}</div>
                        <Masked style={{ fontSize: 11, color: "var(--ink-2)" }}>{m.value}</Masked>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full flex items-center justify-center" style={{ width: 40, height: 40, background: "var(--brand-soft)" }}>
                    <Icon name="banknote" size={20} color="#5B2EE0" />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{MOCK.spending.month}</div>
                    <div className="ink-3" style={{ fontSize: 11 }}>{MOCK.spending.change}</div>
                  </div>
                </div>
                <Masked style={{ fontSize: 17, fontWeight: 700 }}>{MOCK.spending.value}</Masked>
              </div>
            )}
            <button onClick={() => app.go("transactions")} className="mt-3 flex items-center gap-1" style={{ color: "var(--brand)", fontWeight: 600, fontSize: 13 }}>
              View Details <Icon name="chevron-right" size={14} color="#5B2EE0" />
            </button>
          </div>
        </div>

        <div style={{ height: 8 }} />
      </div>
      <FAB />
      <BottomNav active="dashboard" />
    </div>
  );
};

const ScoreBar = ({ score }) => {
  const segs = [
    { c: "#FEE2E2", to: 580 },
    { c: "#FDE2C7", to: 670 },
    { c: "#FEF3C7", to: 740 },
    { c: "#DCFCE7", to: 800 },
    { c: "#16A34A", to: 900 },
  ];
  const pct = Math.min(100, Math.max(0, ((score - 300) / 600) * 100));
  return (
    <div className="mt-2">
      <div className="flex gap-1 rounded-full overflow-hidden" style={{ height: 6 }}>
        {segs.map((s, i) => <div key={i} className="flex-1" style={{ background: s.c }} />)}
      </div>
      <div style={{ position: "relative", height: 0 }}>
        <div style={{ position: "absolute", top: -10, left: `calc(${pct}% - 4px)`, width: 8, height: 14, background: "#111", borderRadius: 2 }} />
      </div>
    </div>
  );
};

const HygieneRow = ({ icon, label, total, issues, onClick }) => (
  <button onClick={onClick} className="flex items-center w-full py-2.5 text-left gap-3">
    <Icon name={icon} size={18} color="#374151" />
    <div className="flex-1" style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
    <span style={{ fontSize: 12 }} className="ink-2">{issues} issues</span>
  </button>
);

const WealthCard = ({ title, value, change, period, positive, onClick }) => (
  <button onClick={onClick} className="card p-3 text-left shrink-0" style={{ width: 230, scrollSnapAlign: "start" }}>
    <div className="ink-2" style={{ fontSize: 12 }}>{title}</div>
    <div className="flex items-end justify-between mt-1">
      <Masked style={{ fontSize: 22, fontWeight: 700 }}>{value}</Masked>
      <Sparkline width={70} height={32} color={positive ? "#16A34A" : "#DC2626"} />
    </div>
    <div className="mt-1 flex items-center gap-2">
      <Trend positive={positive} value={change} />
      <span className="ink-3" style={{ fontSize: 11 }}>{period}</span>
    </div>
  </button>
);

const TrendBadge = ({ kind, color }) => {
  let inner;
  if (kind === "up") inner = <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 11 L7 4 L12 9" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 4 L12 4 L12 8" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  else if (kind === "neutral") inner = <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 9 L6 5 L9 7 L12 4" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  else if (kind === "warn") inner = <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 5 L7 11 L12 5" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  else if (kind === "down") inner = <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 4 L7 10 L12 5" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 10 L12 10 L12 7" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  else inner = <span style={{ color, fontWeight: 800, fontSize: 14 }}>?</span>;
  return <div className="flex items-center justify-center" style={{ width: 28, height: 28, background: `${color}15`, borderRadius: 8 }}>{inner}</div>;
};

// -------------------------------------------------------------------------
// S2 / S3 : Wealth Assets / Liabilities
// -------------------------------------------------------------------------
const Wealth = ({ tab = "assets", profile = "Myself" }) => {
  const app = useApp();
  const [expanded, setExpanded] = useStateW(false);
  const isFamily = profile === "Mehta Family";
  const data = isFamily ? MOCK.assetCategories : MOCK.assetCategories;
  const visibleAssets = expanded ? data : data.slice(0, 5);
  const _today = new Date();
  const _months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const asOnDate = `${String(_today.getDate()).padStart(2,"0")} ${_months[_today.getMonth()]} ${_today.getFullYear()}`;
  const totalAssetsRaw = MOCK.assetCategories.reduce((s, a) => s + (a.rawValue || 0), 0);
  const totalLiabRaw = MOCK.liabilities.reduce((s, l) => s + (l.rawValue || 0), 0);
  const fmtINR = (n) => n >= 10000000 ? `₹${(n / 10000000).toFixed(2)} Cr` : `₹${Math.round(n / 100000)} L`;

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <PurpleHeader label="Wealth" profile={profile} showProfile={false} showEye showShare showAdd />
      <div className="scroll-area flex-1 overflow-y-auto pb-24">
        {/* Net worth strip */}
        <div className="px-4 pt-3">
          <div className="card p-4 flex items-center justify-between">
            <div>
              <div className="ink-2" style={{ fontSize: 12 }}>Net worth</div>
              <div className="flex items-baseline gap-2">
                <Masked style={{ fontSize: 22, fontWeight: 700 }}>{MOCK.myselfNet.value}</Masked>
              </div>
              <Trend positive={MOCK.myselfNet.positive} value={MOCK.myselfNet.change} />
            </div>
            <Sparkline width={100} height={42} color="#5B2EE0" />
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 mt-3">
          <div className="flex p-1 rounded-xl" style={{ background: "#ECECF1" }}>
            <TabBtn active={tab === "assets"} onClick={() => app.go("wealth")} label={`Assets (24)`} />
            <TabBtn active={tab === "liab"} onClick={() => app.go("wealth-liab")} label="Liabilities (4)" />
          </div>
        </div>

        {tab === "assets" ? (
          <div className="px-4 mt-3">
            <div className="flex items-end justify-between mb-2">
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Total Asset Value</div>
                <div className="ink-3" style={{ fontSize: 11 }}>As on {asOnDate}</div>
              </div>
              <Masked style={{ fontSize: 18, fontWeight: 700 }}>{fmtINR(totalAssetsRaw)}</Masked>
            </div>
            <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
              {visibleAssets.map((c) => (
                <button key={c.key} onClick={() => c.navTo ? app.go(c.navTo) : app.toast(`${c.label} detail — coming soon`)} className="flex items-center w-full px-4 py-3 text-left gap-3">
                  <IconCircle icon={c.icon} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5" style={{ fontSize: 14, fontWeight: 600 }}>
                      {c.label}{c.count ? <span className="ink-2" style={{ fontWeight: 500 }}>({c.count})</span> : null}
                      {c.key === "mf" && <Icon name="refresh-cw" size={11} color="#9CA3AF" />}
                    </div>
                    <div className="ink-3" style={{ fontSize: 11 }}>{c.alloc}</div>
                    {isFamily && <div className="mt-1"><AvatarStack items={MOCK.familyMembers.slice(0, 3).map(m => ({ initial: m.initial, color: m.color }))} size={16} /></div>}
                  </div>
                  <div className="text-right shrink-0">
                    <Masked style={{ fontSize: 14, fontWeight: 600 }}>{c.value}</Masked>
                    <div className="mt-0.5">{c.change ? <Trend positive={c.positive} value={c.change} /> : <span className="ink-3" style={{ fontSize: 11 }}>————</span>}</div>
                  </div>
                </button>
              ))}
            </div>

            <button onClick={() => setExpanded(e => !e)} className="flex items-center gap-1 mt-2" style={{ color: "var(--brand)", fontWeight: 600, fontSize: 13 }}>
              {expanded ? "Show Less" : "View All Assets"}
              <Icon name={expanded ? "chevron-up" : "chevron-down"} size={14} color="#5B2EE0" />
            </button>
          </div>
        ) : (
          <div className="px-4 mt-3">
            <div className="flex items-end justify-between mb-2">
              <div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>Total Borrowed</div>
                <div className="ink-3 flex items-center gap-1" style={{ fontSize: 11 }}>As on {asOnDate} <Icon name="refresh-cw" size={10} color="#9CA3AF" /></div>
              </div>
              <Masked style={{ fontSize: 18, fontWeight: 700 }}>{fmtINR(totalLiabRaw)}</Masked>
            </div>
            <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
              {MOCK.liabilities.map((l, i) => (
                <div key={i} className="flex items-center px-4 py-3 gap-3">
                  <IconCircle icon={l.icon} bg="#FFE9E5" color="#B43D2A" />
                  <div className="flex-1">
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{l.label}</div>
                  </div>
                  <div className="text-right">
                    <Masked style={{ fontSize: 14, fontWeight: 600 }}>{l.value}</Masked>
                    <div className="ink-3" style={{ fontSize: 11 }}>{l.emi || "————"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <FAB />
      <BottomNav active="wealth" />
    </div>
  );
};

const TabBtn = ({ active, onClick, label }) => (
  <button onClick={onClick} className="flex-1 pill-tab text-center" style={{
    padding: "8px 12px",
    borderRadius: 10,
    background: active ? "#fff" : "transparent",
    color: active ? "var(--ink)" : "var(--ink-2)",
    fontWeight: active ? 600 : 500,
    fontSize: 13,
    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
  }}>{label}</button>
);

// -------------------------------------------------------------------------
// S14: Mutual Fund List
// -------------------------------------------------------------------------
const MFList = ({ profile = "Myself" }) => {
  const app = useApp();
  const isFamily = profile === "Family";
  const [expandedMember, setExpandedMember] = useStateW("pr");

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title={isFamily ? "Family" : "Myself"} sub="Mutual Funds" right={<button onClick={() => app.toast("Options")} className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }}><Icon name="more-horizontal" size={20} color="#fff" /></button>} />
      <div className="scroll-area flex-1 overflow-y-auto pb-4">
        {isFamily && (
          <div className="px-4 pt-3">
            <div className="card flex items-center gap-2 px-3 py-2" style={{ fontSize: 12, color: "var(--ink-2)" }}>
              <Icon name="refresh-cw" size={12} color="#9CA3AF" />
              Last updated 10 days ago
            </div>
          </div>
        )}

        <div className="px-4 pt-3 flex items-center justify-between">
          <div>
            <div className="ink-2" style={{ fontSize: 12 }}>Total Value (5)</div>
            <Masked style={{ fontSize: 20, fontWeight: 700 }}>₹2,50,00,000</Masked>
          </div>
          <button onClick={() => app.go(isFamily ? "mf-list" : "mf-list-family")} className="flex items-center gap-1" style={{ fontSize: 12, color: "var(--brand)" }}>
            <Icon name="code" size={12} color="#5B2EE0" />
            <span style={{ borderBottom: "1px solid var(--brand)" }}>{isFamily ? "Member view" : "Asset view"}</span>
          </button>
        </div>

        {isFamily ? (
          <div className="px-4 mt-3">
            <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
              {MOCK.familyMembers.map(m => (
                <div key={m.id}>
                  <button onClick={() => setExpandedMember(em => em === m.id ? null : m.id)} className="flex items-center w-full px-3 py-3 gap-3 text-left">
                    <div className="rounded-full flex items-center justify-center" style={{ width: 24, height: 24, border: "1.5px solid var(--brand)", color: "var(--brand)" }}>
                      <Icon name={expandedMember === m.id ? "minus" : "plus"} size={14} color="#5B2EE0" />
                    </div>
                    <Avatar initial={m.initial} color={m.color} size={28} />
                    <div className="flex-1" style={{ fontSize: 14, fontWeight: 600 }}>{m.name} <span className="ink-2" style={{ fontWeight: 500 }}>({m.funds})</span></div>
                    <Masked style={{ fontSize: 14, fontWeight: 600 }}>{m.net}</Masked>
                  </button>
                  {expandedMember === m.id && (
                    <div className="fade-in pb-2" style={{ background: "var(--brand-soft-2)" }}>
                      {MOCK.mutualFunds.slice(0, 2).map(f => (
                        <button key={f.id} onClick={() => app.go("mf-detail", { fundId: f.id })} className="flex items-center w-full px-4 py-3 gap-3 text-left">
                          <LogoTile color={f.logoColor} char={f.logoChar} />
                          <div className="flex-1 min-w-0">
                            <div className="truncate" style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>
                            <div className="ink-3" style={{ fontSize: 11 }}>{f.type}</div>
                          </div>
                          <div className="text-right">
                            <Masked style={{ fontSize: 13, fontWeight: 600 }}>{f.value}</Masked>
                            <div className="ink-3" style={{ fontSize: 11 }}>15%</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 mt-3">
            <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
              {MOCK.mutualFunds.map(f => (
                <button key={f.id} onClick={() => app.go("mf-detail", { fundId: f.id })} className="flex items-center w-full px-4 py-3 gap-3 text-left">
                  <LogoTile color={f.logoColor} char={f.logoChar} size={40} />
                  <div className="flex-1 min-w-0">
                    <div className="truncate" style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</div>
                    <div className="ink-3" style={{ fontSize: 11 }}>{f.type}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <Masked style={{ fontSize: 14, fontWeight: 600 }}>{f.value}</Masked>
                    <div className="ink-3" style={{ fontSize: 11 }}>{f.invested}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="ink-3 text-center mt-6" style={{ fontSize: 11 }}>End of list</div>
          </div>
        )}
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// S15: Mutual Fund Detail
// -------------------------------------------------------------------------
const MFDetail = () => {
  const app = useApp();
  const d = MOCK.fundDetail;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title="Investment Details" right={<button className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }} onClick={() => app.toast("Options menu")}><Icon name="more-horizontal" size={20} color="#fff" /></button>} />
      <div className="scroll-area flex-1 overflow-y-auto pb-4">
        <div className="px-4 pt-3">
          <div className="card p-4 flex items-center gap-3">
            <LogoTile color="#F47B26" char="i" size={40} />
            <div className="flex-1">
              <div style={{ fontSize: 14, fontWeight: 600 }}>{d.name}</div>
              <div className="ink-3" style={{ fontSize: 11 }}>{d.type}</div>
            </div>
          </div>
        </div>

        <div className="px-4 mt-3">
          <div className="ink-2" style={{ fontSize: 12 }}>Selected Folio</div>
          <button onClick={() => app.toast("Folio picker — mock")} className="card w-full px-4 py-3 mt-1 flex items-center justify-between" style={{ background: "#fff" }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>All Folios</span>
            <Icon name="chevron-right" size={16} color="#9CA3AF" />
          </button>
          <div className="ink-3 mt-2" style={{ fontSize: 11 }}>Last Updated 6 hrs ago</div>
        </div>

        <div className="px-4 mt-3">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="ink-2" style={{ fontSize: 12 }}>Current Value</div>
                <Masked style={{ fontSize: 22, fontWeight: 700 }}>{d.current}</Masked>
              </div>
              <div className="text-right">
                <div className="ink-2" style={{ fontSize: 12 }}>Invested Value</div>
                <Masked style={{ fontSize: 16, fontWeight: 600 }}>{d.invested}</Masked>
              </div>
            </div>
            <div className="divider my-3" />
            <div className="grid grid-cols-3 gap-2 text-sm">
              <Metric label="Total Returns" value={d.totalReturns} positive />
              <Metric label="1D Returns" value={d.oneDay} positive />
              <Metric label="XIRR" value={d.xirr} positive />
            </div>
          </div>
        </div>

        <div className="px-4 mt-3">
          <button onClick={() => app.toast("Performance breakdown")} className="card w-full px-4 py-3 flex items-center justify-between">
            <span style={{ fontWeight: 600, fontSize: 14 }}>Fund Performance</span>
            <span className="flex items-center gap-1">
              <Icon name="trending-up" size={14} color="#16A34A" />
              <span style={{ color: "var(--pos)", fontWeight: 600, fontSize: 13 }}>Ahead</span>
              <Icon name="chevron-down" size={16} color="#6B7280" />
            </span>
          </button>
        </div>

        <div className="px-4 mt-4">
          <div style={{ fontSize: 16, fontWeight: 700 }}>Transaction History</div>
          <div className="card mt-2 divide-y" style={{ borderColor: "var(--border)" }}>
            {d.transactions.map((t, i) => (
              <div key={i} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="ink-2" style={{ fontSize: 12 }}>Folio No: {t.folio}</div>
                  <div className="ink-3" style={{ fontSize: 11 }}>{t.date}</div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Amount Invested</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.amount}</div>
                </div>
                <div className="ink-3" style={{ fontSize: 11 }}>{t.units}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value, positive }) => (
  <div>
    <div className="ink-2" style={{ fontSize: 11 }}>{label}</div>
    <div style={{ color: positive ? "var(--pos)" : "var(--neg)", fontWeight: 600, fontSize: 13 }}>{value}</div>
  </div>
);

// -------------------------------------------------------------------------
// S26: Account Hygiene
// -------------------------------------------------------------------------
const HYGIENE_DATA = {
  summary: { total: 16, issues: 12 },
  banks: [
    { name: "ICICI Bank", type: "SAVINGS Account", last4: "4672", logoColor: "#F47B26", logoChar: "I", kyc: "pending", nominee: "pending" },
    { name: "HDFC Bank", type: "SAVINGS Account", last4: "4672", logoColor: "#004C8F", logoChar: "H", kyc: "done", nominee: "pending" },
  ],
  folios: [
    { name: "HDFC Mid-Cap Opportunities Fund", folio: "4421", kyc: "pending", nominee: "done" },
    { name: "Nippon Ultra Short Duration Fund", folio: "6689", kyc: "done", nominee: "pending" },
  ],
};

const HygieneStatus = ({ label, status }) => {
  const done = status === "done";
  return (
    <div className="flex items-center gap-1">
      <Icon name={done ? "check-circle" : "alert-triangle"} size={12} color={done ? "#16A34A" : "#D97706"} />
      <span style={{ fontSize: 11, color: done ? "#16A34A" : "#D97706", fontWeight: 500 }}>
        {label} {done ? "Done" : "Pending"}
      </span>
    </div>
  );
};

const AccountHygiene = () => {
  const app = useApp();
  const d = HYGIENE_DATA;
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title="Account Hygiene" />
      <div className="scroll-area flex-1 overflow-y-auto pb-6">
        {/* Warning banner */}
        <div className="px-4 pt-3">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: "#FEF3C7" }}>
            <Icon name="alert-triangle" size={15} color="#92400E" />
            <span style={{ fontSize: 13, color: "#92400E", fontWeight: 600 }}>
              {d.summary.issues} / {d.summary.total} accounts need attention
            </span>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="px-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="landmark" size={16} color="#374151" />
            <span style={{ fontSize: 15, fontWeight: 700 }}>Bank Accounts</span>
          </div>
          <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
            {d.banks.map((b, i) => (
              <div key={i} className="flex items-start px-4 py-3 gap-3">
                <LogoTile color={b.logoColor} char={b.logoChar} size={36} />
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{b.name}</div>
                  <div className="ink-3" style={{ fontSize: 11, marginBottom: 4 }}>
                    {b.type} - xxxx {b.last4}
                  </div>
                  <div className="flex items-center gap-3">
                    <HygieneStatus label="KYC" status={b.kyc} />
                    <span style={{ color: "var(--border)" }}>•</span>
                    <HygieneStatus label="Nominee" status={b.nominee} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Folios */}
        <div className="px-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="folder" size={16} color="#374151" />
            <span style={{ fontSize: 15, fontWeight: 700 }}>Folios</span>
          </div>
          <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
            {d.folios.map((f, i) => (
              <div key={i} className="flex items-start px-4 py-3 gap-3">
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</div>
                  <div className="ink-3" style={{ fontSize: 11, marginBottom: 4 }}>
                    Folio - xx {f.folio}
                  </div>
                  <div className="flex items-center gap-3">
                    <HygieneStatus label="KYC" status={f.kyc} />
                    <span style={{ color: "var(--border)" }}>•</span>
                    <HygieneStatus label="Nominee" status={f.nominee} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="px-4 mt-4">
          <p className="ink-3" style={{ fontSize: 11 }}>
            <span style={{ fontWeight: 600 }}>Note:</span> Some institutions do not share nominee or KYC status via integrations.
          </p>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Dashboard, Wealth, MFList, MFDetail, ScoreBar, TabBtn, AccountHygiene });
