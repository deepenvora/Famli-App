// =========================================================================
// screens-misc.jsx — Transactions, Credit, AI, Profile, Settings, Help, Sheet
// =========================================================================

const { useState: useStateM, useEffect: useEffectM, useRef: useRefM } = React;

// -------------------------------------------------------------------------
// S7: Transactions — header dropdown + bank accounts + history + month filter
// -------------------------------------------------------------------------
const MONTHS = ["May 2026","Apr 2026","Mar 2026","Feb 2026","Jan 2026","Dec 2025","Nov 2025","Oct 2025"];

const Transactions = () => {
  const app = useApp();
  const isFamily = app.profile === "Mehta Family";
  const [month, setMonth] = useStateM("May 2026");
  const [filterOpen, setFilterOpen] = useStateM(false);
  const [activeAccount, setActiveAccount] = useStateM("all");

  const accounts = isFamily
    ? [...MOCK.bankAccounts.map(a => ({ ...a, owner: { initial: "D", color: "#5B2EE0" } })),
       { id: "f1", bank: "HDFC Bank", last4: "8870", color: "#1F3D8C", balance: "₹1,82,400", type: "Salary", owner: { initial: "S", color: "#E91E63" } },
       { id: "f2", bank: "ICICI Bank", last4: "2241", color: "#A6431B", balance: "₹3,15,000", type: "Savings", owner: { initial: "R", color: "#0EA5E9" } }]
    : MOCK.bankAccounts;

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <PurpleHeader label="Transactions" profile={app.profile} showEye showProfile={false} />
      <div className="scroll-area flex-1 overflow-y-auto pb-24">
        {/* Month chip */}
        <div className="px-4 pt-3">
          <button onClick={() => setFilterOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "var(--brand-soft)", color: "var(--brand)", fontWeight: 600, fontSize: 12 }}>
            <Icon name="calendar" size={13} color="#5B2EE0" />
            {month}
            <Icon name="chevron-down" size={13} color="#5B2EE0" />
          </button>
        </div>

        <div className="px-4 mt-3">
          <div className="card p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="ink-2" style={{ fontSize: 12 }}>{month} net flow</div>
                <Masked style={{ fontSize: 22, fontWeight: 700 }}>{isFamily ? "−₹1,87,420" : "−₹68,420"}</Masked>
              </div>
              <Trend positive={false} value="↑ 12% vs prev" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3">
              <Stat label="Inflow" value={isFamily ? "₹4,82,140" : "₹2,47,140"} pos />
              <Stat label="Outflow" value={isFamily ? "₹6,69,560" : "₹3,15,560"} />
              <Stat label="Saved" value="42%" pos />
            </div>
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="px-4 mt-3">
          <div className="flex items-center justify-between mb-2">
            <div style={{ fontSize: 16, fontWeight: 700 }}>{isFamily ? "All Family Accounts" : "My Bank Accounts"}</div>
            <span className="ink-3" style={{ fontSize: 11 }}>{accounts.length} linked</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scroll-area pb-1" style={{ scrollSnapType: "x mandatory" }}>
            <AccountPill active={activeAccount === "all"} onClick={() => setActiveAccount("all")} bank="All accounts" />
            {accounts.map(a => (
              <AccountPill key={a.id} active={activeAccount === a.id} onClick={() => setActiveAccount(a.id)} bank={`${a.bank} · xx${a.last4.slice(-2)}`} owner={a.owner} color={a.color} />
            ))}
          </div>
        </div>

        {/* Account cards */}
        <div className="px-4 mt-3 space-y-2">
          {(activeAccount === "all" ? accounts : accounts.filter(a => a.id === activeAccount)).slice(0, isFamily ? 4 : 5).map(a => (
            <div key={a.id} className="card flex items-center px-4 py-3 gap-3">
              <LogoTile color={a.color} char={a.bank[0]} size={36} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{a.bank}</span>
                  {a.owner && isFamily && <Avatar initial={a.owner.initial} color={a.owner.color} size={16} />}
                </div>
                <div className="ink-3" style={{ fontSize: 11 }}>xxxx-{a.last4} · {a.type}</div>
              </div>
              <Masked style={{ fontSize: 14, fontWeight: 700 }}>{a.balance}</Masked>
            </div>
          ))}
        </div>

        {/* Transaction history */}
        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-2">
            <div style={{ fontSize: 16, fontWeight: 700 }}>Transaction History</div>
            <button onClick={() => app.toast("Export — coming soon")} className="ink-3 flex items-center gap-1" style={{ fontSize: 11 }}>
              <Icon name="download" size={12} color="#9CA3AF" /> Export
            </button>
          </div>
          <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
            {MOCK.transactions.map(t => (
              <div key={t.id} className="flex items-center px-4 py-3 gap-3">
                <div className="rounded-full flex items-center justify-center" style={{ width: 36, height: 36, background: t.color, color: "#fff", fontSize: 11, fontWeight: 700 }}>{t.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="truncate" style={{ fontSize: 13, fontWeight: 600 }}>{t.party}</div>
                  <div className="ink-3" style={{ fontSize: 11 }}>{t.account} · {t.date}</div>
                </div>
                <div className="text-right shrink-0">
                  <Masked style={{ fontSize: 14, fontWeight: 600, color: t.dir === "in" ? "var(--pos)" : "var(--ink)" }}>{t.amount}</Masked>
                </div>
              </div>
            ))}
          </div>
        </div>

        <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} month={month} setMonth={setMonth} />
      </div>
      <FAB />
      <BottomNav active="transactions" />
    </div>
  );
};

