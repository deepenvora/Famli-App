// =========================================================================
// screens-extras.jsx — Family Group, Notifications, Advisory, Documents
// =========================================================================

const { useState: useStateE } = React;

// =========================================================================
// Family Group List — persisted with mock + user-added groups
// =========================================================================
const useFamilyGroups = () => {
  if (!window.__famliFamilyGroups) {
    window.__famliFamilyGroups = [...MOCK.familyGroups];
  }
  return {
    groups: window.__famliFamilyGroups,
    add: (g) => { window.__famliFamilyGroups = [...window.__famliFamilyGroups, g]; },
    get: () => window.__famliFamilyGroups,
  };
};

function FamilyGroupList() {
  const app = useApp();
  const store = useFamilyGroups();
  const [, force] = useStateE(0);
  // re-read on mount so newly created groups show up
  React.useEffect(() => { force(n => n + 1); }, []);
  const groups = store.get();

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title="Family Groups" right={
        <div className="flex items-center gap-2">
          <IconBtn onClick={() => app.setMasked(m => !m)}><Icon name={app.masked ? "eye-off" : "eye"} size={18} color="#fff"/></IconBtn>
          <IconBtn onClick={() => app.go("family-group-create")}><Icon name="plus" size={18} color="#fff"/></IconBtn>
        </div>
      } />
      <div className="scroll-area flex-1 overflow-y-auto pb-24">
        <div className="px-4 pt-3 card divide-y" style={{ borderColor: "var(--border)" }}>
          {groups.map(g => (
            <button key={g.id} onClick={() => app.go("family-group-detail", { groupId: g.id })} className="flex items-center w-full px-4 py-3 gap-3 text-left">
              <FamilyGroupAvatar group={g} size={44} />
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 15, fontWeight: 700 }}>{g.name}</div>
                <div className="flex items-center gap-1 mt-1">
                  <AvatarStack items={g.members} size={18} />
                  {g.extra > 0 && <div className="rounded-full flex items-center justify-center" style={{ width: 18, height: 18, marginLeft: -6, background: "#0EA5E9", border: "2px solid #fff", color: "#fff", fontSize: 9, fontWeight: 700 }}>+{g.extra}</div>}
                </div>
              </div>
              <div className="text-right">
                <Masked style={{ fontSize: 15, fontWeight: 700 }}>{g.value}</Masked>
              </div>
              <Icon name="chevron-right" size={16} color="#9CA3AF" />
            </button>
          ))}
        </div>
        <div className="px-4 mt-4">
          <div className="ink-2" style={{ fontSize: 13 }}>Invite family members and stay aligned on finances.</div>
          <button onClick={() => app.go("family-group-create")} className="mt-2 flex items-center gap-2 px-4 py-2.5 text-white" style={{ background: "var(--brand)", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
            <Icon name="plus" size={14} color="#fff" stroke={2.4} /> Add Family Group
          </button>
        </div>
      </div>
    </div>
  );
}

const FamilyGroupAvatar = ({ group, size = 44 }) => {
  if (group.photo) {
    return (
      <div className="rounded-full overflow-hidden shrink-0" style={{ width: size, height: size, background: group.photo, backgroundSize: "cover", backgroundPosition: "center" }} />
    );
  }
  return (
    <div className="flex items-center justify-center shrink-0" style={{ width: size, height: size, background: group.color || "#FCE7C2", borderRadius: "50%", fontWeight: 700, fontSize: size * 0.4, color: "#9A5A00" }}>{group.initial}</div>
  );
};

