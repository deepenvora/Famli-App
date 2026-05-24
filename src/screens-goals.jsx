// =========================================================================
// screens-goals.jsx — Goals list, Goal Details, Add Goal flow
// =========================================================================

const { useState: useStateG } = React;

const fmtAmt = (n) => {
  if (n == null) return "—";
  if (n >= 10000000) { const v = n / 10000000; return `₹${v % 1 === 0 ? v : v.toFixed(1)} Cr`; }
  if (n >= 100000)   { const v = n / 100000;   return `₹${v % 1 === 0 ? v : v.toFixed(1)} L`;  }
  return `₹${n.toLocaleString("en-IN")}`;
};

// -------------------------------------------------------------------------
// S4: Goals list (Myself / Mehta Family)
// -------------------------------------------------------------------------
const Goals = ({ profile = "Myself" }) => {
  const app = useApp();
  const isFamily = profile === "Mehta Family";
  const goals = isFamily ? MOCK.goalsDashboard : MOCK.goalsFull;

  if (goals.length === 0) {
    return (
      <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
        <PurpleHeader label="Goals" profile={profile} showEye showShare showAdd onAdd={() => app.go("add-goal")} />
        <div className="scroll-area flex-1 overflow-y-auto pb-24">
          <div className="px-4 pt-5 pb-3" style={{ fontSize: 18, fontWeight: 700 }}>Add Financial Goals</div>
          {[
            { emoji: "🚨", title: "Emergency Fund", desc: "Build a safety net so you're always ready for life's surprises." },
            { emoji: "🎓", title: "Education", desc: "Invest in learning and growth for yourself or your family." },
            { emoji: "🏖️", title: "Vacation", desc: "Make memories by planning ahead for your dream trips." },
          ].map(item => (
            <button key={item.title} onClick={() => app.go("add-goal")} className="mx-4 mb-2 px-4 py-3 flex items-center gap-3 text-left" style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, width: "calc(100% - 2rem)" }}>
              <div style={{ fontSize: 36 }}>{item.emoji}</div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 14, fontWeight: 700 }}>{item.title}</div>
                <div className="ink-2" style={{ fontSize: 12, marginTop: 2, lineHeight: 1.4 }}>{item.desc}</div>
              </div>
              <Icon name="chevron-right" size={18} color="#9CA3AF" />
            </button>
          ))}
          <div className="ink-2 px-4 mt-3" style={{ fontSize: 13 }}>Got more plans for the future?</div>
          <div className="px-4 mt-2">
            <button onClick={() => app.go("add-goal")} className="flex items-center gap-2 px-4 py-2.5" style={{ border: "1.5px solid var(--brand)", borderRadius: 10, color: "var(--brand)", fontWeight: 600, fontSize: 14 }}>
              <Icon name="plus" size={16} color="#5B2EE0" stroke={2.4} /> Add New Goal
            </button>
          </div>
        </div>
        <FAB />
        <BottomNav active="goals" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <PurpleHeader label="Goals" profile={profile} showEye showShare showAdd onAdd={() => app.go("add-goal")} />
      <div className="scroll-area flex-1 overflow-y-auto pb-24">
        <div className="px-4 pt-3 space-y-3">
          {goals.map(g => (
            <div key={g.id} className="card overflow-hidden">
              <button onClick={() => app.go("goal-detail", { goalId: g.id })} className="flex items-center w-full px-4 py-3 gap-3 text-left">
                <div style={{ width: 48, height: 48, background: '#FFFFFF', border: '1px solid #E9EAEB', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{g.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{g.name}</div>
                  <div className="ink-3 flex items-center gap-1" style={{ fontSize: 11 }}>
                    <Icon name="calendar" size={11} color="#9CA3AF" /> {g.date}
                    {isFamily && <span className="ml-2"><AvatarStack items={MOCK.familyMembers.slice(0,2).map(m=>({initial:m.initial,color:m.color}))} size={14}/></span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Masked style={{ fontSize: 14, fontWeight: 700 }}>
                    {(!g.status || g.status === "unfunded")
                      ? fmtAmt(g.targetAmount)
                      : g.status === "achieved"
                      ? `${fmtAmt(g.targetAmount)} / ${fmtAmt(g.targetAmount)}`
                      : `${fmtAmt(g.currentFunded)} / ${fmtAmt(g.targetAmount)}`}
                  </Masked>
                  <div className="mt-0.5">
                    {g.status === "ahead" ? <Tag kind="success">↗ Ahead</Tag> :
                     g.status === "lagging" ? <Tag kind="danger">↘ Lagging</Tag> :
                     g.status === "ontrack" ? <Tag kind="neutral">On Track</Tag> :
                     g.status === "achieved" ? <Tag kind="success">✓ Achieved</Tag> :
                     <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                       <Icon name="info" size={12} color="#9CA3AF" />
                       <span style={{ fontSize: 12, color: "#9CA3AF" }}>Unfunded</span>
                     </div>}
                  </div>
                </div>
              </button>
              <div style={{ display: "flex", width: "100%", borderTop: "1px solid #E9EAEB", marginTop: 0 }}>
                <ActionBtn icon="trash-2" label="Delete" onClick={() => app.toast(`Delete ${g.name}? (mock)`)} />
                <ActionBtn icon="pen-line" label="Edit" onClick={() => app.go("create-goal", { editing: true, goalId: g.id, goalType: g.type, type: g.type })} borderLeft />
                <ActionBtn icon="banknote" label={(!g.status || g.status === "unfunded") ? "Add Funding" : "Edit Funding"} onClick={() => app.go("goal-funding", { goalId: g.id, mode: (!g.status || g.status === "unfunded") ? "new" : "edit" })} borderLeft fontSize={12} />
              </div>
            </div>
          ))}

          <div className="pt-3">
            <div className="ink-2" style={{ fontSize: 13 }}>Got bigger plans for the future?</div>
            <button onClick={() => app.go("add-goal")} className="mt-2 flex items-center gap-2 px-4 py-2.5" style={{ border: "1px solid var(--brand)", borderRadius: 12, color: "var(--brand)", fontWeight: 600, fontSize: 14 }}>
              <Icon name="plus" size={16} color="#5B2EE0" stroke={2.4} /> Add New Goal
            </button>
          </div>
        </div>
      </div>
      <FAB />
      <BottomNav active="goals" />
    </div>
  );
};

const ActionBtn = ({ icon, label, onClick, borderLeft, fontSize: fs = 13 }) => (
  <button onClick={onClick} style={{ flex: 1, minWidth: 0, padding: "12px 8px", fontSize: fs, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: "#6B7280", whiteSpace: "nowrap", overflow: "hidden", borderLeft: borderLeft ? "1px solid #E9EAEB" : undefined }}>
    <Icon name={icon} size={14} color="#6B7280" /> {label}
  </button>
);

// -------------------------------------------------------------------------
// S5: Goal Details
// -------------------------------------------------------------------------
const GoalDetail = () => {
  const app = useApp();
  const goalId = app.params.goalId || "swiss";
  const g = MOCK.goalsFull.find(x => x.id === goalId) || MOCK.goalsFull[2];
  const status = g.status || "unfunded";
  const fundingData = MOCK.goalFunding?.[goalId] || MOCK.goalFunding?.["switzerland"];
  const fundedAssets = (fundingData?.assets || []).filter(a => a.allocatedPct > 0);
  const targetValue = g.targetAmount != null ? fmtAmt(g.targetAmount) : "—";
  const [showMenu, setShowMenu] = useStateG(false);

  const statusCfg = {
    unfunded: { label: "Unfunded", color: "#9CA3AF", icon: "circle-slash" },
    ontrack:  { label: "On Track", color: "#3B82F6", icon: "minus-circle" },
    lagging:  { label: "Lagging",  color: "#DC2626", icon: "trending-down" },
    ahead:    { label: "Ahead",    color: "#16A34A", icon: "trending-up" },
    achieved: { label: "Achieved", color: "#16A34A", icon: "check-circle" },
  };
  const sc = statusCfg[status] || statusCfg.unfunded;
  const progressWidth = { ontrack: "33%", lagging: "33%", ahead: "60%", achieved: "100%" }[status] || "0%";
  const progressColor = { ontrack: "var(--brand)", lagging: "#DC2626", ahead: "#16A34A", achieved: "#16A34A" }[status];

  const moreMenuJSX = (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowMenu(m => !m)}
        className="rounded-full flex items-center justify-center"
        style={{ width: 32, height: 32 }}
      >
        <Icon name="more-horizontal" size={20} color="#fff" />
      </button>
      {showMenu && (
        <div style={{
          position: "absolute",
          right: 0,
          top: 38,
          background: "#fff",
          borderRadius: 10,
          border: "1px solid var(--border)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
          zIndex: 60,
          minWidth: 164,
          overflow: "hidden",
        }}>
          <button
            onClick={() => { setShowMenu(false); app.go("create-goal", { editing: true, goalId: g.id, goalType: g.type, type: g.type }); }}
            className="flex items-center gap-2 w-full px-4 py-3 text-left"
            style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}
          >
            <Icon name="pen-line" size={14} color="#6B7280" /> Edit Goal
          </button>
          <div style={{ height: 1, background: "var(--border)" }} />
          <button
            onClick={() => { setShowMenu(false); app.confirm("Are you sure you want to delete this goal?", () => app.go("goals")); }}
            className="flex items-center gap-2 w-full px-4 py-3 text-left"
            style={{ fontSize: 14, fontWeight: 500, color: "#DC2626" }}
          >
            <Icon name="trash-2" size={14} color="#DC2626" /> Delete Goal
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      {showMenu && <div className="absolute inset-0" style={{ zIndex: 55 }} onClick={() => setShowMenu(false)} />}
      <SubHeader title="Goal Details" right={moreMenuJSX} />
      <div className="scroll-area flex-1 overflow-y-auto pb-4">
        <div className="px-4 pt-3">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center" style={{ width: 44, height: 44, background: g.iconBg || "#E5E7EB", borderRadius: 12, fontSize: 22 }}>{g.emoji}</div>
              <div className="flex-1">
                <div style={{ fontSize: 16, fontWeight: 600 }}>{g.name}</div>
                <div className="ink-3" style={{ fontSize: 11 }}>{g.date}</div>
              </div>
              <div className="text-right">
                <Masked style={{ fontSize: 16, fontWeight: 700 }}>{targetValue}</Masked>
                {(g.tag || g.priority) && <div className="mt-0.5"><Tag kind={tagKind(g.tag || g.priority)}>{g.tag || g.priority}</Tag></div>}
              </div>
            </div>
            <div className="divider my-3" />
            <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
              <span className="ink-2">Created by</span>
              <span style={{ fontWeight: 600 }}>{MOCK.user.name}</span>
            </div>
            <div className="flex items-center justify-between mt-2" style={{ fontSize: 13 }}>
              <span className="ink-2">Who is this for?</span>
              <div className="flex items-center gap-1.5">
                <AvatarStack items={MOCK.familyMembers.slice(0, 2).map(m => ({ initial: m.initial, color: m.color }))} size={20} />
                <button onClick={() => app.toast("+3 more family")} style={{ color: "var(--brand)", fontSize: 12, fontWeight: 600 }}>+3 more</button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 mt-3">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div style={{ fontSize: 15, fontWeight: 700 }}>Goal Status</div>
              <div className="flex items-center gap-1" style={{ color: sc.color, fontSize: 13, fontWeight: 600 }}>
                <Icon name={sc.icon} size={14} color={sc.color} />
                {sc.label}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between" style={{ fontSize: 12 }}>
              <span><span className="ink-2">Current: </span><span style={{ fontWeight: 600 }}>{status === "unfunded" ? "₹0" : "₹4 L"}</span></span>
              <span><span className="ink-2">Target: </span><span style={{ fontWeight: 600 }}>{targetValue}</span></span>
            </div>
            {status !== "unfunded" && (
              <div className="mt-2 overflow-hidden" style={{ height: 6, background: "var(--border)", borderRadius: 3 }}>
                <div style={{ width: progressWidth, height: "100%", background: progressColor, borderRadius: 3 }} />
              </div>
            )}
            <div className="mt-2" style={{ fontSize: 12 }}>
              {status === "achieved" ? (
                <div className="flex items-center justify-between">
                  <span className="ink-2">Goal Fully Funded</span>
                  <span className="ink-2">No further SIP required</span>
                </div>
              ) : (
                <span>
                  <span className="ink-2">Recurring Investment: </span>
                  <span style={{ fontWeight: 600 }}>{status === "unfunded" ? "₹0" : "₹4 L"}</span>
                  {status !== "unfunded" && <><span className="ink-2"> · SIP: </span><span style={{ fontWeight: 600 }}>₹10k / mth</span></>}
                </span>
              )}
            </div>
            {(status === "ontrack" || status === "ahead" || status === "lagging") && (
              <div className="mt-3 p-3 rounded-xl flex gap-2" style={{ background: "var(--brand-soft-2)", border: "1px solid #ECEAF6" }}>
                <div style={{ width: 4, background: "var(--brand)", borderRadius: 2 }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div style={{ fontSize: 13, fontWeight: 600 }}>Projected Value by 2050</div>
                    <Masked style={{ fontSize: 13, fontWeight: 700 }}>₹8 Cr</Masked>
                  </div>
                  <div className="ink-2" style={{ fontSize: 11, marginTop: 2 }}>With your current and recurring investments growing at 10% annually, you'll reach ₹8 Cr by 2050.</div>
                </div>
              </div>
            )}
            {status === "achieved" && (
              <div className="mt-3 p-3 rounded-xl" style={{ background: "#DCFCE7", border: "1px solid #BBF7D0" }}>
                <div className="flex items-center gap-2">
                  <Icon name="check-circle" size={16} color="#16A34A" />
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#15803D" }}>You have achieved the goal amount</div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5" style={{ fontSize: 13, fontWeight: 600, color: "#15803D" }}>
                    <Icon name="flag" size={13} color="#16A34A" />
                    Goal Achieved
                  </div>
                  <Masked style={{ fontSize: 13, fontWeight: 700, color: "#15803D" }}>{targetValue}</Masked>
                </div>
                <div className="mt-1" style={{ fontSize: 11, color: "#6B7280", fontStyle: "italic" }}>
                  Congratulations! You have fully funded this goal.
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 mt-3">
          <div className="card p-4">
            {status === "unfunded" ? (
              <>
                <div className="p-3 rounded-xl flex gap-2 items-start" style={{ background: "#EDE8FB" }}>
                  <Icon name="info" size={15} color="var(--brand)" />
                  <div style={{ fontSize: 13, color: "var(--brand)", lineHeight: 1.5 }}>
                    This goal is unfunded. Link your assets to fund this goal and track it.
                  </div>
                </div>
                <button
                  onClick={() => app.go("goal-funding", { goalId: g.id, mode: "new" })}
                  className="w-full mt-3 py-2.5 flex items-center justify-center gap-1.5"
                  style={{ border: "1.5px solid var(--brand)", color: "var(--brand)", borderRadius: 10, fontWeight: 600, fontSize: 14, background: "#fff" }}
                >
                  <Icon name="plus" size={15} color="var(--brand)" /> Add Goal Funding
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Goal Funding</div>
                  <button onClick={() => app.go("goal-funding", { goalId: g.id, mode: "edit" })} className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28, border: "1px solid var(--border)" }}>
                    <Icon name="pen-line" size={14} color="#6B7280" />
                  </button>
                </div>
                {status === "lagging" && (
                  <div className="mt-3 p-3 rounded-xl flex items-center gap-2" style={{ background: "#FFFBEB", border: "1px solid #FCD34D" }}>
                    <Icon name="triangle-alert" size={15} color="#D97706" />
                    <div style={{ fontSize: 13, color: "#92400E", fontWeight: 500 }}>Add ₹3,000/month to meet your goal.</div>
                  </div>
                )}
                {(fundedAssets.length > 0 ? fundedAssets : [{ id: "icici-lc", name: "ICICI Prudential Large Cap Equity Fund", color: "#F47B26" }]).map((asset, i) => (
                  <div key={asset.id} className="mt-3">
                    <div className="flex items-center gap-3">
                      <LogoTile color={asset.color} char={asset.name.charAt(0)} size={32} />
                      <div className="flex-1">
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{asset.name}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between" style={{ fontSize: 12 }}>
                      <span className="ink-2">Funded Value: <span className="ink" style={{ fontWeight: 600 }}>₹12 L</span></span>
                      <span className="ink-2">Funded SIP: <span className="ink" style={{ fontWeight: 600 }}>₹10k/mth</span></span>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// S6: Add Goal — full page modal
// -------------------------------------------------------------------------
const AddGoal = () => {
  const app = useApp();
  const [selected, setSelected] = useStateG("emergency");
  const hasRetirement = MOCK.goalsFull.some(g => g.type === "retirement");

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#fff" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <StatusBar dark />
        <div className="flex items-center px-4 py-3 gap-3">
          <button onClick={() => app.back()} className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }}>
            <Icon name="arrow-left" size={22} color="#111" stroke={2.2} />
          </button>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Select Type of Goal</div>
        </div>
      </div>

      <div className="scroll-area flex-1 overflow-y-auto px-4 pt-4 pb-28">
        <div className="ink-2 mb-3" style={{ fontSize: 13, lineHeight: 1.5 }}>
          Pick the kind of goal you want to plan for. You can customise the details on the next screen.
        </div>
        <div className="grid grid-cols-2 gap-3">
          {MOCK.goalTypes.map(t => {
            const isDisabled = t.key === "retirement" && hasRetirement;
            const active = selected === t.key && !isDisabled;
            return (
              <button
                key={t.key}
                onClick={() => { if (!isDisabled) setSelected(t.key); }}
                className="p-3 text-center"
                style={{
                  border: active ? "1.5px solid var(--brand)" : "1.5px solid var(--border)",
                  borderRadius: 14,
                  background: active ? "var(--brand-soft-2)" : "#fff",
                  minHeight: 140,
                  transition: "all 150ms ease",
                  opacity: isDisabled ? 0.4 : 1,
                  pointerEvents: isDisabled ? "none" : "auto",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                }}
              >
                <div style={{ fontSize: 30 }}>{t.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginTop: 6, color: active ? "var(--brand)" : "var(--ink)" }}>{t.title}</div>
                {isDisabled
                  ? <div style={{ fontSize: 11, marginTop: 4, color: "#9CA3AF" }}>Already created</div>
                  : <div className="ink-2" style={{ fontSize: 11, marginTop: 4, lineHeight: 1.35 }}>{t.desc}</div>
                }
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => app.go("create-goal", { goalType: selected, type: selected })}
          className="w-full py-3 text-white flex items-center justify-center gap-2"
          style={{ background: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 15 }}
        >
          Continue <Icon name="arrow-right" size={16} color="#fff" />
        </button>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// Create / Edit Goal
// -------------------------------------------------------------------------
function CreateGoal() {
  const app = useApp();
  const goalType = app.params?.goalType || app.params?.type || "";
  const isRetirement = goalType === "retirement";
  const editing = !!app.params?.editing;
  const goalId = app.params?.goalId;
  const existingGoal = editing ? MOCK.goalsFull.find(g => g.id === goalId) : null;

  // Common state
  const [importance, setImportance] = useStateG(editing ? (existingGoal?.tag || null) : null);
  const [forWhom, setForWhom] = useStateG(editing ? (existingGoal?.forWhom || "Myself") : "");
  const [goalName, setGoalName] = useStateG(
    editing
      ? (existingGoal?.name || "")
      : isRetirement ? "Retirement Goal" : ""
  );
  const [sip, setSip] = useStateG(true);
  const [suggestOpen, setSuggestOpen] = useStateG(false);

  // Retirement state
  const [retireAge, setRetireAge] = useStateG(editing ? (existingGoal?.retireAge || 60) : 0);
  const [lifeExp, setLifeExp] = useStateG(editing ? (existingGoal?.lifeExp || 80) : 0);
  const [corpusOverride, setCorpusOverride] = useStateG(null);
  const [corpusOpen, setCorpusOpen] = useStateG(false);

  // Retirement corpus calculation
  const canCalcCorpus = retireAge > 0 && lifeExp > 0 && lifeExp > retireAge;
  const monthlyExpForCalc = editing ? (existingGoal?.monthlyExp || 50000) : 50000;
  const rawCorpus = canCalcCorpus
    ? ((monthlyExpForCalc * 12) * (lifeExp - retireAge)) * Math.pow(1.06, retireAge - 30)
    : 0;
  const displayRawCorpus = corpusOverride !== null ? corpusOverride : rawCorpus;
  const corpusDisplay = canCalcCorpus
    ? `₹${(displayRawCorpus / 10000000).toFixed(2)} Cr`
    : "₹--- Cr";

  const retN = retireAge > 30 ? (retireAge - 30) * 12 : 0;
  const retR = 0.12 / 12;
  const canCalcRetireSip = canCalcCorpus && retN > 0;
  const retireSip = canCalcRetireSip
    ? Math.round(displayRawCorpus / (((Math.pow(1 + retR, retN) - 1) / retR) * (1 + retR)))
    : 0;
  const retireSipDisplay = canCalcRetireSip
    ? `₹${retireSip.toLocaleString("en-IN")} / month`
    : "₹--- / month";

  // Life goal state
  const namePlaceholders = {
    emergency: "Rainy Day Fund",
    education: "Daughter's Education Fund",
    vacation: "Europe Trip 2028",
    home: "First Home Down Payment",
    purchase: "New Car Fund",
    life: "Riya's Wedding Fund",
    other: "My Custom Goal",
  };

  const [selectedDate, setSelectedDate] = useStateG(editing ? (existingGoal?.date || "") : "");
  const [dateOpen, setDateOpen] = useStateG(false);
  const [todayCost, setTodayCost] = useStateG(editing ? (existingGoal?.currentFunded || 0) : 0);

  // Life goal calculations
  const selectedYear = selectedDate ? parseInt(selectedDate.split(" ")[1]) : 0;
  const yearsAhead = selectedYear ? Math.max(0, selectedYear - new Date().getFullYear()) : 0;
  const inflationRate = (goalType === "education" || goalType === "home") ? 0.08 : 0.06;
  const computedEstCost = (todayCost > 0 && selectedYear > 0)
    ? Math.round(todayCost * Math.pow(1 + inflationRate, yearsAhead))
    : 0;
  const estimatedCostValue = editing ? (existingGoal?.targetAmount || computedEstCost) : computedEstCost;

  const lifeR = 0.12 / 12;
  const lifeN = yearsAhead * 12;
  const canCalcLifeSip = estimatedCostValue > 0 && lifeN > 0;
  const lifeSip = canCalcLifeSip
    ? Math.round(estimatedCostValue / (((Math.pow(1 + lifeR, lifeN) - 1) / lifeR) * (1 + lifeR)))
    : 0;

  const sipToggleJSX = (
    <div className="flex p-0.5 rounded-full" style={{ background: "#ECECF1" }}>
      {["SIP", "1-time"].map(opt => (
        <button key={opt} onClick={() => setSip(opt === "SIP")} className="px-3 py-1 text-xs" style={{
          borderRadius: 999,
          background: (sip ? "SIP" : "1-time") === opt ? "#fff" : "transparent",
          fontWeight: (sip ? "SIP" : "1-time") === opt ? 600 : 500,
          boxShadow: (sip ? "SIP" : "1-time") === opt ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
        }}>{opt}</button>
      ))}
    </div>
  );

  const importanceJSX = (
    <Field label="How Important is this goal?">
      <div className="flex gap-2">
        {["Essential", "Important", "Aspirational"].map(opt => {
          const active = importance === opt;
          return (
            <button key={opt} onClick={() => setImportance(opt)} className="flex-1 py-2" style={{
              border: active ? "1.5px solid var(--brand)" : "1px solid var(--border)",
              borderRadius: 10,
              background: active ? "var(--brand-soft-2)" : "#fff",
              color: active ? "var(--brand)" : "var(--ink)",
              fontSize: 13, fontWeight: active ? 600 : 500,
            }}>{opt}</button>
          );
        })}
      </div>
    </Field>
  );

  const forWhomJSX = (
    <Field label="Who is this for?">
      <div className="relative flex items-center" style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <select
          value={forWhom}
          onChange={e => setForWhom(e.target.value)}
          className="w-full px-3 py-2.5 outline-none appearance-none bg-transparent"
          style={{ fontSize: 14, cursor: "pointer", color: forWhom ? "var(--ink)" : "#9CA3AF" }}
        >
          <option value="">Select</option>
          <option value="Myself">Myself</option>
          {MOCK.familyGroups.map(g => (
            <option key={g.id} value={g.name}>{g.name}</option>
          ))}
        </select>
        <span className="absolute right-3 pointer-events-none">
          <Icon name="chevron-down" size={16} color="#9CA3AF" />
        </span>
      </div>
    </Field>
  );

  // ---- Retirement form ----
  if (isRetirement) {
    return (
      <div className="absolute inset-0 flex flex-col" style={{ background: "#fff" }}>
        <SubHeader title={editing ? "Edit Goal" : "Create Goal"} />
        <div className="scroll-area flex-1 overflow-y-auto px-4 py-4 pb-28">

          <Field label="Goal Name">
            <input
              value={goalName}
              onChange={e => setGoalName(e.target.value)}
              placeholder="My Retirement Goal"
              className="w-full px-3 py-2.5 outline-none"
              style={{ border: "1px solid var(--border)", borderRadius: 10, fontSize: 14 }}
            />
          </Field>

          {importanceJSX}
          {forWhomJSX}

          <SliderField
            label="Retirement Age"
            min={60} max={80}
            value={retireAge}
            onChange={v => { setRetireAge(v); setCorpusOverride(null); }}
            showEmptyWhenZero
          />
          <SliderField
            label="Life Expectancy"
            min={60} max={100}
            value={lifeExp}
            onChange={v => { setLifeExp(v); setCorpusOverride(null); }}
            showEmptyWhenZero
          />

          <div className="mb-4 p-4" style={{ background: "#EDE8FB", borderRadius: 12, border: "1px solid #ECEAF6" }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1" style={{ fontSize: 13, color: "#6B7280" }}>
                <span>Recommended Retirement Corpus</span>
                <Icon name="info" size={13} color="#9CA3AF" />
              </div>
              <div className="text-right flex-shrink-0">
                <Masked style={{ fontSize: 20, fontWeight: 700, color: "var(--brand)" }}>
                  {corpusDisplay}
                </Masked>
                <div>
                  <button onClick={() => setCorpusOpen(true)} style={{ color: "var(--brand)", fontSize: 13, fontWeight: 600 }}>Modify amount</button>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div style={{ fontSize: 14, fontWeight: 600 }}>Suggested Investment</div>
              {sipToggleJSX}
            </div>
            <div className="text-center mt-3">
              <Masked style={{ fontSize: 24, fontWeight: 700 }}>{retireSipDisplay}</Masked>
              <button onClick={() => setSuggestOpen(true)} className="block mx-auto mt-1" style={{ color: "var(--brand)", fontSize: 12, fontWeight: 600 }}>See how it's calculated</button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={() => app.go("goals")} className="w-full py-3 text-white" style={{ background: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 15 }}>
            Save Changes
          </button>
        </div>

        <ModifyCorpusSheet
          open={corpusOpen}
          onClose={() => setCorpusOpen(false)}
          value={Math.max(0, Math.round(displayRawCorpus))}
          setValue={setCorpusOverride}
        />
        <SuggestedInvestmentSheet
          open={suggestOpen}
          onClose={() => setSuggestOpen(false)}
          value={canCalcRetireSip ? retireSip : 65000}
          setValue={() => {}}
          sip={sip}
          setSip={setSip}
        />
      </div>
    );
  }

  // ---- Life Goal form ----
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#fff" }}>
      <SubHeader title={editing ? "Edit Goal" : "Create Goal"} />
      <div className="scroll-area flex-1 overflow-y-auto px-4 py-4 pb-40">

        <Field label="Goal Name">
          <input
            value={goalName}
            onChange={e => setGoalName(e.target.value)}
            placeholder={namePlaceholders[goalType] || "My Goal"}
            className="w-full px-3 py-2.5 outline-none"
            style={{ border: "1px solid var(--border)", borderRadius: 10, fontSize: 14 }}
          />
        </Field>

        {importanceJSX}
        {forWhomJSX}

        <Field label="When do you need this?">
          <button
            onClick={() => setDateOpen(true)}
            className="w-full flex items-center gap-2 px-3 py-2.5"
            style={{ border: "1px solid var(--border)", borderRadius: 10, fontSize: 14 }}
          >
            <Icon name="calendar" size={14} color="#6B7280" />
            <span style={{ color: selectedDate ? "var(--ink)" : "#9CA3AF" }}>
              {selectedDate || "Select Date"}
            </span>
          </button>
        </Field>

        <Field label="When does this goal cost today?">
          <div className="flex items-center px-3 py-2.5" style={{ border: "1px solid var(--border)", borderRadius: 10 }}>
            <span style={{ fontSize: 14, color: "#6B7280", marginRight: 4 }}>₹</span>
            <input
              type="text"
              value={todayCost > 0 ? todayCost.toLocaleString("en-IN") : ""}
              onChange={e => {
                const n = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
                setTodayCost(n);
              }}
              placeholder="Enter Amount"
              className="flex-1 outline-none"
              style={{ fontSize: 14 }}
            />
          </div>
        </Field>

        <div className="mb-4">
          <div className="ink-2 mb-1.5" style={{ fontSize: 12 }}>
            Estimated cost of the goal in {selectedYear || "—"}
          </div>
          <input
            readOnly
            value={estimatedCostValue > 0 ? `₹${estimatedCostValue.toLocaleString("en-IN")}` : ""}
            className="w-full px-3 py-2.5 outline-none"
            style={{ border: "1px solid var(--border)", borderRadius: 10, fontSize: 14, background: "#F9F9F9", color: "#6B7280" }}
          />
          <div className="mt-1" style={{ fontSize: 11, color: "#9CA3AF" }}>
            We've adjusted this for inflation automatically, but feel free to edit.
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div style={{ fontSize: 14, fontWeight: 600 }}>Suggested Investment</div>
            {sipToggleJSX}
          </div>
          <div className="text-center mt-3">
            <Masked style={{ fontSize: 24, fontWeight: 700 }}>
              {canCalcLifeSip
                ? `₹${lifeSip.toLocaleString("en-IN")} / month`
                : "₹..... / month"}
            </Masked>
            <button onClick={() => setSuggestOpen(true)} className="block mx-auto mt-1" style={{ color: "var(--brand)", fontSize: 12, fontWeight: 600 }}>
              See how it's calculated
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3 flex gap-3" style={{ borderTop: "1px solid #E9EAEB" }}>
        <button
          onClick={() => app.go("goal-funding", { goalId: "new", mode: "new" })}
          className="flex-1 py-3"
          style={{ border: "1.5px solid var(--brand)", color: "var(--brand)", borderRadius: 10, fontWeight: 600, fontSize: 14, background: "#fff" }}
        >
          Add Goal Funding
        </button>
        <button
          onClick={() => editing ? app.go("goals") : app.go("goal-success", { name: goalName || namePlaceholders[goalType] })}
          className="flex-1 py-3 text-white"
          style={{ background: "var(--brand)", borderRadius: 10, fontWeight: 600, fontSize: 14 }}
        >
          {editing ? "Save Changes" : "Add Goal"}
        </button>
      </div>

      <DatePickerSheet open={dateOpen} onClose={() => setDateOpen(false)} value={selectedDate} onChange={setSelectedDate} />
      <SuggestedInvestmentSheet
        open={suggestOpen}
        onClose={() => setSuggestOpen(false)}
        value={canCalcLifeSip ? lifeSip : 20000}
        setValue={() => {}}
        sip={sip}
        setSip={setSip}
      />
    </div>
  );
}

const Field = ({ label, children }) => (
  <div className="mb-4">
    <div className="ink-2 mb-1.5" style={{ fontSize: 12 }}>{label}</div>
    {children}
  </div>
);

const SliderField = ({ label, min, max, value, onChange, showEmptyWhenZero = false }) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-1.5">
      <div className="ink-2" style={{ fontSize: 12 }}>{label}</div>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <input
          type="range"
          min={min}
          max={max}
          value={value || min}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: "var(--brand)" }}
        />
        <div className="flex justify-between ink-3 mt-0.5" style={{ fontSize: 10 }}>
          <span>{min}</span><span>{max}</span>
        </div>
      </div>
      <input
        type="text"
        value={(showEmptyWhenZero && value === 0) ? "" : value}
        onChange={e => {
          const n = Number(e.target.value.replace(/[^0-9]/g, ""));
          if (!isNaN(n) && n >= min && n <= max) onChange(n);
        }}
        style={{ width: 54, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8, textAlign: "center", fontWeight: 600, fontSize: 14, outline: "none" }}
      />
    </div>
  </div>
);

// -------------------------------------------------------------------------
// Date Picker Sheet
// -------------------------------------------------------------------------
function DatePickerSheet({ open, onClose, value, onChange }) {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const YEARS = [];
  for (let y = 2025; y <= 2055; y++) YEARS.push(String(y));

  const parts = (value || "").split(" ");
  const [selMonth, setSelMonth] = useStateG(parts[0] || "");
  const [selYear, setSelYear] = useStateG(parts[1] || "");

  React.useEffect(() => {
    if (open) {
      const p = (value || "").split(" ");
      setSelMonth(p[0] || "");
      setSelYear(p[1] || "");
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="absolute inset-0" style={{ zIndex: 50 }}>
      <div className="backdrop-in absolute inset-0" onClick={onClose} style={{ background: "rgba(40,42,60,0.55)" }} />
      <div className="sheet-in absolute left-0 right-0 bottom-0 bg-white" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden" }}>
        <div className="flex justify-between items-center px-4 pt-4 pb-3">
          <div style={{ fontSize: 17, fontWeight: 700 }}>Select Date</div>
          <button onClick={onClose} className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28 }}>
            <Icon name="x" size={18} color="#111" />
          </button>
        </div>
        <div className="flex" style={{ borderTop: "1px solid var(--border)" }}>
          <div style={{ flex: 1, fontWeight: 700, fontSize: 12, color: "#9CA3AF", padding: "8px 0 4px", textAlign: "center" }}>MONTH</div>
          <div style={{ width: 1, background: "var(--border)" }} />
          <div style={{ flex: 1, fontWeight: 700, fontSize: 12, color: "#9CA3AF", padding: "8px 0 4px", textAlign: "center" }}>YEAR</div>
        </div>
        <div className="flex" style={{ height: 260, borderTop: "1px solid var(--border)" }}>
          <div className="scroll-area" style={{ flex: 1, overflowY: "auto" }}>
            {MONTHS.map(m => (
              <button
                key={m}
                onClick={() => setSelMonth(m)}
                style={{
                  display: "block", width: "100%", padding: "11px 16px",
                  textAlign: "center", fontSize: 15,
                  fontWeight: selMonth === m ? 700 : 400,
                  color: selMonth === m ? "var(--brand)" : "var(--ink)",
                  background: selMonth === m ? "var(--brand-soft-2)" : "transparent",
                }}
              >{m}</button>
            ))}
          </div>
          <div style={{ width: 1, background: "var(--border)" }} />
          <div className="scroll-area" style={{ flex: 1, overflowY: "auto" }}>
            {YEARS.map(y => (
              <button
                key={y}
                onClick={() => setSelYear(y)}
                style={{
                  display: "block", width: "100%", padding: "11px 16px",
                  textAlign: "center", fontSize: 15,
                  fontWeight: selYear === y ? 700 : 400,
                  color: selYear === y ? "var(--brand)" : "var(--ink)",
                  background: selYear === y ? "var(--brand-soft-2)" : "transparent",
                }}
              >{y}</button>
            ))}
          </div>
        </div>
        <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => { if (selMonth && selYear) { onChange(`${selMonth} ${selYear}`); onClose(); } }}
            className="w-full py-3 text-white"
            style={{
              background: (selMonth && selYear) ? "var(--brand)" : "#D1D5DB",
              borderRadius: 12, fontWeight: 600, fontSize: 15,
            }}
          >Done</button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// Modify Corpus Sheet
// -------------------------------------------------------------------------
function ModifyCorpusSheet({ open, onClose, value, setValue }) {
  const [draft, setDraft] = useStateG(value);
  React.useEffect(() => { if (open) setDraft(value); }, [open, value]);
  if (!open) return null;
  return (
    <div className="absolute inset-0" style={{ zIndex: 50 }}>
      <div className="backdrop-in absolute inset-0" onClick={onClose} style={{ background: "rgba(40,42,60,0.55)" }} />
      <div className="sheet-in absolute left-0 right-0 bottom-0 bg-white" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: "14px 16px 18px", overflow: "hidden" }}>
        <div className="flex justify-between items-center">
          <div style={{ fontSize: 17, fontWeight: 700 }}>Retirement Corpus</div>
          <button onClick={onClose} className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28 }}><Icon name="x" size={18} color="#111"/></button>
        </div>
        <div className="ink-2 mt-2" style={{ fontSize: 13, lineHeight: 1.5 }}>You can adjust the retirement corpus here, inputs will remain unchanged.</div>
        <div className="mt-3">
          <div className="ink-2 mb-1.5" style={{ fontSize: 12 }}>Update your retirement amount</div>
          <input type="text" value={`₹${draft.toLocaleString("en-IN")}`} onChange={e => {
            const n = Number(e.target.value.replace(/[^0-9]/g, ""));
            if (!isNaN(n)) setDraft(n);
          }} className="w-full px-3 py-2.5 outline-none" style={{ border: "1.5px solid var(--brand)", borderRadius: 10, fontSize: 16, fontWeight: 600 }} />
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-3" style={{ border: "1.5px solid var(--brand)", color: "var(--brand)", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>Cancel</button>
          <button onClick={() => { setValue(draft); onClose(); }} className="flex-1 py-3 text-white" style={{ background: "var(--brand)", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>Update Amount</button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// Suggested Investment Sheet
// -------------------------------------------------------------------------
function SuggestedInvestmentSheet({ open, onClose, value, setValue, sip, setSip }) {
  const [target, setTarget] = useStateG(80000000);
  const [date, setDate] = useStateG("04/2055");
  const [returnRate, setReturnRate] = useStateG(12);
  if (!open) return null;
  return (
    <div className="absolute inset-0" style={{ zIndex: 50 }}>
      <div className="backdrop-in absolute inset-0" onClick={onClose} style={{ background: "rgba(40,42,60,0.55)" }} />
      <div className="sheet-in absolute left-0 right-0 bottom-0 bg-white" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden", maxHeight: "85%" }}>
        <div className="flex justify-center pt-2 pb-1">
          <div style={{ width: 44, height: 4, background: "#E5E7EB", borderRadius: 2 }} />
        </div>
        <div className="flex items-center justify-between px-4 py-2">
          <div style={{ fontSize: 17, fontWeight: 700 }}>Suggested Investment</div>
          <button onClick={onClose} className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28 }}><Icon name="x" size={18} color="#111"/></button>
        </div>
        <div className="scroll-area overflow-y-auto px-4 pb-3" style={{ maxHeight: 480 }}>
          <div className="text-center mt-2">
            <Masked style={{ fontSize: 32, fontWeight: 700 }}>&#8377;{value.toLocaleString("en-IN")}</Masked>
            <div className="ink-2" style={{ fontSize: 12 }}>per month</div>
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <Radio active={sip} onClick={() => setSip(true)} label="SIP" />
            <Radio active={!sip} onClick={() => setSip(false)} label="Lump sum" />
          </div>

          <Field label="Expected Goal Amount">
            <input type="text" value={`₹${target.toLocaleString("en-IN")}`} onChange={e => {
              const n = Number(e.target.value.replace(/[^0-9]/g, ""));
              if (!isNaN(n)) setTarget(n);
            }} className="w-full px-3 py-2.5 outline-none" style={{ border: "1px solid var(--border)", borderRadius: 10, fontSize: 14 }} />
          </Field>
          <Field label="Target Date">
            <div className="flex items-center gap-2 px-3 py-2.5" style={{ border: "1px solid var(--border)", borderRadius: 10 }}>
              <Icon name="calendar" size={14} color="#6B7280" />
              <input value={date} onChange={e => setDate(e.target.value)} className="flex-1 outline-none" style={{ fontSize: 14 }} />
            </div>
          </Field>
          <Field label={<span className="flex items-center justify-between w-full"><span>Annual Return Rate</span><span style={{ padding: "4px 10px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, fontWeight: 600 }}>{returnRate}%</span></span>}>
            <input type="range" min={0} max={20} value={returnRate} onChange={e => setReturnRate(Number(e.target.value))} className="w-full" style={{ accentColor: "var(--brand)" }} />
          </Field>
          <Field label="SIP Frequency">
            <button className="w-full px-3 py-2.5 flex items-center justify-between" style={{ border: "1px solid var(--border)", borderRadius: 10, fontSize: 14 }}>
              <span>Monthly</span>
              <Icon name="chevron-down" size={16} color="#9CA3AF" />
            </button>
          </Field>
        </div>
        <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={() => onClose()} className="w-full py-3 text-white" style={{ background: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 15 }}>Done</button>
        </div>
      </div>
    </div>
  );
}

const Radio = ({ active, onClick, label }) => (
  <button onClick={onClick} className="flex items-center gap-2">
    <div style={{ width: 20, height: 20, borderRadius: 999, border: active ? "5px solid var(--brand)" : "1.5px solid var(--ink-3)" }} />
    <span style={{ fontSize: 14, fontWeight: active ? 600 : 500 }}>{label}</span>
  </button>
);

// -------------------------------------------------------------------------
// Goal Created Success
// -------------------------------------------------------------------------
function GoalSuccess() {
  const app = useApp();
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#fff" }}>
      <div style={{ background: "#fff" }}>
        <StatusBar dark />
        <div className="flex items-center justify-end px-4 py-2">
          <button onClick={() => app.go("goals")} className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }}><Icon name="x" size={20} color="#111"/></button>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ marginTop: -80 }}>
        <div className="fade-in rounded-full flex items-center justify-center" style={{ width: 116, height: 116, background: "#16A34A" }}>
          <Icon name="check" size={64} color="#fff" stroke={3} />
        </div>
        <div className="fade-in mt-6" style={{ fontSize: 22, fontWeight: 700 }}>Congratulations!</div>
        <div className="fade-in ink-2 mt-2" style={{ fontSize: 14 }}>Your {app.params.name || "Retirement"} Goal is created successfully!</div>
        <div className="fade-in mt-8 flex gap-3">
          <button onClick={() => app.go("goals")} className="px-5 py-2.5" style={{ border: "1.5px solid var(--brand)", color: "var(--brand)", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>Back to Goals</button>
          <button onClick={() => app.go("goal-detail", { goalId: "ret" })} className="px-5 py-2.5 text-white" style={{ background: "var(--brand)", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>View Goal</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Goals, GoalDetail, AddGoal, CreateGoal, GoalSuccess });
