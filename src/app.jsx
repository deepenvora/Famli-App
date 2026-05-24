// =========================================================================
// app.jsx — Router, history, global state, phone frame
// =========================================================================

const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA, useCallback } = React;

const App = () => {
  const [history, setHistory] = useStateA([{ screen: "dashboard", params: {} }]);
  const current = history[history.length - 1];
  const [masked, setMasked] = useStateA(false);
  const [profile, setProfile] = useStateA("Myself"); // global profile context
  const [sheet, setSheet] = useStateA(null);
  const [toastMsg, setToastMsg] = useStateA(null);
  const [confirm, setConfirm] = useStateA(null);

  const go = useCallback((screen, params = {}) => {
    setHistory(h => [...h, { screen, params }]);
  }, []);

  const back = useCallback(() => {
    setHistory(h => h.length > 1 ? h.slice(0, -1) : h);
  }, []);

  const replace = useCallback((screen, params = {}) => {
    setHistory(h => [...h.slice(0, -1), { screen, params }]);
  }, []);

  const openSheet = useCallback((name) => setSheet(name), []);
  const closeSheet = useCallback(() => setSheet(null), []);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => setToastMsg(null), 1900);
  }, []);

  const confirmFn = useCallback((message, onYes) => setConfirm({ message, onYes }), []);

  const ctx = useMemoA(() => ({
    screen: current.screen,
    params: current.params,
    masked, setMasked,
    profile, setProfile,
    go, back, replace,
    openSheet, closeSheet,
    toast,
    confirm: confirmFn,
  }), [current, masked, profile, go, back, replace, openSheet, closeSheet, toast, confirmFn]);

  // Map screens to components
  const renderScreen = () => {
    switch (current.screen) {
      case "dashboard": return <Dashboard />;
      case "wealth": return <Wealth tab="assets" profile={profile} />;
      case "wealth-liab": return <Wealth tab="liab" profile={profile} />;
      case "goals": return <Goals profile={profile} />;
      case "goal-detail": return <GoalDetail />;
      case "add-goal": return <AddGoal />;
      case "mf-list": return <MFList profile="Myself" />;
      case "mf-list-family": return <MFList profile="Family" />;
      case "mf-detail": return <MFDetail />;
      case "transactions": return <Transactions />;
      case "credit": return <Credit />;
      case "ai": return <AIAssistant />;
      case "profile": return <Profile />;
      case "settings": return <Settings />;
      case "help": return <HelpSupport />;
      case "create-goal": return <CreateGoal />;
      case "goal-success": return <GoalSuccess />;
      case "family-groups": return <FamilyGroupList />;
      case "family-group-detail": return <FamilyGroupDetail />;
      case "family-group-create": return <FamilyGroupCreate />;
      case "member-detail": return <MemberDetail />;
      case "notifications": return <Notifications />;
      case "advisory": return <Advisory />;
      case "documents": return <Documents />;
      case "document-detail": return <DocumentDetail />;
      case "will-intro": return <WillIntro />;
      case "will-create": return <WillCreation />;
      case "will-summary": return <WillSummary />;
      case "will-success": return <WillSuccess />;
      case "investments": return <MFList profile="Myself" />;
      case "insurance": return <ComingSoon title="Insurance" subtitle="Track life, health & motor policies" />;
      case "family": return <FamilyGroupList />;
      case "account-hygiene": return <AccountHygiene />;
      default: return <Dashboard />;
    }
  };

  // Auto-close profile-switch sheet on screen change so it doesn't linger
  useEffectA(() => { if (sheet === "profileSwitch") setSheet(null); }, [current.screen]);

  return (
    <AppCtx.Provider value={ctx}>
      <div className="phone fade-in" key={current.screen} style={{ position: "relative" }}>
        {renderScreen()}
        <ProfileSwitchSheet open={sheet === "profileSwitch"} onClose={closeSheet} />
        <ConfirmModal
          open={!!confirm}
          message={confirm?.message}
          onYes={() => { confirm?.onYes?.(); setConfirm(null); }}
          onNo={() => setConfirm(null)}
        />
        {toastMsg && <Toast msg={toastMsg} />}
      </div>
      <SideNote screen={current.screen} go={go} />
    </AppCtx.Provider>
  );
};