// =========================================================================
// Family Group Detail — tabs: All / Members / Assets / Liabilities / Insurance
// =========================================================================
function FamilyGroupDetail() {
  const app = useApp();
  const groupId = app.params.groupId || "agarwal";
  const g = MOCK.familyGroups.find(x => x.id === groupId) || MOCK.familyGroups[0];
  const [tab, setTab] = useStateE("all");

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="header-grad" style={{ paddingBottom: 0 }}>
        <StatusBar dark={false} />
        <div className="flex items-center justify-between px-4 pt-2 pb-3">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => app.back()} className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }}>
              <Icon name="arrow-left" size={22} color="#fff" stroke={2.2} />
            </button>
            <div className="flex items-center justify-center shrink-0" style={{ width: 36, height: 36, background: g.color || "#FCE7C2", borderRadius: "50%", fontWeight: 700, color: "#9A5A00", backgroundImage: g.photo || "none", backgroundSize: "cover", backgroundPosition: "center" }}>{g.photo ? "" : g.initial}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{g.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{MOCK.familyMembersDetail.length} members</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <IconBtn onClick={() => app.toast("Add member")}><Icon name="user-plus" size={18} color="#fff"/></IconBtn>
            <IconBtn onClick={() => app.toast("Options")}><Icon name="more-horizontal" size={18} color="#fff"/></IconBtn>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          {["all","members","assets","liabilities","insurance"].map(t => (
            <button key={t} onClick={() => setTab(t)} className="flex-1 py-3 text-center" style={{
              color: tab === t ? "#fff" : "rgba(255,255,255,0.7)",
              fontWeight: tab === t ? 700 : 500,
              fontSize: 12,
              borderBottom: tab === t ? "3px solid #fff" : "3px solid transparent",
              textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div className="scroll-area flex-1 overflow-y-auto pb-4">
        {tab === "all" && <AllTab />}
        {tab === "members" && <MembersTab onMember={(m) => app.go("member-detail", { memberId: m.id })} />}
        {tab === "assets" && <SimpleTabContent title="Assets" rows={MOCK.assetCategories.slice(0,5)} />}
        {tab === "liabilities" && <LiabilityList />}
        {tab === "insurance" && <SimpleTabContent title="Family Insurance" rows={MOCK.insuranceFamily} />}
      </div>
    </div>
  );
}

function AllTab() {
  const app = useApp();
  return (
    <>
      <div className="px-4 pt-3 grid grid-cols-1 gap-3">
        <button onClick={() => app.toast("Net worth detail")} className="card flex items-center justify-between p-4 text-left">
          <div>
            <div className="ink-2" style={{ fontSize: 12 }}>Net Worth</div>
            <Masked style={{ fontSize: 22, fontWeight: 700 }}>₹32,10,45,000</Masked>
          </div>
          <Icon name="chevron-right" size={18} color="#9CA3AF" />
        </button>
        <div className="grid grid-cols-2 gap-3">
          <SmallTile label="Assets" value="₹35.56 Cr" onClick={() => app.toast("Assets breakdown")} />
          <SmallTile label="Liabilities" value="₹15.21 L" onClick={() => app.toast("Liabilities breakdown")} />
          <SmallTile label="Goals" value="8" suffix="goals" onClick={() => app.go("goals")} />
          <SmallTile label="Insurance" value="4" suffix="policies" onClick={() => app.toast("Insurance list")} />
        </div>
      </div>
      <div className="px-4 mt-4">
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Members</div>
        <MembersTab embedded onMember={(m) => app.go("member-detail", { memberId: m.id })} />
      </div>
    </>
  );
}

const SmallTile = ({ label, value, suffix, onClick }) => (
  <button onClick={onClick} className="card p-3 flex flex-col justify-between text-left" style={{ minHeight: 70 }}>
    <Masked style={{ fontSize: 17, fontWeight: 700 }}>{value}</Masked>
    <div className="flex items-center justify-between mt-1">
      <span className="ink-2" style={{ fontSize: 12 }}>{suffix || label}</span>
      <Icon name="chevron-right" size={14} color="#9CA3AF" />
    </div>
  </button>
);

function MembersTab({ embedded = false, onMember }) {
  return (
    <div className={embedded ? "" : "px-4 pt-3"}>
      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {MOCK.familyMembersDetail.map(m => (
          <button key={m.id} onClick={() => onMember && onMember(m)} className="flex items-center w-full px-4 py-3 gap-3 text-left">
            <Avatar initial={m.initial} color={m.color} size={38} />
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="ink-2" style={{ fontSize: 12 }}>{m.role}</span>
                {m.status && <StatusChip status={m.status} />}
              </div>
            </div>
            <Icon name="chevron-right" size={16} color="#9CA3AF" />
          </button>
        ))}
      </div>
    </div>
  );
}

const StatusChip = ({ status }) => {
  const map = {
    Pending: { bg: "#FFEDD5", fg: "#9A5A00", icon: "loader" },
    Added: { bg: "#DCFCE7", fg: "#15803D", icon: "check-circle-2" },
    Declined: { bg: "#FEE2E2", fg: "#B91C1C", icon: "x-circle" },
    Expired: { bg: "#FEE2E2", fg: "#B91C1C", icon: "hourglass" },
    Revoked: { bg: "#FEE2E2", fg: "#B91C1C", icon: "rotate-ccw" },
  };
  const t = map[status] || map.Pending;
  return (
    <span className="flex items-center gap-1 chip" style={{ background: t.bg, color: t.fg, padding: "2px 7px" }}>
      <Icon name={t.icon} size={10} color={t.fg} /> {status}
    </span>
  );
};

function SimpleTabContent({ title, rows }) {
  const app = useApp();
  return (
    <div className="px-4 pt-3">
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {rows.map((r, i) => (
          <button key={i} onClick={() => app.toast(`${r.label || r.name} detail`)} className="flex items-center w-full px-4 py-3 gap-3 text-left">
            <IconCircle icon={r.icon || "circle"} />
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 14, fontWeight: 600 }}>{r.label || r.name}</div>
              <div className="ink-3 truncate" style={{ fontSize: 11 }}>{r.policy || r.alloc || ""}</div>
              {r.owners && <div className="mt-1"><AvatarStack items={r.owners} size={16}/></div>}
            </div>
            <Masked style={{ fontSize: 14, fontWeight: 700 }}>{r.sumAssured || r.value}</Masked>
          </button>
        ))}
      </div>
    </div>
  );
}

function LiabilityList() {
  return (
    <div className="px-4 pt-3">
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Family Liabilities</div>
      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {MOCK.liabilities.map((l, i) => (
          <div key={i} className="flex items-center px-4 py-3 gap-3">
            <IconCircle icon={l.icon} bg="#FFE9E5" color="#B43D2A" />
            <div className="flex-1"><div style={{ fontSize: 14, fontWeight: 600 }}>{l.label}</div></div>
            <div className="text-right">
              <Masked style={{ fontSize: 14, fontWeight: 600 }}>{l.value}</Masked>
              <div className="ink-3" style={{ fontSize: 11 }}>{l.emi || "————"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// Member Detail — header with avatar + tabs (Groups / Assets / Liabilities)
// =========================================================================
function MemberDetail() {
  const app = useApp();
  const memberId = app.params.memberId || "rakesh";
  const m = MOCK.familyMembersDetail.find(x => x.id === memberId) || MOCK.familyMembersDetail[0];
  const [tab, setTab] = useStateE("groups");

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <div className="header-grad" style={{ paddingBottom: 0 }}>
        <StatusBar dark={false} />
        <div className="flex items-center justify-between px-4 pt-2 pb-1">
          <button onClick={() => app.back()} className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }}>
            <Icon name="arrow-left" size={22} color="#fff" stroke={2.2} />
          </button>
          <div className="flex items-center gap-2">
            <IconBtn onClick={() => app.toast("Add to group")}><Icon name="user-plus" size={18} color="#fff"/></IconBtn>
            <IconBtn onClick={() => app.toast("Options")}><Icon name="more-horizontal" size={18} color="#fff"/></IconBtn>
          </div>
        </div>
        <div className="flex flex-col items-center pb-4 pt-2">
          <div className="rounded-full flex items-center justify-center" style={{ width: 90, height: 90, background: m.color, color: "#fff", fontWeight: 700, fontSize: 36, border: "3px solid #fff" }}>{m.initial}</div>
          <div style={{ color: "#fff", fontSize: 19, fontWeight: 700, marginTop: 8 }}>{m.name}</div>
          <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 12 }}>{m.phone}</div>
        </div>
        <div className="flex" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          {[["groups","Groups"],["assets","Assets"],["liab","Liabilities"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className="flex-1 py-3 text-center" style={{
              color: tab === k ? "#fff" : "rgba(255,255,255,0.7)",
              fontWeight: tab === k ? 700 : 500,
              fontSize: 13,
              borderBottom: tab === k ? "3px solid #fff" : "3px solid transparent",
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div className="scroll-area flex-1 overflow-y-auto pb-4">
        {tab === "groups" && (
          <div className="px-4 pt-3">
            <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
              {MOCK.familyGroups.map(g => (
                <button key={g.id} onClick={() => app.go("family-group-detail", { groupId: g.id })} className="flex items-center w-full px-4 py-3 gap-3 text-left">
                  <div className="flex items-center justify-center shrink-0" style={{ width: 38, height: 38, background: g.color, borderRadius: "50%", fontWeight: 700, color: "#9A5A00" }}>{g.initial}</div>
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{g.name}</div>
                    <div className="flex items-center gap-1 mt-1"><AvatarStack items={g.members} size={16} />{g.extra > 0 && <div className="rounded-full flex items-center justify-center" style={{ width: 16, height: 16, marginLeft: -6, background: "#0EA5E9", border: "2px solid #fff", color: "#fff", fontSize: 8, fontWeight: 700 }}>+{g.extra}</div>}</div>
                  </div>
                  <Icon name="chevron-right" size={16} color="#9CA3AF" />
                </button>
              ))}
            </div>
          </div>
        )}
        {tab === "assets" && <SimpleTabContent title={`${m.name}'s Assets`} rows={MOCK.assetCategories.slice(0, 4)} />}
        {tab === "liab" && <LiabilityList />}
      </div>
    </div>
  );
}

// =========================================================================
// Notifications
// =========================================================================
function Notifications() {
  const app = useApp();
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title="Notifications" right={<button onClick={() => app.toast("Marked all as read")} style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>Mark all read</button>} />
      <div className="scroll-area flex-1 overflow-y-auto pb-4">
        <div className="px-4 pt-3 space-y-2">
          {MOCK.notifications.map(n => (
            <div key={n.id} className="card p-3 flex gap-3" style={{ background: n.unread ? "#fff" : "#FAFAFB" }}>
              <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: 38, height: 38, background: `${n.color}1A` }}>
                <Icon name={n.icon} size={18} color={n.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{n.title}</span>
                    {n.unread && <span style={{ width: 6, height: 6, background: "var(--brand)", borderRadius: 999 }} />}
                  </div>
                  <span className="ink-3" style={{ fontSize: 10 }}>{n.time}</span>
                </div>
                <div className="ink-2 mt-0.5" style={{ fontSize: 12, lineHeight: 1.45 }}>{n.body}</div>
                {n.actions && (
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => app.toast("Invite accepted")} className="px-3 py-1.5 text-white" style={{ background: "var(--brand)", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Accept</button>
                    <button onClick={() => app.toast("Invite declined")} className="px-3 py-1.5" style={{ border: "1px solid var(--border)", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Decline</button>
                  </div>
                )}
                {n.kind === "due" && <button onClick={() => app.go("credit")} className="mt-2 px-3 py-1.5 text-white" style={{ background: "var(--brand)", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Pay now</button>}
                {n.kind === "kyc" && <button onClick={() => app.toast("Resolving KYC")} className="mt-2 px-3 py-1.5" style={{ border: "1px solid var(--brand)", color: "var(--brand)", borderRadius: 8, fontSize: 12, fontWeight: 600 }}>Resolve</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// Advisory — landing with Free vs Paid plans, FAQs, subscribe
// =========================================================================
function Advisory() {
  const app = useApp();
  const [plan, setPlan] = useStateE("paid");
  const [openFAQ, setOpenFAQ] = useStateE(null);
  const FAQs = [
    { q: "What's included in the free plan?", a: "Net worth tracking, family goals, basic insurance and document storage." },
    { q: "What does the advisory plan add?", a: "1-on-1 financial planning, SEBI-registered advisor calls, tax review, and unlimited family members." },
    { q: "Can I cancel anytime?", a: "Yes. Subscriptions are monthly and cancellable in-app — no lock-in." },
    { q: "Who are the advisors?", a: "SEBI-registered investment advisors (RIA) with 5+ years of experience in personal finance and tax." },
  ];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title="Advisory" />
      <div className="scroll-area flex-1 overflow-y-auto pb-28">
        <div className="px-4 pt-3">
          <div className="card p-4 overflow-hidden relative" style={{ background: "linear-gradient(135deg, #5B2EE0 0%, #2D1280 100%)", color: "#fff" }}>
            <div className="flex items-center gap-2" style={{ fontSize: 12, opacity: 0.9 }}>
              <Icon name="sparkles" size={14} color="#fff" /> NEW · Famli Advisory
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, marginTop: 6, lineHeight: 1.25 }}>Talk to a SEBI-registered advisor in 30 seconds</div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 6 }}>Personal planning, tax strategy and goal coaching — for the whole family.</div>
          </div>
        </div>

        <div className="px-4 mt-4">
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Choose your plan</div>
          <div className="grid grid-cols-2 gap-3">
            <PlanCard active={plan === "free"} onClick={() => setPlan("free")} title="Free" price="₹0" badge="Current" features={["Net worth tracking","Family goals","2 family members","Basic reports"]} />
            <PlanCard active={plan === "paid"} onClick={() => setPlan("paid")} title="Advisory" price="₹999" suffix="/mo" badge="Best value" features={["Everything in Free","Unlimited family","Monthly advisor call","Tax review","Goal coaching","Priority support"]} highlight />
          </div>
        </div>

        <div className="px-4 mt-4">
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>FAQs</div>
          <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
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
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
        <button onClick={() => app.confirm("Subscribe to Advisory at ₹999/mo?", () => app.toast("Subscribed! Welcome to Famli Advisory"))} className="w-full py-3 text-white" style={{ background: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 15 }}>
          {plan === "paid" ? "Subscribe ₹999 / month" : "Continue with Free"}
        </button>
      </div>
    </div>
  );
}

const PlanCard = ({ active, onClick, title, price, suffix, features, highlight, badge }) => (
  <button onClick={onClick} className="text-left p-3" style={{
    background: highlight ? "linear-gradient(180deg, #F6F3FE 0%, #FFFFFF 100%)" : "#fff",
    border: active ? "1.5px solid var(--brand)" : "1px solid var(--border)",
    borderRadius: 14,
    minHeight: 220,
  }}>
    <div className="flex items-center justify-between">
      <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
      {badge && <span className="chip" style={{ background: highlight ? "var(--brand)" : "#ECECF1", color: highlight ? "#fff" : "var(--ink-2)" }}>{badge}</span>}
    </div>
    <div className="flex items-baseline gap-1 mt-2">
      <span style={{ fontSize: 22, fontWeight: 800 }}>{price}</span>
      {suffix && <span className="ink-2" style={{ fontSize: 12 }}>{suffix}</span>}
    </div>
    <div className="mt-2 space-y-1.5">
      {features.map(f => (
        <div key={f} className="flex items-start gap-1.5" style={{ fontSize: 11, color: "var(--ink-2)", lineHeight: 1.4 }}>
          <Icon name="check" size={11} color={highlight ? "#5B2EE0" : "#16A34A"} stroke={3} /> {f}
        </div>
      ))}
    </div>
  </button>
);

// =========================================================================
// Documents
// =========================================================================
function Documents() {
  const app = useApp();
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title="Documents" right={
        <div className="flex items-center gap-2">
          <IconBtn onClick={() => app.toast("Upload document")}><Icon name="plus" size={18} color="#fff"/></IconBtn>
          <IconBtn onClick={() => app.toast("Share documents")}><Icon name="share-2" size={16} color="#fff"/></IconBtn>
        </div>
      } />
      <div className="scroll-area flex-1 overflow-y-auto pb-4">
        <div className="px-4 pt-3">
          <div className="card flex items-center gap-2 px-3 py-2.5">
            <Icon name="search" size={16} color="#9CA3AF" />
            <input placeholder="Search documents" className="flex-1 outline-none bg-transparent" style={{ fontSize: 13 }} />
          </div>
        </div>
        <div className="px-4 mt-3 grid grid-cols-2 gap-3">
          {MOCK.documents.map(d => (
            <button key={d.id} onClick={() => app.go("document-detail", { docId: d.id })} className="card p-3 text-left">
              <div className="rounded-xl flex items-center justify-center" style={{ width: 38, height: 38, background: `${d.color}1A` }}>
                <Icon name={d.icon} size={20} color={d.color} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>{d.title}</div>
              <Masked style={{ fontSize: 11, color: "var(--ink-2)", marginTop: 2 }}>{d.number}</Masked>
              <div className="ink-3 mt-1" style={{ fontSize: 10 }}>{d.expiry ? `Expires ${d.expiry}` : `Updated ${d.updated}`}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// Document Detail — front/back image carousel with per-document templates
// =========================================================================
function DocumentDetail() {
  const app = useApp();
  const docId = app.params.docId || "pan";
  const d = MOCK.documents.find(x => x.id === docId) || MOCK.documents[1];
  const [side, setSide] = useStateE(0); // 0 front, 1 back
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title={d.title} right={<IconBtn onClick={() => app.toast("Share " + d.title)}><Icon name="share-2" size={16} color="#fff"/></IconBtn>} />
      <div className="scroll-area flex-1 overflow-y-auto pb-24">
        <div className="px-4 pt-4">
          <div className="card p-4">
            {/* Carousel viewport */}
            <div style={{ overflow: "hidden", borderRadius: 14 }}>
              <div className="flex" style={{ transform: `translateX(-${side * 100}%)`, transition: "transform 280ms cubic-bezier(0.2,0.8,0.2,1)" }}>
                <div className="shrink-0" style={{ width: "100%" }}><DocFace doc={d} side="front" /></div>
                <div className="shrink-0" style={{ width: "100%" }}><DocFace doc={d} side="back" /></div>
              </div>
            </div>
            {/* Carousel controls */}
            <div className="flex items-center justify-between mt-3">
              <button onClick={() => setSide(0)} className="flex items-center gap-1 px-2 py-1" style={{ color: "var(--ink-2)", fontSize: 12, fontWeight: 500, opacity: side === 0 ? 0.4 : 1 }} disabled={side === 0}>
                <Icon name="chevron-left" size={14} color="#6B7280" /> Front
              </button>
              <div className="flex items-center gap-1.5">
                {[0, 1].map(i => (
                  <button key={i} onClick={() => setSide(i)} style={{ width: i === side ? 22 : 6, height: 6, borderRadius: 3, background: i === side ? "var(--brand)" : "#D1D5DB", transition: "all 200ms ease" }} />
                ))}
                <span className="ink-3 ml-2" style={{ fontSize: 11 }}>{side === 0 ? "Front" : "Back"}</span>
              </div>
              <button onClick={() => setSide(1)} className="flex items-center gap-1 px-2 py-1" style={{ color: "var(--ink-2)", fontSize: 12, fontWeight: 500, opacity: side === 1 ? 0.4 : 1 }} disabled={side === 1}>
                Back <Icon name="chevron-right" size={14} color="#6B7280" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 mt-3">
          <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
            <Row icon="hash" label="Number" right={<Masked style={{ fontSize: 13, fontWeight: 600 }}>{d.number}</Masked>} onClick={() => app.toast("Copied")} />
            <Row icon="calendar" label="Last updated" right={<span style={{ fontSize: 13 }}>{d.updated}</span>} onClick={() => {}} />
            {d.expiry && <Row icon="hourglass" label="Expires" right={<span style={{ fontSize: 13, fontWeight: 600 }}>{d.expiry}</span>} onClick={() => {}} />}
            <Row icon="user" label="Linked to" right={<span style={{ fontSize: 13 }}>Deepen Vora</span>} onClick={() => {}} />
          </div>
        </div>

        <div className="px-4 mt-3 grid grid-cols-2 gap-3">
          <button onClick={() => app.toast(`Sharing ${d.title}`)} className="card p-3 flex items-center justify-center gap-2" style={{ fontWeight: 600, fontSize: 14, color: "var(--brand)" }}>
            <Icon name="share-2" size={16} color="#5B2EE0" /> Share
          </button>
          <button onClick={() => app.confirm(`Delete ${d.title}?`, () => { app.toast("Document deleted"); app.back(); })} className="card p-3 flex items-center justify-center gap-2" style={{ fontWeight: 600, fontSize: 14, color: "var(--neg)" }}>
            <Icon name="trash-2" size={16} color="#DC2626" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// Per-document faux face. Front & back stylistically distinct per doc type.
const DocFace = ({ doc, side }) => {
  if (doc.id === "aadhaar") return side === "front" ? <AadhaarFront /> : <AadhaarBack />;
  if (doc.id === "pan") return side === "front" ? <PANFront /> : <PANBack />;
  if (doc.id === "dl") return side === "front" ? <DLFront /> : <DLBack />;
  if (doc.id === "passport") return side === "front" ? <PassportFront /> : <PassportBack />;
  if (doc.id === "voter") return side === "front" ? <VoterFront /> : <VoterBack />;
  return <GenericFront doc={doc} />;
};

const DocShell = ({ children, bg }) => (
  <div className="relative" style={{ aspectRatio: "1.586/1", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", background: bg }}>
    {children}
  </div>
);

const PhotoBlock = ({ initial = "D", size = 50 }) => (
  <div className="flex items-center justify-center" style={{ width: size, height: size * 1.25, background: "#D1D5DB", borderRadius: 4, color: "#6B7280", fontSize: size * 0.5, fontWeight: 700 }}>{initial}</div>
);

// Aadhaar — saffron/green branding stripe
const AadhaarFront = () => (
  <DocShell bg="linear-gradient(180deg, #FFF6E5 0%, #FFFFFF 50%, #E8F5E9 100%)">
    <div className="absolute inset-0 p-3 flex flex-col" style={{ color: "#111" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#FF9933", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3" fill="#fff"/></svg>
          </div>
          <div style={{ fontWeight: 800, fontSize: 9, lineHeight: 1.1 }}>भारत सरकार<br/>GOVERNMENT OF INDIA</div>
        </div>
        <div style={{ fontWeight: 800, fontSize: 10, color: "#C2410C" }}>UIDAI</div>
      </div>
      <div className="flex items-center gap-2 mt-2 flex-1">
        <PhotoBlock initial="D" size={42} />
        <div className="flex-1">
          <div className="ink-3" style={{ fontSize: 8 }}>नाम / Name</div>
          <div style={{ fontSize: 11, fontWeight: 700 }}>Deepen Vora</div>
          <div className="ink-3 mt-1" style={{ fontSize: 8 }}>DOB / जन्म तिथि</div>
          <div style={{ fontSize: 10, fontWeight: 600 }}>05/04/1990</div>
          <div className="ink-3 mt-1" style={{ fontSize: 8 }}>लिंग / Male</div>
        </div>
      </div>
      <div className="flex items-end justify-between mt-1">
        <div>
          <div className="ink-3" style={{ fontSize: 7 }}>आधार संख्या / Aadhaar No.</div>
          <Masked style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>XXXX XXXX 4421</Masked>
        </div>
        <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #111 25%, transparent 25%, transparent 50%, #111 50%, #111 75%, transparent 75%)", backgroundSize: "4px 4px" }} />
      </div>
    </div>
  </DocShell>
);

const AadhaarBack = () => (
  <DocShell bg="linear-gradient(180deg, #FFF6E5 0%, #FFFFFF 50%, #E8F5E9 100%)">
    <div className="absolute inset-0 p-3 flex flex-col">
      <div style={{ fontWeight: 700, fontSize: 9, color: "#C2410C" }}>पता / Address</div>
      <div style={{ fontSize: 10, lineHeight: 1.4, marginTop: 2 }}>
        Flat 402, Lotus Heights,<br/>Koregaon Park, Pune,<br/>Maharashtra — 411001
      </div>
      <div className="flex items-end justify-between mt-auto">
        <div>
          <div className="ink-3" style={{ fontSize: 7 }}>आधार संख्या / Aadhaar No.</div>
          <Masked style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>XXXX XXXX 4421</Masked>
        </div>
        <div style={{ width: 36, height: 36, background: "linear-gradient(45deg, #111 25%, transparent 25%, transparent 50%, #111 50%, #111 75%, transparent 75%)", backgroundSize: "4px 4px" }} />
      </div>
      <div className="ink-3 text-center" style={{ fontSize: 8, marginTop: 4 }}>help@uidai.gov.in · 1947</div>
    </div>
  </DocShell>
);

// PAN — blue branding
const PANFront = () => (
  <DocShell bg="linear-gradient(135deg, #DCE9FA 0%, #F4F5F7 100%)">
    <div className="absolute inset-0 p-3 flex flex-col" style={{ color: "#111" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#1F4F95" }} />
          <div style={{ fontWeight: 800, fontSize: 9, lineHeight: 1.1, color: "#1F4F95" }}>आयकर विभाग<br/>INCOME TAX DEPT.</div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 9, color: "#1F4F95" }}>GOVT. OF INDIA</div>
      </div>
      <div className="flex items-center gap-2 mt-2 flex-1">
        <PhotoBlock initial="D" size={48} />
        <div className="flex-1">
          <div className="ink-3" style={{ fontSize: 8 }}>Permanent Account Number</div>
          <Masked style={{ fontSize: 14, fontWeight: 800, letterSpacing: 1 }}>BTXPM2941K</Masked>
          <div className="ink-3 mt-1" style={{ fontSize: 8 }}>Name</div>
          <div style={{ fontSize: 11, fontWeight: 700 }}>DEEPEN VORA</div>
          <div className="ink-3 mt-1" style={{ fontSize: 8 }}>Father's Name</div>
          <div style={{ fontSize: 10 }}>RAJESH VORA</div>
          <div className="ink-3 mt-1" style={{ fontSize: 8 }}>Date of Birth · 05/04/1990</div>
        </div>
      </div>
      <div className="flex justify-end" style={{ fontFamily: "cursive", fontSize: 11, fontWeight: 600, fontStyle: "italic" }}>D. Vora</div>
    </div>
  </DocShell>
);

const PANBack = () => (
  <DocShell bg="linear-gradient(135deg, #DCE9FA 0%, #F4F5F7 100%)">
    <div className="absolute inset-0 p-3 flex flex-col text-center" style={{ color: "#1F4F95" }}>
      <div style={{ fontSize: 9, fontWeight: 700 }}>INCOME TAX DEPARTMENT · GOVT. OF INDIA</div>
      <div className="ink-2 mt-1" style={{ fontSize: 9, color: "#374151" }}>This card is the property of the Income Tax Department.</div>
      <div className="flex-1 flex flex-col items-center justify-center gap-2">
        <div style={{ width: 44, height: 44, background: "repeating-linear-gradient(45deg, #1F4F95 0 2px, transparent 2px 4px)" }} />
        <div className="ink-2" style={{ fontSize: 9, color: "#374151" }}>If found, please return to:</div>
        <div style={{ fontSize: 10, fontWeight: 600 }}>Income Tax PAN Services Unit,<br/>NSDL e-Governance, Pune</div>
      </div>
      <div className="ink-3" style={{ fontSize: 8 }}>www.incometaxindia.gov.in</div>
    </div>
  </DocShell>
);

// Driving License — saffron border + sign
const DLFront = () => (
  <DocShell bg="linear-gradient(135deg, #FFF1DA 0%, #FFFFFF 100%)">
    <div className="absolute top-0 left-0 right-0" style={{ height: 4, background: "#D97706" }} />
    <div className="absolute inset-0 p-3 pt-4 flex flex-col" style={{ color: "#111" }}>
      <div className="flex items-center justify-between">
        <div style={{ fontWeight: 800, fontSize: 9, color: "#9A4F00" }}>DRIVING LICENCE<br/>MAHARASHTRA · INDIA</div>
        <div style={{ fontSize: 8, fontWeight: 700, color: "#9A4F00" }}>FORM 6</div>
      </div>
      <div className="flex gap-2 mt-2 flex-1">
        <PhotoBlock initial="D" size={42} />
        <div className="flex-1">
          <div className="ink-3" style={{ fontSize: 8 }}>DL No.</div>
          <Masked style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.5 }}>MH14 20200012345</Masked>
          <div className="ink-3 mt-1" style={{ fontSize: 8 }}>Name</div>
          <div style={{ fontSize: 10, fontWeight: 700 }}>Deepen Vora</div>
          <div className="ink-3 mt-1" style={{ fontSize: 8 }}>S/D/W of</div>
          <div style={{ fontSize: 9 }}>Rajesh Vora</div>
        </div>
      </div>
      <div className="flex justify-between" style={{ fontSize: 8 }}>
        <div><div className="ink-3">DOI</div><div style={{ fontWeight: 600 }}>12/01/2009</div></div>
        <div><div className="ink-3">Valid Till</div><div style={{ fontWeight: 600, color: "#9A4F00" }}>Dec 2031</div></div>
        <div><div className="ink-3">COV</div><div style={{ fontWeight: 600 }}>LMV, MCWG</div></div>
      </div>
    </div>
  </DocShell>
);

const DLBack = () => (
  <DocShell bg="linear-gradient(135deg, #FFF1DA 0%, #FFFFFF 100%)">
    <div className="absolute top-0 left-0 right-0" style={{ height: 4, background: "#D97706" }} />
    <div className="absolute inset-0 p-3 pt-4 flex flex-col" style={{ color: "#111" }}>
      <div style={{ fontWeight: 700, fontSize: 9, color: "#9A4F00" }}>AUTHORISATION TO DRIVE</div>
      <div className="mt-1.5 space-y-1" style={{ fontSize: 9 }}>
        <div className="flex justify-between"><span className="ink-2">LMV (Light Motor Vehicle)</span><span style={{ fontWeight: 600 }}>12/01/2009</span></div>
        <div className="flex justify-between"><span className="ink-2">MCWG (Motorcycle with Gear)</span><span style={{ fontWeight: 600 }}>12/01/2009</span></div>
      </div>
      <div className="ink-3 mt-2" style={{ fontSize: 8 }}>Issuing Authority</div>
      <div style={{ fontSize: 10, fontWeight: 600 }}>RTO Pune (MH14), Maharashtra</div>
      <div className="flex justify-end mt-auto" style={{ fontFamily: "cursive", fontSize: 11, fontStyle: "italic" }}>D. Vora</div>
    </div>
  </DocShell>
);

// Passport — navy
const PassportFront = () => (
  <DocShell bg="linear-gradient(135deg, #0F2A5C 0%, #14336F 100%)">
    <div className="absolute inset-0 p-3 flex flex-col" style={{ color: "#F3D88A" }}>
      <div className="text-center">
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>भारत गणराज्य</div>
        <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 2, marginTop: 2 }}>REPUBLIC OF INDIA</div>
        <div className="flex justify-center mt-2">
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "1px solid #F3D88A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 800 }}>🦁</span>
          </div>
        </div>
        <div className="mt-2" style={{ fontSize: 10, fontWeight: 800, letterSpacing: 3 }}>PASSPORT</div>
        <div className="ink-3" style={{ fontSize: 8, color: "#F3D88A", opacity: 0.8 }}>पासपोर्ट</div>
      </div>
      <div className="ink-3 mt-auto" style={{ fontSize: 8, color: "#F3D88A", opacity: 0.7, textAlign: "center" }}>M9842301 · Valid till Jul 2029</div>
    </div>
  </DocShell>
);

const PassportBack = () => (
  <DocShell bg="linear-gradient(180deg, #FFFFFF 0%, #F4F5F7 100%)">
    <div className="absolute inset-0 p-3 flex gap-3" style={{ color: "#111" }}>
      <PhotoBlock initial="D" size={64} />
      <div className="flex-1 text-xs" style={{ lineHeight: 1.4 }}>
        <Field2 k="Type / P" v="P" />
        <Field2 k="Surname" v="VORA" />
        <Field2 k="Given Name" v="DEEPEN" />
        <Field2 k="Nationality" v="INDIAN" />
        <Field2 k="Date of Birth" v="05/04/1990" />
        <Field2 k="Sex" v="M" />
        <Field2 k="Place of Issue" v="MUMBAI" />
      </div>
    </div>
  </DocShell>
);
const Field2 = ({ k, v }) => (
  <div className="flex justify-between" style={{ fontSize: 8 }}>
    <span className="ink-3">{k}</span><span style={{ fontWeight: 700 }}>{v}</span>
  </div>
);

// Voter — pink border
const VoterFront = () => (
  <DocShell bg="linear-gradient(135deg, #FFE4F0 0%, #FFFFFF 100%)">
    <div className="absolute top-0 left-0 right-0" style={{ height: 4, background: "#A1276F" }} />
    <div className="absolute inset-0 p-3 pt-4 flex flex-col" style={{ color: "#111" }}>
      <div className="text-center" style={{ fontSize: 9, fontWeight: 800, color: "#A1276F", lineHeight: 1.2 }}>ELECTION COMMISSION OF INDIA<br/>IDENTITY CARD</div>
      <div className="flex gap-2 mt-2 flex-1">
        <PhotoBlock initial="D" size={42} />
        <div className="flex-1">
          <div className="ink-3" style={{ fontSize: 8 }}>Elector's Name</div>
          <div style={{ fontSize: 10, fontWeight: 700 }}>Deepen Vora</div>
          <div className="ink-3 mt-1" style={{ fontSize: 8 }}>Father's Name</div>
          <div style={{ fontSize: 9 }}>Rajesh Vora</div>
          <div className="ink-3 mt-1" style={{ fontSize: 8 }}>EPIC No.</div>
          <Masked style={{ fontSize: 11, fontWeight: 800 }}>XYZ1234567</Masked>
        </div>
      </div>
      <div className="ink-3 text-right" style={{ fontSize: 8 }}>Constituency: Pune Cantonment</div>
    </div>
  </DocShell>
);

const VoterBack = () => (
  <DocShell bg="linear-gradient(135deg, #FFE4F0 0%, #FFFFFF 100%)">
    <div className="absolute top-0 left-0 right-0" style={{ height: 4, background: "#A1276F" }} />
    <div className="absolute inset-0 p-3 pt-4 flex flex-col" style={{ color: "#111" }}>
      <div className="ink-3" style={{ fontSize: 8 }}>Address</div>
      <div style={{ fontSize: 9, lineHeight: 1.4, marginTop: 2 }}>
        Flat 402, Lotus Heights, Koregaon Park,<br/>Pune, Maharashtra — 411001
      </div>
      <div className="ink-3 mt-2" style={{ fontSize: 8 }}>Date of Issue</div>
      <div style={{ fontSize: 9, fontWeight: 600 }}>02 May 2024</div>
      <div className="flex justify-end mt-auto" style={{ fontFamily: "cursive", fontSize: 11, fontStyle: "italic" }}>Electoral Officer</div>
    </div>
  </DocShell>
);

const GenericFront = ({ doc }) => (
  <DocShell bg="linear-gradient(135deg, #F4F5F7 0%, #FFFFFF 100%)">
    <div className="absolute inset-0 p-4 flex flex-col items-center justify-center text-center">
      <Icon name={doc.icon} size={36} color={doc.color} />
      <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>{doc.title}</div>
      <Masked style={{ fontSize: 11, color: "var(--ink-2)", marginTop: 2 }}>{doc.number}</Masked>
    </div>
  </DocShell>
);

Object.assign(window, {
  FamilyGroupList, FamilyGroupDetail, FamilyGroupCreate, MemberDetail,
  Notifications, Advisory, Documents, DocumentDetail,
});

// =========================================================================
// Family Group Creation Flow — WhatsApp-style 3-step wizard
//   Step 1: Group name + photo
//   Step 2: Select members
//   Step 3: Review & send invites
// =========================================================================

// Local helpers (Babel scripts don't share scope)
const SectionIntro = ({ icon, title, sub }) => (
  <div className="flex items-start gap-3 mb-4">
    <div className="rounded-xl flex items-center justify-center shrink-0" style={{ width: 38, height: 38, background: "var(--brand-soft)" }}>
      <Icon name={icon} size={20} color="#5B2EE0" />
    </div>
    <div>
      <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
      <div className="ink-2 mt-0.5" style={{ fontSize: 12, lineHeight: 1.5 }}>{sub}</div>
    </div>
  </div>
);

const Checkbox = ({ active }) => (
  <div className="flex items-center justify-center shrink-0" style={{
    width: 22, height: 22, borderRadius: 999,
    border: active ? "2px solid var(--brand)" : "2px solid var(--border)",
    background: active ? "var(--brand)" : "#fff",
    transition: "all 150ms ease",
  }}>
    {active && <Icon name="check" size={12} color="#fff" stroke={3} />}
  </div>
);

const PHOTO_PALETTES = [
  { bg: "#FCE7C2", ink: "#9A5A00" },
  { bg: "#FFE0D5", ink: "#A6266A" },
  { bg: "#E6F0FF", ink: "#1F4FBA" },
  { bg: "#E8F5E9", ink: "#15803D" },
  { bg: "#EDE8FB", ink: "#5B2EE0" },
  { bg: "#FFEDD5", ink: "#9A4F00" },
];

// Pool of family contacts user can invite
const FAMILY_CONTACTS = [
  { id: "shalini", name: "Shalini Vora", relation: "Spouse", initial: "S", color: "#E91E63", phone: "9988220011" },
  { id: "rajesh", name: "Rajesh Vora", relation: "Father", initial: "R", color: "#0EA5E9", phone: "9988220012" },
  { id: "sudha", name: "Sudha Vora", relation: "Mother", initial: "S", color: "#16A34A", phone: "9988220013" },
  { id: "priya", name: "Priya Vora", relation: "Sister", initial: "P", color: "#D97706", phone: "9988220014" },
  { id: "aarav", name: "Aarav Vora", relation: "Son", initial: "A", color: "#A1276F", phone: "9988220015" },
  { id: "mira", name: "Mira Vora", relation: "Daughter", initial: "M", color: "#9A4F00", phone: "9988220016" },
  { id: "neil", name: "Neil Vora", relation: "Brother", initial: "N", color: "#0F766E", phone: "9988220017" },
  { id: "kavita", name: "Kavita Patel", relation: "Cousin", initial: "K", color: "#7C3AED", phone: "9988220018" },
];

const FG_STEPS = ["Group", "Members", "Invite"];

function FamilyGroupCreate() {
  const app = useApp();
  const store = useFamilyGroups();
  const [step, setStep] = useStateE(0);
  const [name, setName] = useStateE("");
  const [paletteIdx, setPaletteIdx] = useStateE(0);
  const [photo, setPhoto] = useStateE(null);
  const [selected, setSelected] = useStateE([]);
  const [search, setSearch] = useStateE("");
  const fileRef = React.useRef(null);

  const palette = PHOTO_PALETTES[paletteIdx];
  const initials = (name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("") || "G").toUpperCase();

  const togglePick = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const pickPhoto = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(`url(${reader.result})`);
    reader.readAsDataURL(f);
  };

  const next = () => {
    if (step === 0 && !name.trim()) { app.toast("Enter a group name"); return; }
    if (step === 1 && selected.length === 0) { app.toast("Select at least one member"); return; }
    setStep(step + 1);
  };
  const prev = () => { if (step === 0) app.back(); else setStep(step - 1); };

  const sendInvites = () => {
    const pickedMembers = FAMILY_CONTACTS.filter(c => selected.includes(c.id))
      .map(c => ({ initial: c.initial, color: c.color }));
    const newGroup = {
      id: `g-${Date.now()}`,
      name: name.trim(),
      value: "₹0",
      members: pickedMembers.slice(0, 3),
      extra: Math.max(0, pickedMembers.length - 3),
      color: palette.bg,
      initial: initials,
      photo: photo,
      created: true,
    };
    store.add(newGroup);
    app.toast(`${selected.length} invite${selected.length === 1 ? "" : "s"} sent`);
    app.replace("family-groups");
  };

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="header-grad" style={{ paddingBottom: 14 }}>
        <StatusBar dark={false} />
        <div className="flex items-center px-4 pt-2 gap-3">
          <button onClick={prev} className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }}>
            <Icon name="arrow-left" size={22} color="#fff" stroke={2.2} />
          </button>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", lineHeight: 1.1 }}>Step {step + 1} of 3</div>
            <div style={{ fontSize: 17, color: "#fff", fontWeight: 600 }}>New Family Group</div>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="bg-white px-4 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
        {FG_STEPS.map((l, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <React.Fragment key={l}>
              <div className="flex flex-col items-center" style={{ width: 60 }}>
                <div className="rounded-full flex items-center justify-center" style={{
                  width: 28, height: 28,
                  background: done ? "var(--brand)" : active ? "#fff" : "#F4F5F7",
                  border: active || done ? "2px solid var(--brand)" : "2px solid var(--border)",
                  color: done ? "#fff" : active ? "var(--brand)" : "var(--ink-3)",
                  fontSize: 12, fontWeight: 700,
                }}>{done ? <Icon name="check" size={14} color="#fff" stroke={3} /> : (i + 1)}</div>
                <div className="mt-1" style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "var(--brand)" : "var(--ink-2)" }}>{l}</div>
              </div>
              {i < FG_STEPS.length - 1 && <div className="flex-1" style={{ height: 2, background: i < step ? "var(--brand)" : "var(--border)", marginTop: -12 }} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Body */}
      <div className="scroll-area flex-1 overflow-y-auto px-4 py-4 pb-28">
        {step === 0 && (
          <div className="fade-in">
            <div className="flex flex-col items-center mt-2">
              <button onClick={() => fileRef.current && fileRef.current.click()} className="relative rounded-full flex items-center justify-center" style={{
                width: 116, height: 116,
                background: photo || palette.bg,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: palette.ink,
                fontWeight: 800, fontSize: 40,
                border: "3px solid #fff",
                boxShadow: "0 4px 16px rgba(91,46,224,0.18)",
              }}>
                {!photo && initials}
                <div className="absolute" style={{ right: 0, bottom: 0, width: 36, height: 36, background: "var(--brand)", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #fff" }}>
                  <Icon name="camera" size={16} color="#fff" />
                </div>
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} style={{ display: "none" }} />
              <button onClick={() => { setPhoto(null); }} className="ink-2 mt-3" style={{ fontSize: 12, fontWeight: 500 }}>
                {photo ? "Remove photo" : "Tap to upload photo"}
              </button>
            </div>

            {!photo && (
              <div className="mt-4">
                <div className="ink-2 mb-2 text-center" style={{ fontSize: 12 }}>or choose a colour</div>
                <div className="flex justify-center gap-2">
                  {PHOTO_PALETTES.map((p, i) => (
                    <button key={i} onClick={() => setPaletteIdx(i)} className="rounded-full" style={{
                      width: 32, height: 32, background: p.bg,
                      border: paletteIdx === i ? "2px solid var(--brand)" : "2px solid transparent",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <div className="ink-2 mb-1.5" style={{ fontSize: 12, fontWeight: 500 }}>Group name</div>
              <div className="flex items-center gap-2 px-3 py-2.5" style={{ border: "1.5px solid var(--brand)", borderRadius: 10, background: "#fff" }}>
                <input value={name} onChange={e => setName(e.target.value.slice(0, 32))} placeholder="e.g. Vora Family" className="flex-1 outline-none" style={{ fontSize: 15, fontWeight: 500 }} autoFocus />
                <span className="ink-3" style={{ fontSize: 11 }}>{name.length}/32</span>
              </div>
              <div className="ink-3 mt-1.5" style={{ fontSize: 11 }}>You can change this anytime.</div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="fade-in">
            <SectionIntro icon="users" title="Add members" sub={`${selected.length} selected · invites will be sent on WhatsApp`} />

            <div className="card flex items-center gap-2 px-3 py-2.5 mb-3">
              <Icon name="search" size={16} color="#9CA3AF" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search family contacts" className="flex-1 outline-none bg-transparent" style={{ fontSize: 13 }} />
            </div>

            {selected.length > 0 && (
              <div className="flex gap-2 overflow-x-auto scroll-area pb-3 mb-2">
                {selected.map(id => {
                  const c = FAMILY_CONTACTS.find(x => x.id === id);
                  return (
                    <div key={id} className="shrink-0 flex flex-col items-center" style={{ width: 56 }}>
                      <div className="relative">
                        <Avatar initial={c.initial} color={c.color} size={44} />
                        <button onClick={() => togglePick(id)} className="absolute rounded-full flex items-center justify-center" style={{ right: -4, top: -4, width: 18, height: 18, background: "#111", border: "2px solid #fff" }}>
                          <Icon name="x" size={9} color="#fff" stroke={3} />
                        </button>
                      </div>
                      <div className="truncate w-full text-center mt-1" style={{ fontSize: 10, fontWeight: 500 }}>{c.name.split(" ")[0]}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
              {FAMILY_CONTACTS
                .filter(c => !search || (c.name + c.relation).toLowerCase().includes(search.toLowerCase()))
                .map(c => {
                  const active = selected.includes(c.id);
                  return (
                    <button key={c.id} onClick={() => togglePick(c.id)} className="flex items-center w-full px-4 py-3 gap-3 text-left">
                      <Avatar initial={c.initial} color={c.color} size={40} />
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                        <div className="ink-2" style={{ fontSize: 11 }}>{c.relation} · +91 {c.phone}</div>
                      </div>
                      <Checkbox active={active} />
                    </button>
                  );
                })}
            </div>

            <button onClick={() => app.toast("Invite via phone number — coming soon")} className="mt-3 flex items-center justify-center gap-2 w-full py-2.5" style={{ border: "1.5px dashed var(--brand)", color: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 14 }}>
              <Icon name="phone-call" size={14} color="#5B2EE0" /> Invite by phone number
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <SectionIntro icon="send" title="Review & send invites" sub="We'll WhatsApp each member a join link. They can accept anytime." />

            <div className="card p-4 flex items-center gap-3">
              <div className="rounded-full flex items-center justify-center" style={{
                width: 56, height: 56,
                background: photo || palette.bg,
                backgroundSize: "cover", backgroundPosition: "center",
                color: palette.ink, fontWeight: 800, fontSize: 22,
              }}>{!photo && initials}</div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 16, fontWeight: 700 }}>{name || "Untitled Group"}</div>
                <div className="ink-2" style={{ fontSize: 12 }}>{selected.length} member{selected.length === 1 ? "" : "s"}</div>
              </div>
              <button onClick={() => setStep(0)} className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32, border: "1px solid var(--border)" }}>
                <Icon name="pen-line" size={14} color="#6B7280" />
              </button>
            </div>

            <div className="mt-3" style={{ fontSize: 14, fontWeight: 700 }}>Invitees</div>
            <div className="card mt-2 divide-y" style={{ borderColor: "var(--border)" }}>
              {selected.length === 0 ? (
                <div className="ink-2 px-4 py-3" style={{ fontSize: 13 }}>No members selected.</div>
              ) : selected.map(id => {
                const c = FAMILY_CONTACTS.find(x => x.id === id);
                return (
                  <div key={id} className="flex items-center px-4 py-3 gap-3">
                    <Avatar initial={c.initial} color={c.color} size={36} />
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                      <div className="ink-2" style={{ fontSize: 11 }}>{c.relation}</div>
                    </div>
                    <span className="chip" style={{ background: "var(--brand-soft)", color: "var(--brand)", fontWeight: 600 }}>Pending</span>
                  </div>
                );
              })}
            </div>

            <div className="card mt-3 p-3 flex items-start gap-2" style={{ background: "var(--brand-soft-2)", border: "1px solid #ECEAF6" }}>
              <Icon name="info" size={14} color="#5B2EE0" />
              <div className="ink-2" style={{ fontSize: 12, lineHeight: 1.5 }}>
                Members can see shared net worth, goals and insurance only after they accept. You can revoke access anytime.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex gap-2">
          <button onClick={prev} className="px-4 py-3" style={{ border: "1.5px solid var(--brand)", color: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 14, minWidth: 100 }}>
            {step === 0 ? "Cancel" : "Back"}
          </button>
          {step < 2 ? (
            <button onClick={next} className="flex-1 py-3 text-white flex items-center justify-center gap-1" style={{ background: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 15 }}>
              Continue <Icon name="arrow-right" size={16} color="#fff" />
            </button>
          ) : (
            <button onClick={sendInvites} className="flex-1 py-3 text-white flex items-center justify-center gap-2" style={{ background: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 15 }}>
              <Icon name="send" size={16} color="#fff" /> Send {selected.length} Invite{selected.length === 1 ? "" : "s"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