const AccountPill = ({ active, onClick, bank, owner, color }) => (
  <button onClick={onClick} className="shrink-0 flex items-center gap-1.5" style={{
    padding: "6px 12px",
    borderRadius: 999,
    border: active ? "1px solid var(--brand)" : "1px solid var(--border)",
    background: active ? "var(--brand)" : "#fff",
    color: active ? "#fff" : "var(--ink-2)",
    fontSize: 12,
    fontWeight: 500,
  }}>
    {color && <span style={{ width: 8, height: 8, background: color, borderRadius: 2, display: "inline-block" }} />}
    {bank}
    {owner && <Avatar initial={owner.initial} color={owner.color} size={14} />}
  </button>
);

const FilterSheet = ({ open, onClose, month, setMonth }) => {
  const app = useApp();
  if (!open) return null;
  return (
    <div className="absolute inset-0" style={{ zIndex: 50 }}>
      <div className="backdrop-in absolute inset-0" onClick={onClose} style={{ background: "rgba(40,42,60,0.55)" }} />
      <div className="sheet-in absolute left-0 right-0 bottom-0 bg-white" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden", maxHeight: "75%" }}>
        <div className="flex justify-center pt-2 pb-1">
          <div style={{ width: 44, height: 4, background: "#E5E7EB", borderRadius: 2 }} />
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <div style={{ fontSize: 16, fontWeight: 700 }}>Filter by Month</div>
          <button onClick={onClose} className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28 }}><Icon name="x" size={18} color="#111"/></button>
        </div>
        <div className="px-4 pb-4 space-y-2 overflow-y-auto scroll-area" style={{ maxHeight: 360 }}>
          {MONTHS.map(m => (
            <button key={m} onClick={() => { setMonth(m); onClose(); app.toast(`Showing ${m}`); }} className="flex items-center justify-between w-full p-3" style={{
              border: month === m ? "1.5px solid var(--brand)" : "1px solid var(--border)",
              borderRadius: 12,
              background: month === m ? "var(--brand-soft-2)" : "#fff",
              fontSize: 14, fontWeight: 500
            }}>
              <span>{m}</span>
              {month === m && <Icon name="check" size={16} color="#5B2EE0" stroke={2.4} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value, pos }) => (
  <div className="rounded-xl p-2" style={{ background: "#F7F7FA" }}>
    <div className="ink-2" style={{ fontSize: 10 }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 700, color: pos ? "var(--pos)" : "var(--ink)" }}>{value}</div>
  </div>
);

const FilterChip = ({ active, onClick, children }) => (
  <button onClick={onClick} className="shrink-0" style={{
    padding: "6px 14px",
    borderRadius: 999,
    border: active ? "1px solid var(--brand)" : "1px solid var(--border)",
    background: active ? "var(--brand)" : "#fff",
    color: active ? "#fff" : "var(--ink-2)",
    fontSize: 12,
    fontWeight: 500,
  }}>{children}</button>
);

// -------------------------------------------------------------------------
// S8: Credit — tabs: CREDIT + CREDIT SCORE  |  views: My / Family
// -------------------------------------------------------------------------
const Credit = () => {
  const app = useApp();
  const [tab, setTab] = useStateM("credit");
  const [activeCardFilter, setActiveCardFilter] = useStateM("all");
  const [activeMember, setActiveMember] = useStateM("wife");
  const [month, setMonth] = useStateM("May 2026");
  const [filterOpen, setFilterOpen] = useStateM(false);
  const isFamily = app.profile === "Mehta Family";

  const cards = isFamily
    ? [...MOCK.creditCards, { id: "axis", bank: "AXIS BANK", color: "#A1276F", last4: "4002", due: "₹0", unbilled: "₹6,200", network: "VISA", owner: { initial: "S", color: "#E91E63" } }]
    : MOCK.creditCards;

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <PurpleHeader label="Credit" profile={app.profile} showEye showProfile={false} />

      {/* Tabs */}
      <div className="px-4 pt-3" style={{ background: "var(--bg)" }}>
        <div className="flex p-1 rounded-xl" style={{ background: "#ECECF1" }}>
          <TabBtn active={tab === "credit"} onClick={() => setTab("credit")} label={<span className="flex items-center justify-center gap-1.5"><Icon name="credit-card" size={14} color={tab==='credit' ? "#111" : "#6B7280"}/>Credit</span>} />
          <TabBtn active={tab === "score"} onClick={() => setTab("score")} label={<span className="flex items-center justify-center gap-1.5"><Icon name="gauge" size={14} color={tab==='score' ? "#111" : "#6B7280"}/>Credit Score</span>} />
        </div>
      </div>

      <div className="scroll-area flex-1 overflow-y-auto pb-24">
        {tab === "credit" ? (
          <>
            <div className="px-4 pt-3 grid grid-cols-2 gap-3">
              <Tile label="Unbilled spends" value={isFamily ? "₹9,410" : "₹3,210"} sub={`Across ${cards.length} cards`} />
              <Tile label="Total due amount" value={isFamily ? "₹14,802" : "₹14,802"} sub="Across 1 card" />
            </div>

            <div className="mt-3 flex gap-3 overflow-x-auto scroll-area" style={{ scrollSnapType: "x mandatory", paddingLeft: 16, paddingRight: 16, scrollPaddingLeft: 16 }}>
              {cards.map(c => <CreditCardTile key={c.id} c={c} onPay={() => app.toast(`Opening UPI to pay ${c.due}`)} />)}
            </div>

            <div className="px-4 mt-4">
              <div className="flex items-center justify-between">
                <div style={{ fontSize: 16, fontWeight: 700 }}>Recent Transactions</div>
                <button onClick={() => setFilterOpen(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: "var(--brand-soft)", color: "var(--brand)", fontSize: 12, fontWeight: 600 }}>
                  <Icon name="calendar" size={12} color="#5B2EE0" /> {month}
                </button>
              </div>

              <div className="flex gap-2 overflow-x-auto scroll-area mt-2">
                <FilterChip active={activeCardFilter === "all"} onClick={() => setActiveCardFilter("all")}><span className="flex items-center gap-1.5"><Icon name="credit-card" size={11} color={activeCardFilter==='all' ? "#fff" : "#6B7280"}/>All cards</span></FilterChip>
                {cards.map(c => (
                  <FilterChip key={c.id} active={activeCardFilter === c.id} onClick={() => setActiveCardFilter(c.id)}>
                    <span className="flex items-center gap-1.5">
                      <span style={{width:8,height:8,background:c.color,borderRadius:2,display:"inline-block"}}/>
                      {c.bank.split(" ")[0]} · xx{c.last4.slice(-2)}
                    </span>
                  </FilterChip>
                ))}
              </div>

              <div className="card mt-3 p-3 flex items-start gap-2" style={{ background: "#F6F3FE" }}>
                <Icon name="info" size={14} color="#5B2EE0" />
                <div className="ink-2" style={{ fontSize: 12 }}>SMS transactions refreshed <span style={{ fontWeight: 700 }}>just now</span>. UPI transactions are up to date.</div>
              </div>

              <div className="card mt-3 divide-y" style={{ borderColor: "var(--border)" }}>
                {MOCK.creditTxns.map((t, i) => (
                  <div key={i} className="flex items-center px-4 py-3 gap-3">
                    <div className="rounded-full flex items-center justify-center" style={{ width: 36, height: 36, background: t.color, color: "#fff", fontSize: 11, fontWeight: 700 }}>{t.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate" style={{ fontSize: 13, fontWeight: 600 }}>{t.party}</div>
                      <div className="ink-3" style={{ fontSize: 11 }}>{t.card} · {t.date}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <Masked style={{ fontSize: 14, fontWeight: 600 }}>{t.amount}</Masked>
                      <div className="ink-3 mt-0.5" style={{ fontSize: 10 }}>{t.src}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <CreditScoreTab isFamily={isFamily} activeMember={activeMember} setActiveMember={setActiveMember} />
        )}
      </div>
      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} month={month} setMonth={setMonth} />
      <BottomNav active="credit" />
    </div>
  );
};

// -------------------------------------------------------------------------
// Credit Score tab content
// -------------------------------------------------------------------------
const CreditScoreTab = ({ isFamily, activeMember, setActiveMember }) => {
  const app = useApp();
  const data = isFamily ? MOCK.creditScoreFamily.find(m => m.id === activeMember) : MOCK.creditScore;
  const score = isFamily ? data.score : MOCK.creditScore.score;
  const cat = isFamily ? data.category : MOCK.creditScore.category;
  const change = isFamily ? data.change : `${MOCK.creditScore.change} this month`;

  const [openFAQ, setOpenFAQ] = useStateM(null);
  const FAQs = [
    { q: "What is a CIBIL score?", a: "A 3-digit number between 300 and 900 representing your creditworthiness, calculated by TransUnion CIBIL based on your credit history." },
    { q: "How is my CIBIL score calculated?", a: "Based on your payment history (35%), credit utilisation (30%), age of accounts (15%), credit mix (10%), and new credit (10%)." },
    { q: "How often does my score update?", a: "Famli refreshes scores monthly. Lenders typically report to bureaus within 30–45 days of any change." },
    { q: "Will checking my score lower it?", a: "No. A soft inquiry through Famli is a self-check and does not impact your score." },
  ];

  return (
    <>
      {isFamily && (
        <div className="px-4 pt-3 flex gap-2 overflow-x-auto scroll-area">
          {MOCK.creditScoreFamily.map(m => (
            <button key={m.id} onClick={() => setActiveMember(m.id)} className="shrink-0 flex items-center gap-1.5" style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: activeMember === m.id ? "1px solid var(--brand)" : "1px solid var(--border)",
              background: activeMember === m.id ? "var(--brand)" : "#fff",
              color: activeMember === m.id ? "#fff" : "var(--ink-2)",
              fontSize: 12, fontWeight: 600,
            }}>{m.relation}</button>
          ))}
        </div>
      )}

      <div className="px-4 mt-3">
        <div className="card p-5 text-center">
          {isFamily && <div className="ink-2 mb-1" style={{ fontSize: 13 }}>{data.name}</div>}
          <div className="ink-2" style={{ fontSize: 12 }}>Your CIBIL Score</div>
          <div className="my-2 flex items-baseline justify-center gap-2">
            <Masked style={{ fontSize: 48, fontWeight: 800, color: "var(--brand)" }}>{score}</Masked>
            <span className="ink-3" style={{ fontSize: 13 }}>/ 900</span>
          </div>
          <ScoreBar score={score} />
          <div className="flex items-center justify-center gap-2 mt-3">
            <Tag kind="success">{cat}</Tag>
            <span className="ink-2" style={{ fontSize: 12 }}>{change}</span>
          </div>
          <div className="ink-3 mt-2" style={{ fontSize: 10 }}>Last refreshed: 05 Feb, 2026</div>
        </div>
      </div>

      <div className="px-4 mt-3">
        <div style={{ fontSize: 16, fontWeight: 700 }}>Report Summary</div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <SummaryStat icon="check-circle-2" color="#16A34A" label="On-time payments" value="98%" />
          <SummaryStat icon="percent" color="#D97706" label="Credit utilisation" value="34%" />
          <SummaryStat icon="layers" color="#5B2EE0" label="Active accounts" value="6" />
          <SummaryStat icon="hourglass" color="#0EA5E9" label="Account age" value="11 yrs" />
        </div>
        <div className="card mt-3 p-4">
          <div style={{ fontSize: 14, fontWeight: 700 }}>What's helping your score</div>
          <ul className="mt-2 space-y-1.5">
            <li className="flex items-start gap-2" style={{ fontSize: 12, color: "var(--ink-2)" }}>
              <Icon name="check" size={12} color="#16A34A" stroke={3} /> 98% on-time payment history across all credit cards.
            </li>
            <li className="flex items-start gap-2" style={{ fontSize: 12, color: "var(--ink-2)" }}>
              <Icon name="check" size={12} color="#16A34A" stroke={3} /> Long account age (11 years) shows credit experience.
            </li>
            <li className="flex items-start gap-2" style={{ fontSize: 12, color: "var(--ink-2)" }}>
              <Icon name="alert-triangle" size={12} color="#D97706" /> Utilisation is at 34% — try keeping under 30%.
            </li>
          </ul>
        </div>
      </div>

      <div className="px-4 mt-4">
        <div style={{ fontSize: 16, fontWeight: 700 }}>FAQs</div>
        <div className="card mt-2 divide-y" style={{ borderColor: "var(--border)" }}>
          {FAQs.map((f, i) => (
            <div key={i}>
              <button onClick={() => setOpenFAQ(o => o === i ? null : i)} className="flex items-center justify-between w-full px-4 py-3 text-left gap-2">
                <span style={{ fontSize: 13, fontWeight: 600 }}>{f.q}</span>
                <Icon name={openFAQ === i ? "chevron-down" : "chevron-right"} size={16} color="#9CA3AF" />
              </button>
              {openFAQ === i && <div className="fade-in ink-2 px-4 pb-3" style={{ fontSize: 12, lineHeight: 1.5 }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const SummaryStat = ({ icon, color, label, value }) => (
  <div className="card p-3 flex items-center gap-2">
    <div className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32, background: `${color}1A` }}>
      <Icon name={icon} size={16} color={color} />
    </div>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>{value}</div>
      <div className="ink-3" style={{ fontSize: 10 }}>{label}</div>
    </div>
  </div>
);

const Tile = ({ label, value, sub }) => (
  <div className="card p-3">
    <div className="ink-2" style={{ fontSize: 11 }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{value}</div>
    <div className="ink-3" style={{ fontSize: 11 }}>{sub}</div>
  </div>
);

const CreditCardTile = ({ c, onPay }) => (
  <div className="shrink-0" style={{ width: 280, scrollSnapAlign: "start" }}>
    <div className="rounded-2xl p-4 text-white overflow-hidden relative" style={{ background: `linear-gradient(135deg, ${c.color} 0%, ${shade(c.color, -22)} 100%)`, height: 160 }}>
      <div className="flex items-center justify-between">
        <div style={{ fontWeight: 800, fontSize: 11, letterSpacing: 0.4 }}>{c.bank}</div>
        <div className="flex items-center gap-1.5">
          {c.owner && <Avatar initial={c.owner.initial} color={c.owner.color} size={18} />}
          <div style={{ fontSize: 10, opacity: 0.85, fontStyle: "italic", fontWeight: 700 }}>{c.network}</div>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2">
        <div style={{ width: 28, height: 22, background: "linear-gradient(135deg, #f5cf6b, #c69234)", borderRadius: 4 }} />
        <div style={{ width: 18, height: 14, background: "rgba(255,255,255,0.18)", borderRadius: 2 }} />
      </div>
      <div className="mt-3 flex gap-2" style={{ fontSize: 14, letterSpacing: 2, fontWeight: 600 }}>
        <span>xxxx</span><span>xxxx</span><span>xxxx</span><span>{c.last4.slice(-4, -2)}{c.last4.slice(-2)}</span>
      </div>
      <div className="absolute bottom-3 right-3 flex items-center gap-1" style={{ fontSize: 10, opacity: 0.7 }}>
        <Icon name="wifi" size={12} color="#fff" />
      </div>
    </div>
    <div className="card mt-2 p-3 flex items-center justify-between" style={{ paddingLeft: 16 }}>
      <div>
        <div className="ink-3" style={{ fontSize: 10 }}>Amount due</div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{c.due}</div>
      </div>
      <div>
        <div className="ink-3" style={{ fontSize: 10 }}>Unbilled</div>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{c.unbilled}</div>
      </div>
      {c.due !== "₹0" ? (
        <button onClick={onPay} className="px-3 py-1.5 text-white flex items-center gap-1" style={{ background: "var(--brand)", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>
          <Icon name="zap" size={12} color="#fff" /> Pay
        </button>
      ) : (
        <button onClick={onPay} className="px-3 py-1.5" style={{ background: "#111", color: "#fff", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Add</button>
      )}
    </div>
  </div>
);

const shade = (hex, amt) => {
  const n = parseInt(hex.slice(1), 16);
  let r = ((n >> 16) & 0xff) + amt, g = ((n >> 8) & 0xff) + amt, b = (n & 0xff) + amt;
  r = Math.min(255, Math.max(0, r)); g = Math.min(255, Math.max(0, g)); b = Math.min(255, Math.max(0, b));
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
};

// -------------------------------------------------------------------------
// S9: AI Assistant — Buddy
// -------------------------------------------------------------------------
const AIAssistant = () => {
  const app = useApp();
  const [msgs, setMsgs] = useStateM([]); // empty -> shows landing
  const [input, setInput] = useStateM("");
  const [typing, setTyping] = useStateM(false);
  const scrollRef = useRefM(null);

  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: "user", text };
    setMsgs(m => [...m, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, mockAiReply(text)]);
    }, 900);
  };

  useEffectM(() => {
    scrollRef.current && (scrollRef.current.scrollTop = scrollRef.current.scrollHeight);
  }, [msgs, typing]);

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#FFFFFF" }}>
      <SubHeader title="Buddy" right={
        <div className="flex items-center gap-2">
          <button onClick={() => setMsgs([])} className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }}><Icon name="message-square-plus" size={18} color="#fff"/></button>
          <button onClick={() => app.toast("Conversation history")} className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }}><Icon name="menu" size={20} color="#fff"/></button>
        </div>
      } />
      <div ref={scrollRef} className="scroll-area flex-1 overflow-y-auto px-4 py-4">
        {msgs.length === 0 ? (
          <div className="fade-in">
            <div className="flex items-center gap-2">
              <div className="rounded-full shimmer flex items-center justify-center" style={{ width: 36, height: 36 }}>
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2 L13.5 9.2 L20.5 11 L13.5 12.8 L12 20 L10.5 12.8 L3.5 11 L10.5 9.2 Z" fill="#fff"/></svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Hello Deepen</div>
                <div className="ink-2" style={{ fontSize: 13 }}>how can I help you today?</div>
              </div>
            </div>
            <div className="mt-4">
              <SuggestionCard
                title="Market Right Now"
                icon="bar-chart-2"
                prompts={["Latest interest rate for PPF", "Today's gold price in India", "Current FD rates across major banks"]}
                onPick={send}
              />
              <div className="mt-3">
                <SuggestionCard
                  title="Plan Your Goals"
                  icon="target"
                  prompts={["How much should I save for retirement?", "Is my SIP enough for kids' education?", "Best funds for short-term goals"]}
                  onPick={send}
                />
              </div>
              <div className="mt-3">
                <SuggestionCard
                  title="Understand Your Portfolio"
                  icon="pie-chart"
                  prompts={["Top 5 mutual funds in India", "Analyse my asset allocation", "Where am I overexposed?"]}
                  onPick={send}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {msgs.map(m => m.role === "user" ? (
              <div key={m.id} className="flex justify-end fade-in">
                <div className="px-3 py-2 rounded-2xl rounded-tr-md" style={{ background: "var(--brand-soft)", maxWidth: "85%", fontSize: 14 }}>{m.text}</div>
              </div>
            ) : (
              <div key={m.id} className="fade-in">
                <div className="rounded-full shimmer flex items-center justify-center mb-2" style={{ width: 24, height: 24 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24"><path d="M12 2 L13.5 9.2 L20.5 11 L13.5 12.8 L12 20 L10.5 12.8 L3.5 11 L10.5 9.2 Z" fill="#fff"/></svg>
                </div>
                {m.body}
                <div className="flex items-center gap-3 mt-2 ink-3">
                  <Icon name="copy" size={14} color="#9CA3AF" />
                  <Icon name="thumbs-up" size={14} color="#9CA3AF" />
                  <Icon name="thumbs-down" size={14} color="#9CA3AF" />
                  <Icon name="refresh-cw" size={14} color="#9CA3AF" />
                </div>
              </div>
            ))}
            {typing && (
              <div className="fade-in">
                <div className="typing inline-flex items-center px-3 py-2 rounded-2xl" style={{ background: "var(--brand-soft-2)" }}><span/><span/><span/></div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Composer */}
      <div className="px-4 pt-2 pb-4" style={{ background: "#fff", borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-full" style={{ border: "1px solid var(--border)" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)}
            placeholder="Ask about money, investing, or planning"
            className="flex-1 outline-none bg-transparent"
            style={{ fontSize: 13 }}
          />
          {input ? (
            <button onClick={() => send(input)} className="rounded-full flex items-center justify-center" style={{ width: 30, height: 30, background: "var(--brand)" }}>
              <Icon name="send" size={14} color="#fff" />
            </button>
          ) : (
            <button onClick={() => app.toast("Voice — coming soon")} className="rounded-full flex items-center justify-center" style={{ width: 30, height: 30, background: "var(--brand-soft)" }}>
              <Icon name="mic" size={16} color="#5B2EE0" />
            </button>
          )}
        </div>
        <div className="ink-3 text-center mt-2" style={{ fontSize: 10 }}>Designed for Research & Learning, not financial advice. <span style={{ color: "var(--brand)", textDecoration: "underline" }}>Disclaimer</span></div>
      </div>
    </div>
  );
};

const SuggestionCard = ({ title, icon, prompts, onPick }) => (
  <div className="p-3" style={{ background: "linear-gradient(135deg, var(--brand-soft-2) 0%, #FFFFFF 100%)", border: "1px solid #ECEAF6", borderRadius: 16 }}>
    <div className="flex items-center gap-2">
      <Icon name={icon} size={16} color="#5B2EE0" />
      <span style={{ color: "var(--brand)", fontWeight: 600, fontSize: 14 }}>{title}</span>
    </div>
    <div className="mt-2 space-y-1.5">
      {prompts.map(p => (
        <button key={p} onClick={() => onPick(p)} className="px-3 py-2 rounded-full text-left w-full" style={{ background: "#fff", border: "1px solid #ECEAF6", fontSize: 12, color: "var(--ink)" }}>{p}</button>
      ))}
    </div>
  </div>
);

const mockAiReply = (q) => {
  const lower = q.toLowerCase();
  if (lower.includes("top") && lower.includes("mutual")) {
    return {
      id: Date.now() + 1,
      role: "ai",
      body: (
        <div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>Here is a list of top 5 mutual funds in India ranked by 5-year performance:</div>
          <div className="mt-2 card overflow-hidden">
            <div className="grid grid-cols-[1fr_auto] px-3 py-2" style={{ background: "#F4F5F7", fontSize: 12, fontWeight: 600 }}>
              <span>Mutual Fund Scheme</span><span>Returns %</span>
            </div>
            {[["Quant Small Cap Fund","~55%"],["Quant Infrastructure Fund","~25%"],["Motilal Mid Cap fund","~15%"],["ICICI Pru Large Cap","~12%"],["Nippon India Multicap","~10%"]].map((r,i)=>(
              <div key={i} className="grid grid-cols-[1fr_auto] px-3 py-2" style={{ fontSize: 12, borderTop: "1px solid var(--border)" }}>
                <span>{r[0]}</span><span>{r[1]}</span>
              </div>
            ))}
          </div>
          <button className="mt-3 px-3 py-1.5 flex items-center gap-1" style={{ border: "1px solid var(--brand)", borderRadius: 8, color: "var(--brand)", fontSize: 12, fontWeight: 600 }}>Analyse Risk Profile <Icon name="chevron-right" size={12} color="#5B2EE0"/></button>
        </div>
      ),
    };
  }
  if (lower.includes("ppf")) {
    return { id: Date.now()+1, role: "ai", body: <div style={{ fontSize: 14, lineHeight: 1.5 }}>The current PPF interest rate is <b>7.1% p.a.</b>, set quarterly by the Government of India. It has been stable through Q2 2026.</div> };
  }
  if (lower.includes("gold")) {
    return { id: Date.now()+1, role: "ai", body: <div style={{ fontSize: 14, lineHeight: 1.5 }}>Today's 24K gold rate is <b>₹7,420 / gram</b> in major Indian cities. 22K is around ₹6,800 / gram.</div> };
  }
  if (lower.includes("retire")) {
    return { id: Date.now()+1, role: "ai", body: <div style={{ fontSize: 14, lineHeight: 1.5 }}>Based on your ₹2 L/mo lifestyle and 55 retirement age, you'd need approximately <b>₹8.5 Cr</b> by 2050. You're currently <b>Ahead</b> on this goal.</div> };
  }
  return { id: Date.now()+1, role: "ai", body: <div style={{ fontSize: 14, lineHeight: 1.5 }}>Here's what I found about <b>{q}</b>. This is a research-only assistant; please verify before acting on any number.</div> };
};

// -------------------------------------------------------------------------
// S10: Profile
// -------------------------------------------------------------------------
const Profile = () => {
  const app = useApp();
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title="Account" onBack={() => app.go("dashboard")} />
      <div className="scroll-area flex-1 overflow-y-auto pb-4">
        <div className="px-4 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full flex items-center justify-center" style={{ width: 48, height: 48, background: "var(--brand-soft)" }}>
              <Icon name="user" size={26} color="#5B2EE0" />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{MOCK.user.name}</div>
              <div className="ink-2" style={{ fontSize: 12 }}>{MOCK.user.phone}</div>
            </div>
          </div>
          <button onClick={() => app.toast("Manage profile")} style={{ color: "var(--brand)", fontWeight: 600, fontSize: 13 }}>Manage</button>
        </div>

        <Section title="Account">
          <Row icon="users" label="Family Groups" onClick={() => app.go("family-groups")} />
          <Row icon="scroll-text" label="Legacy Planning" onClick={() => app.go("will-intro")} />
          <Row icon="folder-lock" label="Documents Vault" onClick={() => app.go("documents")} />
          <Row icon="gauge" label="Risk Profile" onClick={() => app.toast("Risk Profile")} />
        </Section>

        <Section title="Activity">
          <Row icon="shield-check" label="Orders" onClick={() => app.toast("Orders")} />
          <Row icon="landmark" label="Banks" onClick={() => app.toast("Banks linked")} />
          <Row icon="star" label="Reports" onClick={() => app.toast("Reports")} />
          <Row icon="badge-check" label="KYC Details" onClick={() => app.toast("KYC Details")} />
        </Section>

        <div className="px-4 mt-3 space-y-3">
          <div className="card">
            <Row icon="settings" label="Settings" onClick={() => app.go("settings")} />
          </div>
          <div className="card">
            <Row icon="help-circle" label="Help & Support" onClick={() => app.go("help")} />
          </div>
          <div className="card">
            <Row icon="log-out" label="Logout" onClick={() => app.confirm("Log out of Famli?", () => app.toast("Logged out (mock)"))} />
          </div>
        </div>

        <div className="px-4 mt-4 flex items-center gap-1 ink-2" style={{ fontSize: 12 }}>
          <Icon name="check-circle-2" size={14} color="#6B7280" /> Your data is 100% safe and secure
        </div>

        <div className="px-4 mt-3 grid grid-cols-2 gap-3">
          <Badge icon="badge-check" title="SEBI Registered" sub="INA000021979" />
          <Badge icon="globe" title="ISO-27001" sub="Certified" />
        </div>

        <div className="px-4 mt-4 ink-3 flex items-center gap-1" style={{ fontSize: 12 }}>
          <Icon name="copyright" size={12} color="#9CA3AF" /> Made with <span style={{ color: "var(--neg)" }}>❤</span> from Pune, India
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="px-4 mt-3">
    <div className="card">
      {title && <div className="ink-3 px-4 pt-3 pb-1" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase" }}>{title}</div>}
      <div className="divide-y" style={{ borderColor: "var(--border)" }}>{children}</div>
    </div>
  </div>
);

const Row = ({ icon, label, onClick, right }) => (
  <button onClick={onClick} className="flex items-center w-full px-4 py-3 gap-3 text-left">
    <div className="flex items-center justify-center" style={{ width: 30, height: 30, color: "var(--ink-2)" }}>
      <Icon name={icon} size={20} color="#374151" />
    </div>
    <div className="flex-1" style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
    {right || <Icon name="chevron-right" size={16} color="#9CA3AF" />}
  </button>
);

const Badge = ({ icon, title, sub }) => (
  <div className="card p-3 flex items-center gap-2">
    <Icon name={icon} size={20} color="#5B2EE0" />
    <div>
      <div style={{ fontSize: 12, fontWeight: 700 }}>{title}</div>
      <div className="ink-3" style={{ fontSize: 11 }}>{sub}</div>
    </div>
  </div>
);

// -------------------------------------------------------------------------
// S11: Settings
// -------------------------------------------------------------------------
const Settings = () => {
  const app = useApp();
  const [push, setPush] = useStateM(false);
  const [wa, setWa] = useStateM(true);
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title="Settings" />
      <div className="scroll-area flex-1 overflow-y-auto pb-4">
        <Section title="App Preferences">
          <Row icon="shield" label="Privacy Policy" onClick={() => app.toast("Privacy Policy")} />
          <Row icon="alert-circle" label="Terms of Use" onClick={() => app.toast("Terms of Use")} />
          <Row icon="star" label="Share Feedback" onClick={() => app.toast("Share Feedback")} />
          <Row icon="moon" label="Theme" onClick={() => app.toast("Theme — Light / Dark / System")} />
          <Row icon="map" label="App Tour" onClick={() => app.toast("Starting app tour…")} />
        </Section>
        <Section title="Security">
          <Row icon="fingerprint" label="Enable Biometric" onClick={() => app.toast("Biometric enabled")} />
          <Row icon="smartphone" label="Change Pin" onClick={() => app.toast("Change pin flow")} />
        </Section>
        <Section title="Notifications">
          <Row icon="bell" label="Push Notifications" onClick={() => setPush(p => !p)} right={<Switch on={push} />} />
          <Row icon="message-circle" label="Whatsapp Notifications" onClick={() => setWa(p => !p)} right={<Switch on={wa} />} />
        </Section>
        <div className="px-4 mt-4">
          <button onClick={() => app.confirm("Permanently delete your account?", () => app.toast("Account deletion requested"))} style={{ color: "var(--brand)", fontWeight: 600, fontSize: 14 }}>Delete Account Permanently</button>
          <div className="ink-3 mt-2" style={{ fontSize: 12 }}>Famli App v2.7.9</div>
        </div>
      </div>
    </div>
  );
};

const Switch = ({ on }) => (
  <div style={{
    width: 36, height: 20, borderRadius: 999,
    background: on ? "var(--brand)" : "#D1D5DB",
    position: "relative",
    transition: "background 200ms",
  }}>
    <div style={{ position: "absolute", top: 2, left: on ? 18 : 2, width: 16, height: 16, background: "#fff", borderRadius: "50%", transition: "left 200ms" }} />
  </div>
);

// -------------------------------------------------------------------------
// S12: Help & Support
// -------------------------------------------------------------------------
const HelpSupport = () => {
  const app = useApp();
  const [open, setOpen] = useStateM(null);
  const faqs = [
    { key: "about", q: "About Famli", a: "Famli is a family wealth management app to help Indian families consolidate, track and grow wealth across generations." },
    { key: "start", q: "Getting Started", a: "Add your bank accounts, mutual funds, and assets. We auto-fetch transactions and build your net worth in minutes." },
    { key: "data", q: "Data & Security", a: "Your data is encrypted at rest and in transit. We're ISO-27001 certified and SEBI registered." },
    { key: "app", q: "App Usage", a: "Use the bottom nav to switch between Home, Wealth, Goals, Transactions and Credit. Tap the sparkle to chat with Buddy." },
    { key: "feat", q: "Features", a: "Net worth tracking, family goals, AI assistant, credit card spends, and SIP tracking are all included." },
    { key: "pri", q: "Pricing & Access", a: "Famli is free for basic use. Premium plans unlock unlimited family members and advanced reports." },
    { key: "sup", q: "Support", a: "Reach our team via email, phone, or WhatsApp. We respond within 48 hours." },
  ];
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title="Help & Support" />
      <div className="scroll-area flex-1 overflow-y-auto pb-4">
        <div className="px-4 pt-4">
          <div style={{ fontSize: 18, fontWeight: 700 }}>FAQ's</div>
          <div className="card mt-2 flex items-center gap-2 px-3 py-2.5">
            <Icon name="search" size={16} color="#9CA3AF" />
            <input placeholder="Search" className="flex-1 outline-none bg-transparent" style={{ fontSize: 13 }} />
          </div>
          <div className="mt-3 divide-y" style={{ borderColor: "var(--border)" }}>
            {faqs.map(f => (
              <div key={f.key}>
                <button onClick={() => setOpen(o => o === f.key ? null : f.key)} className="flex items-center justify-between w-full py-3 text-left">
                  <span style={{ fontSize: 15, fontWeight: 500 }}>{f.q}</span>
                  <Icon name={open === f.key ? "chevron-down" : "chevron-right"} size={16} color="#9CA3AF" />
                </button>
                {open === f.key && (
                  <div className="fade-in ink-2 pb-3" style={{ fontSize: 13, lineHeight: 1.5 }}>{f.a}</div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5" style={{ fontSize: 18, fontWeight: 700 }}>Need Help?</div>
          <div className="card mt-2 divide-y" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-start gap-3 px-4 py-3">
              <Icon name="clock" size={20} color="#374151" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Contact Us</div>
                <div className="ink-2" style={{ fontSize: 12, lineHeight: 1.45 }}>We respond to all queries within 48 hours. Thank you for your patience.</div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Icon name="mail" size={20} color="#374151" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Email</div>
                <div style={{ color: "var(--brand)", fontSize: 12, textDecoration: "underline" }}>support@famli.life</div>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-3 px-4 py-3">
                <Icon name="phone" size={20} color="#374151" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>Phone</div>
                  <div className="ink-2" style={{ fontSize: 12 }}>+91 99607 11153</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3" style={{ borderLeft: "1px solid var(--border)" }}>
                <Icon name="message-circle" size={20} color="#374151" />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>WhatsApp</div>
                  <div className="ink-2" style={{ fontSize: 12 }}>+91 99607 11153</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// S13: Profile Switch sheet
// -------------------------------------------------------------------------
const ProfileSwitchSheet = ({ open, onClose }) => {
  const app = useApp();
  if (!open) return null;
  const profiles = [
    { name: "Deepen", value: "₹45,00,000", isMe: true, profile: "Myself" },
    { name: "Mehta Family", value: "₹2.3 Cr", isMe: false, profile: "Mehta Family" },
  ];
  return (
    <div className="absolute inset-0" style={{ zIndex: 50 }}>
      <div className="backdrop-in absolute inset-0" onClick={onClose} style={{ background: "rgba(40,42,60,0.55)" }} />
      <div className="sheet-in absolute left-0 right-0 bottom-0 bg-white" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" }}>
        <div className="flex justify-center pt-2 pb-1">
          <div style={{ width: 44, height: 4, background: "#E5E7EB", borderRadius: 2 }} />
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <div style={{ fontSize: 17, fontWeight: 700 }}>Switch Profile</div>
          <button onClick={onClose} className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28 }}><Icon name="x" size={18} color="#111"/></button>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {profiles.map(p => (
            <button key={p.name} onClick={() => { app.setProfile(p.profile); onClose(); app.toast(`Switched to ${p.name}`); }} className="flex items-center w-full px-4 py-3 gap-3 text-left">
              <Avatar initial={p.name[0]} color={p.isMe ? "#5B2EE0" : "#E91E63"} size={38} />
              <div className="flex-1">
                <div style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                <div className="ink-3" style={{ fontSize: 12 }}>{p.value}</div>
              </div>
              <Icon name="chevron-right" size={16} color="#9CA3AF" />
            </button>
          ))}
          <button onClick={() => { onClose(); app.go("family-group-create"); }} className="flex items-center w-full px-4 py-4 gap-3 text-left">
            <div className="rounded-full flex items-center justify-center" style={{ width: 38, height: 38, border: "1.5px dashed var(--brand)", color: "var(--brand)" }}>
              <Icon name="plus" size={20} color="#5B2EE0" />
            </div>
            <div className="flex-1">
              <div style={{ fontSize: 15, fontWeight: 600 }}>Add a Family Group</div>
              <div className="ink-3" style={{ fontSize: 12 }}>Get a Shared Financial View</div>
            </div>
            <Icon name="chevron-right" size={16} color="#9CA3AF" />
          </button>
        </div>
        <div style={{ height: 12 }} />
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// Confirm modal (used for logout / delete)
// -------------------------------------------------------------------------
const ConfirmModal = ({ open, message, onYes, onNo }) => {
  if (!open) return null;
  return (
    <div className="absolute inset-0" style={{ zIndex: 60 }}>
      <div className="backdrop-in absolute inset-0" onClick={onNo} style={{ background: "rgba(40,42,60,0.55)" }} />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="fade-in bg-white p-5 w-full" style={{ borderRadius: 18, maxWidth: 320 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{message}</div>
          <div className="flex gap-2 mt-4">
            <button onClick={onNo} className="flex-1 py-2.5" style={{ border: "1px solid var(--border)", borderRadius: 10, fontSize: 14, fontWeight: 500 }}>Cancel</button>
            <button onClick={onYes} className="flex-1 py-2.5 text-white" style={{ background: "var(--brand)", borderRadius: 10, fontSize: 14, fontWeight: 600 }}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Transactions, Credit, AIAssistant, Profile, Settings, HelpSupport, ProfileSwitchSheet, ConfirmModal });