// -------------------------------------------------------------------------
// ComingSoon — small placeholder for tabs without dedicated mock
// -------------------------------------------------------------------------
const ComingSoon = ({ title, subtitle }) => {
  const app = useApp();
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <PurpleHeader label={title} profile="Myself" showEye />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ marginBottom: 90 }}>
        <div className="rounded-full flex items-center justify-center" style={{ width: 80, height: 80, background: "var(--brand-soft)" }}>
          <Icon name="hammer" size={36} color="#5B2EE0" />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 14 }}>{title}</div>
        <div className="ink-2 mt-1" style={{ fontSize: 13 }}>{subtitle}</div>
        <div className="ink-3 mt-3" style={{ fontSize: 12 }}>Coming soon to Famli</div>
      </div>
      <FAB />
      <BottomNav active={title.toLowerCase()} set={title === "Family" ? "goals" : "primary"} />
    </div>
  );
};

// -------------------------------------------------------------------------
// SideNote — floating screen index for fast navigation, beside the phone
// -------------------------------------------------------------------------
const SCREENS = [
  { key: "dashboard", label: "S1 Dashboard" },
  { key: "wealth", label: "S2 Wealth — Assets" },
  { key: "wealth-liab", label: "S3 Wealth — Liabilities" },
  { key: "goals", label: "S4 Goals List" },
  { key: "goal-detail", label: "S5 Goal Details" },
  { key: "add-goal", label: "S6 Add Goal · Picker" },
  { key: "create-goal", label: "S6b Create / Edit Goal" },
  { key: "goal-success", label: "S6c Goal Success" },
  { key: "transactions", label: "S7 Transactions" },
  { key: "credit", label: "S8 Credit" },
  { key: "ai", label: "S9 AI — Buddy" },
  { key: "profile", label: "S10 Profile" },
  { key: "settings", label: "S11 Settings" },
  { key: "help", label: "S12 Help & Support" },
  { key: "mf-list", label: "S14 Mutual Funds" },
  { key: "mf-detail", label: "S15 Fund Detail" },
  { key: "family-groups", label: "S16 Family Groups" },
  { key: "family-group-create", label: "S16b Family Group · Create" },
  { key: "family-group-detail", label: "S17 Family Group Detail" },
  { key: "member-detail", label: "S18 Member Detail" },
  { key: "notifications", label: "S19 Notifications" },
  { key: "advisory", label: "S20 Advisory" },
  { key: "documents", label: "S21 Documents" },
  { key: "document-detail", label: "S22 Document Detail" },
  { key: "will-intro", label: "S23 Will / Legacy" },
  { key: "will-create", label: "S24 Will Creation" },
  { key: "will-success", label: "S25 Will Success" },
  { key: "account-hygiene", label: "S26 Account Hygiene" },
];

const SideNote = ({ screen, go }) => {
  const [open, setOpen] = useStateA(false);
  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 70 }}>
      <button onClick={() => setOpen(o => !o)} className="rounded-full flex items-center gap-2 px-3 py-2" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", color: "#fff", fontSize: 12, backdropFilter: "blur(8px)" }}>
        <Icon name={open ? "x" : "list"} size={14} color="#fff" />
        Screen Index
      </button>
      {open && (
        <div className="fade-in mt-2 p-2" style={{ width: 230, background: "rgba(20,18,32,0.86)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, backdropFilter: "blur(12px)", maxHeight: "70vh", overflowY: "auto" }}>
          {SCREENS.map(s => (
            <button key={s.key} onClick={() => { go(s.key); setOpen(false); }} className="w-full text-left px-2 py-1.5" style={{ borderRadius: 8, color: screen === s.key ? "#fff" : "rgba(255,255,255,0.65)", background: screen === s.key ? "rgba(91,46,224,0.6)" : "transparent", fontSize: 12, fontWeight: screen === s.key ? 600 : 400 }}>
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
