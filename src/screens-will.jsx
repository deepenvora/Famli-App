// =========================================================================
// screens-will.jsx — Legacy Planning / Will Creation flow
// 5-step wizard + Will Summary page
// =========================================================================

const { useState: useStateWill } = React;

// ─── Mock asset list pulled from user's wealth ─────────────────────────────
const WILL_ASSET_OPTIONS = [
  { id: "stocks", icon: "bar-chart-3", label: "Stocks", value: "₹25.50 L" },
  { id: "mf", icon: "briefcase", label: "Mutual Funds", value: "₹45.00 L" },
  { id: "fd", icon: "piggy-bank", label: "Fixed Deposits", value: "₹2.50 L" },
  { id: "re", icon: "home", label: "Real Estate", value: "₹40.50 L" },
  { id: "nps", icon: "shield-check", label: "NPS", value: "₹8.20 L" },
  { id: "ppf", icon: "landmark", label: "PPF", value: "₹14.40 L" },
  { id: "gold", icon: "coins", label: "Gold / Silver", value: "₹5.20 L" },
  { id: "crypto", icon: "bitcoin", label: "Crypto", value: "₹9.89 L" },
];

const DEFAULT_BENEFICIARIES = [
  { id: "spouse", name: "Shalini Vora", relation: "Spouse", initial: "S", color: "#E91E63" },
  { id: "son", name: "Aarav Vora", relation: "Son (Minor)", initial: "A", color: "#0EA5E9", minor: true },
  { id: "daughter", name: "Mira Vora", relation: "Daughter", initial: "M", color: "#16A34A" },
  { id: "sister", name: "Priya Vora", relation: "Sister", initial: "P", color: "#D97706" },
];

// ─── Storage hook ──────────────────────────────────────────────────────────
const useWill = () => {
  // Module-level singleton (kept on window so it survives screen mounts)
  if (!window.__famliWill) {
    window.__famliWill = {
      created: false,
      personal: { fullName: "Deepen Vora", dob: "05/04/1990", address: "Flat 402, Lotus Heights, Koregaon Park, Pune 411001" },
      assets: ["stocks", "mf", "re", "ppf"],
      assetsCustom: [],
      beneficiaries: [
        { id: "spouse", name: "Shalini Vora", relation: "Spouse", initial: "S", color: "#E91E63", share: 50 },
        { id: "son", name: "Aarav Vora", relation: "Son (Minor)", initial: "A", color: "#0EA5E9", minor: true, share: 30 },
        { id: "daughter", name: "Mira Vora", relation: "Daughter", initial: "M", color: "#16A34A", share: 20 },
      ],
      guardian: { name: "Rajesh Vora", relation: "Father", phone: "9988220001", email: "rajesh@famli.life" },
      updated: null,
    };
  }
  return window.__famliWill;
};

// ─── Step bar ──────────────────────────────────────────────────────────────
const STEP_LABELS = ["Personal", "Assets", "Beneficiary", "Guardian", "Review"];

const StepBar = ({ step }) => (
  <div className="px-4 pt-3 pb-4" style={{ background: "#fff", borderBottom: "1px solid var(--border)" }}>
    <div className="flex items-center justify-between">
      {STEP_LABELS.map((l, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <React.Fragment key={l}>
            <div className="flex flex-col items-center" style={{ width: 50 }}>
              <div className="rounded-full flex items-center justify-center" style={{
                width: 28, height: 28,
                background: done ? "var(--brand)" : active ? "#fff" : "#F4F5F7",
                border: active ? "2px solid var(--brand)" : done ? "2px solid var(--brand)" : "2px solid var(--border)",
                color: done ? "#fff" : active ? "var(--brand)" : "var(--ink-3)",
                fontSize: 12, fontWeight: 700,
                transition: "all 200ms ease",
              }}>
                {done ? <Icon name="check" size={14} color="#fff" stroke={3} /> : (i + 1)}
              </div>
              <div className="mt-1 text-center" style={{
                fontSize: 9, fontWeight: active ? 700 : 500,
                color: active ? "var(--brand)" : done ? "var(--ink)" : "var(--ink-3)",
                lineHeight: 1.1
              }}>{l}</div>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className="flex-1" style={{ height: 2, marginTop: -12, background: i < step ? "var(--brand)" : "var(--border)", margin: "0 -4px", marginTop: -12 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

// ─── Will Creation wizard host ─────────────────────────────────────────────
function WillCreation() {
  const app = useApp();
  const will = useWill();
  // start at the step passed in params, or 0
  const [step, setStep] = useStateWill(app.params.startStep || 0);

  // Local drafts for each step (synced on Next)
  const [personal, setPersonal] = useStateWill({ ...will.personal });
  const [assets, setAssets] = useStateWill([...will.assets]);
  const [assetsCustom, setAssetsCustom] = useStateWill([...will.assetsCustom]);
  const [beneficiaries, setBeneficiaries] = useStateWill([...will.beneficiaries]);
  const [guardian, setGuardian] = useStateWill({ ...will.guardian });

  const commit = () => {
    will.personal = personal;
    will.assets = assets;
    will.assetsCustom = assetsCustom;
    will.beneficiaries = beneficiaries;
    will.guardian = guardian;
  };

  const next = () => {
    commit();
    if (step < 4) setStep(step + 1);
  };
  const prev = () => {
    if (step > 0) setStep(step - 1);
    else app.back();
  };

  const submit = () => {
    commit();
    will.created = true;
    will.updated = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    app.go("will-success");
  };

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)" }}>
        <StatusBar dark />
        <div className="flex items-center px-4 py-3 gap-3">
          <button onClick={prev} className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }}>
            <Icon name="arrow-left" size={22} color="#111" stroke={2.2} />
          </button>
          <div>
            <div className="ink-3" style={{ fontSize: 11, lineHeight: 1 }}>Step {step + 1} of 5</div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Will Creation</div>
          </div>
        </div>
      </div>

      <StepBar step={step} />

      <div className="scroll-area flex-1 overflow-y-auto px-4 py-4 pb-28">
        {step === 0 && <StepPersonal value={personal} onChange={setPersonal} />}
        {step === 1 && <StepAssets selected={assets} setSelected={setAssets} custom={assetsCustom} setCustom={setAssetsCustom} />}
        {step === 2 && <StepBeneficiaries items={beneficiaries} setItems={setBeneficiaries} />}
        {step === 3 && <StepGuardian value={guardian} onChange={setGuardian} />}
        {step === 4 && <StepReview personal={personal} assets={assets} assetsCustom={assetsCustom} beneficiaries={beneficiaries} guardian={guardian} onJump={(s) => { commit(); setStep(s); }} />}
      </div>

      {/* Sticky CTA */}
      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex gap-2">
          <button onClick={prev} className="px-4 py-3" style={{ border: "1.5px solid var(--brand)", color: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 14, minWidth: 100 }}>
            {step === 0 ? "Cancel" : "Back"}
          </button>
          {step < 4 ? (
            <button onClick={next} className="flex-1 py-3 text-white flex items-center justify-center gap-1" style={{ background: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 15 }}>
              Continue <Icon name="arrow-right" size={16} color="#fff" />
            </button>
          ) : (
            <button onClick={submit} className="flex-1 py-3 text-white flex items-center justify-center gap-2" style={{ background: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 15 }}>
              <Icon name="check-circle-2" size={16} color="#fff" /> Create Will
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step 1: Personal Info ─────────────────────────────────────────────────
const Field = ({ label, children, hint }) => (
  <div className="mb-4">
    <div className="ink-2 mb-1.5" style={{ fontSize: 12, fontWeight: 500 }}>{label}</div>
    {children}
    {hint && <div className="ink-3 mt-1" style={{ fontSize: 11 }}>{hint}</div>}
  </div>
);

const TextInput = (props) => (
  <input
    {...props}
    className="w-full px-3 py-2.5 outline-none"
    style={{ border: "1px solid var(--border)", borderRadius: 10, fontSize: 14, ...(props.style || {}) }}
  />
);

const TextArea = (props) => (
  <textarea
    {...props}
    rows={props.rows || 3}
    className="w-full px-3 py-2.5 outline-none resize-none"
    style={{ border: "1px solid var(--border)", borderRadius: 10, fontSize: 14, ...(props.style || {}) }}
  />
);

function StepPersonal({ value, onChange }) {
  return (
    <div className="fade-in">
      <SectionIntro icon="user-round" title="Tell us about yourself" sub="This information goes into your legal will. Use the name as on your PAN." />
      <Field label="Full Name (as on PAN)">
        <TextInput value={value.fullName} onChange={e => onChange({ ...value, fullName: e.target.value })} placeholder="Deepen Vora" />
      </Field>
      <Field label="Date of Birth">
        <div className="flex items-center gap-2 px-3 py-2.5" style={{ border: "1px solid var(--border)", borderRadius: 10 }}>
          <Icon name="calendar" size={14} color="#6B7280" />
          <input value={value.dob} onChange={e => onChange({ ...value, dob: e.target.value })} placeholder="DD/MM/YYYY" className="flex-1 outline-none" style={{ fontSize: 14 }} />
        </div>
      </Field>
      <Field label="Residential Address" hint="This will be referenced in the will declaration.">
        <TextArea value={value.address} onChange={e => onChange({ ...value, address: e.target.value })} placeholder="House, street, city, state, PIN" />
      </Field>
    </div>
  );
}

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

// ─── Step 2: Assets ───────────────────────────────────────────────────────
function StepAssets({ selected, setSelected, custom, setCustom }) {
  const app = useApp();
  const [adding, setAdding] = useStateWill(false);
  const [draft, setDraft] = useStateWill({ label: "", value: "" });

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleCustom = (id) => setCustom(c => c.map(x => x.id === id ? { ...x, selected: !x.selected } : x));
  const removeCustom = (id) => setCustom(c => c.filter(x => x.id !== id));

  const addAsset = () => {
    if (!draft.label.trim()) { app.toast("Enter asset name"); return; }
    setCustom([...custom, { id: `c-${Date.now()}`, icon: "package", label: draft.label, value: draft.value || "—", selected: true, custom: true }]);
    setDraft({ label: "", value: "" });
    setAdding(false);
  };

  return (
    <div className="fade-in">
      <SectionIntro icon="briefcase" title="Choose assets to include" sub="Pick from your tracked wealth or add anything else (jewellery, art, vehicles)." />

      <div className="card divide-y" style={{ borderColor: "var(--border)" }}>
        {WILL_ASSET_OPTIONS.map(a => {
          const active = selected.includes(a.id);
          return (
            <button key={a.id} onClick={() => toggle(a.id)} className="flex items-center w-full px-4 py-3 gap-3 text-left">
              <Checkbox active={active} />
              <IconCircle icon={a.icon} />
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 14, fontWeight: 600 }}>{a.label}</div>
                <Masked style={{ fontSize: 11, color: "var(--ink-2)" }}>{a.value}</Masked>
              </div>
            </button>
          );
        })}
        {custom.map(a => (
          <button key={a.id} onClick={() => toggleCustom(a.id)} className="flex items-center w-full px-4 py-3 gap-3 text-left">
            <Checkbox active={a.selected} />
            <IconCircle icon={a.icon} bg="#FFF1DA" color="#9A4F00" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5" style={{ fontSize: 14, fontWeight: 600 }}>
                {a.label}
                <span className="chip" style={{ background: "#FFE7C2", color: "#9A5A00" }}>Custom</span>
              </div>
              <div className="ink-2" style={{ fontSize: 11 }}>{a.value}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); removeCustom(a.id); }} className="rounded-full" style={{ padding: 4 }}>
              <Icon name="trash-2" size={14} color="#9CA3AF" />
            </button>
          </button>
        ))}
      </div>

      {adding ? (
        <div className="card mt-3 p-3 fade-in">
          <Field label="Asset name">
            <TextInput value={draft.label} onChange={e => setDraft({ ...draft, label: e.target.value })} placeholder="e.g. Gold jewellery" />
          </Field>
          <Field label="Approximate value">
            <TextInput value={draft.value} onChange={e => setDraft({ ...draft, value: e.target.value })} placeholder="₹ 5,00,000" />
          </Field>
          <div className="flex gap-2">
            <button onClick={() => setAdding(false)} className="flex-1 py-2.5" style={{ border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>Cancel</button>
            <button onClick={addAsset} className="flex-1 py-2.5 text-white" style={{ background: "var(--brand)", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>Add Asset</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="mt-3 flex items-center justify-center gap-2 w-full py-2.5" style={{ border: "1.5px dashed var(--brand)", color: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 14 }}>
          <Icon name="plus" size={16} color="#5B2EE0" stroke={2.4} /> Add another asset
        </button>
      )}

      <div className="ink-2 mt-3 text-center" style={{ fontSize: 11 }}>
        {selected.length + custom.filter(c => c.selected).length} asset{(selected.length + custom.filter(c => c.selected).length) === 1 ? "" : "s"} selected
      </div>
    </div>
  );
}

const Checkbox = ({ active }) => (
  <div className="rounded flex items-center justify-center shrink-0" style={{
    width: 20, height: 20, borderRadius: 6,
    border: active ? "2px solid var(--brand)" : "2px solid var(--border)",
    background: active ? "var(--brand)" : "#fff",
    transition: "all 150ms ease",
  }}>
    {active && <Icon name="check" size={12} color="#fff" stroke={3} />}
  </div>
);

// ─── Step 3: Beneficiaries with share allocation ───────────────────────────
function StepBeneficiaries({ items, setItems }) {
  const app = useApp();
  const [picker, setPicker] = useStateWill(false);
  const [adding, setAdding] = useStateWill(false);
  const [draft, setDraft] = useStateWill({ name: "", relation: "" });

  const totalShare = items.reduce((s, b) => s + (Number(b.share) || 0), 0);
  const valid = totalShare === 100 && items.length > 0;

  const updateShare = (id, v) => {
    const n = Math.max(0, Math.min(100, Number(v) || 0));
    setItems(items.map(b => b.id === id ? { ...b, share: n } : b));
  };
  const removeB = (id) => setItems(items.filter(b => b.id !== id));
  const splitEqually = () => {
    if (!items.length) return;
    const each = Math.floor(100 / items.length);
    const rem = 100 - each * items.length;
    setItems(items.map((b, i) => ({ ...b, share: each + (i === 0 ? rem : 0) })));
  };

  const pickFromFamily = (m) => {
    if (items.find(x => x.id === m.id)) { app.toast("Already added"); setPicker(false); return; }
    setItems([...items, { ...m, share: 0 }]);
    setPicker(false);
  };

  const addCustomBeneficiary = () => {
    if (!draft.name.trim() || !draft.relation.trim()) { app.toast("Enter name and relation"); return; }
    setItems([...items, { id: `c-${Date.now()}`, name: draft.name, relation: draft.relation, initial: draft.name[0].toUpperCase(), color: "#5B2EE0", share: 0, custom: true }]);
    setDraft({ name: "", relation: "" });
    setAdding(false);
  };

  return (
    <div className="fade-in">
      <SectionIntro icon="heart-handshake" title="Allocate your estate" sub="Add beneficiaries and split percentage shares. Total must equal 100%." />

      <div className="space-y-2">
        {items.map(b => (
          <div key={b.id} className="card p-3 flex items-center gap-3">
            <Avatar initial={b.initial} color={b.color} size={36} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5" style={{ fontSize: 14, fontWeight: 600 }}>
                {b.name}
                {b.minor && <span className="chip" style={{ background: "#FEF3C7", color: "#92400E" }}>Minor</span>}
              </div>
              <div className="ink-2" style={{ fontSize: 11 }}>{b.relation}</div>
              <input
                type="range" min={0} max={100} value={b.share || 0}
                onChange={e => updateShare(b.id, e.target.value)}
                className="w-full mt-1.5" style={{ accentColor: "var(--brand)" }}
              />
            </div>
            <div className="shrink-0 flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1" style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "2px 4px" }}>
                <input
                  type="number" min={0} max={100} value={b.share || 0}
                  onChange={e => updateShare(b.id, e.target.value)}
                  className="text-right outline-none" style={{ width: 36, fontSize: 14, fontWeight: 700 }}
                />
                <span className="ink-2" style={{ fontSize: 12 }}>%</span>
              </div>
              <button onClick={() => removeB(b.id)} className="ink-3" style={{ fontSize: 11 }}>Remove</button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="card p-4 text-center ink-2" style={{ fontSize: 13 }}>
            No beneficiaries yet. Add at least one to continue.
          </div>
        )}
      </div>

      {/* Total bar */}
      <div className="mt-3 p-3 rounded-xl flex items-center justify-between" style={{
        background: valid ? "#F0FDF4" : totalShare > 100 ? "#FEE2E2" : "#FEF3C7",
        border: `1px solid ${valid ? "#DCFCE7" : totalShare > 100 ? "#FCA5A5" : "#FDE68A"}`
      }}>
        <div className="flex items-center gap-2" style={{ fontSize: 13, fontWeight: 600, color: valid ? "#15803D" : totalShare > 100 ? "#B91C1C" : "#92400E" }}>
          <Icon name={valid ? "check-circle-2" : "alert-triangle"} size={16} color={valid ? "#15803D" : totalShare > 100 ? "#B91C1C" : "#92400E"} />
          Total allocated: {totalShare}% / 100%
        </div>
        <button onClick={splitEqually} style={{ color: "var(--brand)", fontSize: 12, fontWeight: 600 }}>Split equally</button>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        <button onClick={() => setPicker(true)} className="flex items-center justify-center gap-1.5 py-2.5" style={{ border: "1.5px solid var(--brand)", color: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 13 }}>
          <Icon name="users" size={14} color="#5B2EE0" /> From Family
        </button>
        <button onClick={() => setAdding(true)} className="flex items-center justify-center gap-1.5 py-2.5" style={{ border: "1.5px dashed var(--brand)", color: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 13 }}>
          <Icon name="user-plus" size={14} color="#5B2EE0" /> Add New
        </button>
      </div>

      {/* Add custom inline */}
      {adding && (
        <div className="card mt-3 p-3 fade-in">
          <Field label="Beneficiary name">
            <TextInput value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="Full name" />
          </Field>
          <Field label="Relation to you">
            <TextInput value={draft.relation} onChange={e => setDraft({ ...draft, relation: e.target.value })} placeholder="e.g. Brother" />
          </Field>
          <div className="flex gap-2">
            <button onClick={() => setAdding(false)} className="flex-1 py-2.5" style={{ border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>Cancel</button>
            <button onClick={addCustomBeneficiary} className="flex-1 py-2.5 text-white" style={{ background: "var(--brand)", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>Add</button>
          </div>
        </div>
      )}

      {/* Family picker sheet */}
      {picker && (
        <div className="absolute inset-0" style={{ zIndex: 50 }}>
          <div className="backdrop-in absolute inset-0" onClick={() => setPicker(false)} style={{ background: "rgba(40,42,60,0.55)" }} />
          <div className="sheet-in absolute left-0 right-0 bottom-0 bg-white" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, overflow: "hidden", maxHeight: "75%" }}>
            <div className="flex justify-center pt-2 pb-1"><div style={{ width: 44, height: 4, background: "#E5E7EB", borderRadius: 2 }} /></div>
            <div className="flex items-center justify-between px-4 py-2">
              <div style={{ fontSize: 16, fontWeight: 700 }}>Choose Beneficiary</div>
              <button onClick={() => setPicker(false)} className="rounded-full flex items-center justify-center" style={{ width: 28, height: 28 }}><Icon name="x" size={18} color="#111"/></button>
            </div>
            <div className="px-4 pb-4 divide-y overflow-y-auto scroll-area" style={{ maxHeight: 360, borderColor: "var(--border)" }}>
              {DEFAULT_BENEFICIARIES.map(m => (
                <button key={m.id} onClick={() => pickFromFamily(m)} className="flex items-center w-full px-1 py-3 gap-3 text-left">
                  <Avatar initial={m.initial} color={m.color} size={36} />
                  <div className="flex-1">
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                    <div className="ink-2" style={{ fontSize: 12 }}>{m.relation}</div>
                  </div>
                  <Icon name="chevron-right" size={16} color="#9CA3AF" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 4: Guardian ──────────────────────────────────────────────────────
function StepGuardian({ value, onChange }) {
  return (
    <div className="fade-in">
      <SectionIntro icon="shield-half" title="Appoint a guardian" sub="Required if any beneficiary is a minor or has a dependent need. They will be contacted on execution." />

      <div className="card p-3 mb-4 flex items-start gap-2" style={{ background: "var(--brand-soft-2)", border: "1px solid #ECEAF6" }}>
        <Icon name="info" size={14} color="#5B2EE0" />
        <div className="ink-2" style={{ fontSize: 12, lineHeight: 1.5 }}>
          Choose someone you fully trust — typically a close family member who is at least 18 years old.
        </div>
      </div>

      <Field label="Guardian Name">
        <TextInput value={value.name} onChange={e => onChange({ ...value, name: e.target.value })} placeholder="Full name" />
      </Field>
      <Field label="Relationship">
        <TextInput value={value.relation} onChange={e => onChange({ ...value, relation: e.target.value })} placeholder="e.g. Brother, Friend" />
      </Field>
      <Field label="Phone">
        <div className="flex items-center gap-2 px-3 py-2.5" style={{ border: "1px solid var(--border)", borderRadius: 10 }}>
          <Icon name="phone" size={14} color="#6B7280" />
          <input value={value.phone} onChange={e => onChange({ ...value, phone: e.target.value })} placeholder="10-digit mobile" className="flex-1 outline-none" style={{ fontSize: 14 }} />
        </div>
      </Field>
      <Field label="Email">
        <div className="flex items-center gap-2 px-3 py-2.5" style={{ border: "1px solid var(--border)", borderRadius: 10 }}>
          <Icon name="mail" size={14} color="#6B7280" />
          <input type="email" value={value.email} onChange={e => onChange({ ...value, email: e.target.value })} placeholder="name@email.com" className="flex-1 outline-none" style={{ fontSize: 14 }} />
        </div>
      </Field>
    </div>
  );
}

// ─── Step 5: Review ───────────────────────────────────────────────────────
function StepReview({ personal, assets, assetsCustom, beneficiaries, guardian, onJump }) {
  const app = useApp();
  const allAssetLabels = [
    ...WILL_ASSET_OPTIONS.filter(a => assets.includes(a.id)).map(a => ({ id: a.id, icon: a.icon, label: a.label, value: a.value, custom: false })),
    ...assetsCustom.filter(c => c.selected).map(c => ({ id: c.id, icon: "package", label: c.label, value: c.value, custom: true })),
  ];
  const totalShare = beneficiaries.reduce((s, b) => s + (Number(b.share) || 0), 0);

  return (
    <div className="fade-in">
      <SectionIntro icon="file-check" title="Review your will" sub="Double-check everything below. You can tap a section to edit." />

      <ReviewSection title="Personal" onEdit={() => onJump(0)}>
        <ReviewRow k="Full Name" v={personal.fullName} />
        <ReviewRow k="DOB" v={personal.dob} />
        <ReviewRow k="Address" v={personal.address} wrap />
      </ReviewSection>

      <ReviewSection title={`Assets (${allAssetLabels.length})`} onEdit={() => onJump(1)}>
        {allAssetLabels.length === 0 ? (
          <div className="ink-3 px-3 py-2" style={{ fontSize: 12 }}>No assets selected</div>
        ) : allAssetLabels.map(a => (
          <div key={a.id} className="flex items-center px-3 py-2 gap-3">
            <IconCircle icon={a.icon} size={32} />
            <div className="flex-1" style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</div>
            <Masked style={{ fontSize: 12, color: "var(--ink-2)" }}>{a.value}</Masked>
          </div>
        ))}
      </ReviewSection>

      <ReviewSection title={`Beneficiaries (${beneficiaries.length})`} onEdit={() => onJump(2)} warning={totalShare !== 100 ? `Allocation: ${totalShare}% / 100%` : null}>
        {beneficiaries.map(b => (
          <div key={b.id} className="flex items-center px-3 py-2 gap-3">
            <Avatar initial={b.initial} color={b.color} size={32} />
            <div className="flex-1 min-w-0">
              <div style={{ fontSize: 13, fontWeight: 600 }}>{b.name}</div>
              <div className="ink-2" style={{ fontSize: 11 }}>{b.relation}</div>
            </div>
            <div className="text-right">
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--brand)" }}>{b.share || 0}%</div>
            </div>
          </div>
        ))}
      </ReviewSection>

      <ReviewSection title="Guardian" onEdit={() => onJump(3)}>
        <ReviewRow k="Name" v={guardian.name} />
        <ReviewRow k="Relation" v={guardian.relation} />
        <ReviewRow k="Phone" v={guardian.phone} />
        <ReviewRow k="Email" v={guardian.email} />
      </ReviewSection>

      <div className="card p-3 mt-3 flex gap-2" style={{ background: "var(--brand-soft-2)", border: "1px solid #ECEAF6" }}>
        <Icon name="lock" size={14} color="#5B2EE0" />
        <div className="ink-2" style={{ fontSize: 11, lineHeight: 1.5 }}>
          By submitting, you confirm the above details. We'll prepare a draft for legal review and store it in your Documents Vault.
        </div>
      </div>
    </div>
  );
}

const ReviewSection = ({ title, onEdit, children, warning }) => (
  <div className="card mt-3 overflow-hidden">
    <div className="flex items-center justify-between px-3 py-2.5" style={{ background: "#FAFAFB", borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2" style={{ fontSize: 13, fontWeight: 700 }}>
        {title}
        {warning && <span className="chip" style={{ background: "#FEF3C7", color: "#92400E" }}>{warning}</span>}
      </div>
      <button onClick={onEdit} className="flex items-center gap-1" style={{ color: "var(--brand)", fontSize: 12, fontWeight: 600 }}>
        <Icon name="pen-line" size={12} color="#5B2EE0" /> Edit
      </button>
    </div>
    <div className="divide-y" style={{ borderColor: "var(--border)" }}>{children}</div>
  </div>
);

const ReviewRow = ({ k, v, wrap }) => (
  <div className={"px-3 py-2 " + (wrap ? "" : "flex items-center justify-between gap-3")}>
    <div className="ink-2" style={{ fontSize: 12 }}>{k}</div>
    <div style={{ fontSize: 13, fontWeight: 500, marginTop: wrap ? 2 : 0, textAlign: wrap ? "left" : "right" }}>{v || "—"}</div>
  </div>
);

// ─── Will Intro / Summary (entry from Profile) ─────────────────────────────
function WillIntro() {
  const app = useApp();
  const will = useWill();
  if (will.created) return <WillSummary />;

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title="Legacy Planning" onBack={() => app.go("profile")} />

      <div className="scroll-area flex-1 overflow-y-auto">

        {/* Hero */}
        <img src="https://img.freepik.com/premium-photo/family-children-insurance-with-mother-father-boy-siblings-sitting-cardboard-living-room-home-together-kids-love-cover-with-boy-brother-parents-house_590464-96478.jpg" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 0, display: "block" }} />
        <div className="px-5 py-4" style={{ background: "#FFFFFF" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#1A1A2E", lineHeight: 1.3 }}>Make sure the people you love are taken care of.</div>
          <div className="mt-2" style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.5 }}>A legal will, reviewed by professionals and stored securely — done in ~10 minutes.</div>
        </div>

        {/* Why it matters */}
        <div className="px-5 py-6" style={{ background: "#fff" }}>
          <div className="mb-3" style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", textTransform: "uppercase", letterSpacing: "0.06em" }}>Why it matters</div>
          {[
            { icon: "shield", title: "Avoid family disputes", desc: "Make your wishes legally binding, not just assumed." },
            { icon: "heart", title: "Protect your children", desc: "Name a guardian if the unexpected happens." },
            { icon: "star", title: "Your assets, your rules", desc: "Decide exactly who gets what, in what proportion." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3" style={{ marginBottom: i < 2 ? 16 : 0 }}>
              <div className="flex items-center justify-center shrink-0" style={{ width: 38, height: 38, background: "#fff", border: "1px solid #D5D7DA", borderRadius: 8, padding: 8 }}>
                <Icon name={item.icon} size={18} color="#1A1A2E" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5, marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="px-5 py-6" style={{ background: "#F4F5F7" }}>
          <div className="mb-3" style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", textTransform: "uppercase", letterSpacing: "0.06em" }}>How it works</div>
          {[
            { icon: "user-round", title: "Personal Info", sub: "Your basic details and wishes" },
            { icon: "briefcase", title: "Assets", sub: "List what you own" },
            { icon: "users", title: "Beneficiaries", sub: "Who inherits what" },
            { icon: "baby", title: "Guardian", sub: "Who cares for your children" },
            { icon: "check-circle-2", title: "Review & Submit", sub: "Final check and sign-off" },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3" style={{ background: "#fff", border: "1px solid #E9EAEB", borderRadius: 12, padding: 12, marginBottom: i < 4 ? 8 : 0 }}>
              <div className="shrink-0 flex items-center justify-center" style={{ width: 24, color: "#5B21B6", fontSize: 12, fontWeight: 700 }}>
                {i + 1}
              </div>
              <div className="flex items-center justify-center shrink-0" style={{ width: 32, height: 32, background: "#fff", border: "1px solid #D5D7DA", borderRadius: 8 }}>
                <Icon name={step.icon} size={16} color="#1A1A2E" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{step.title}</div>
                <div style={{ fontSize: 12, color: "#6B7280" }}>{step.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="px-5 py-6" style={{ background: "#F9F5FF" }}>
          <div className="mb-3" style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", textTransform: "uppercase", letterSpacing: "0.06em" }}>You're in safe hands</div>
          <div className="flex gap-2">
            {[
              { icon: "shield-check", title: "SEBI Reviewed", desc: "Verified by registered legal advisors." },
              { icon: "lock", title: "Encrypted", desc: "Your data is private and never shared." },
              { icon: "clock-3", title: "~10 min", desc: "Most users finish in one sitting." },
            ].map((card, i) => (
              <div key={i} className="flex-1 text-center" style={{ background: "#fff", border: "1px solid #E9EAEB", borderRadius: 12, padding: 12 }}>
                <div className="flex items-center justify-center mx-auto mb-2" style={{ width: 36, height: 36, background: "#fff", border: "1px solid #D5D7DA", borderRadius: 8 }}>
                  <Icon name={card.icon} size={18} color="#1A1A2E" />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1A2E", lineHeight: 1.2 }}>{card.title}</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4, lineHeight: 1.4 }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Spacer so content clears the sticky CTA */}
        <div style={{ height: 88 }} />

      </div>

      {/* Sticky CTA */}
      <div className="px-5 py-4" style={{ position: "sticky", bottom: 0, background: "#fff", borderTop: "1px solid #E9EAEB", zIndex: 10 }}>
        <button onClick={() => app.go("will-create")} className="w-full text-white flex items-center justify-center" style={{ background: "#5B21B6", borderRadius: 12, height: 56, fontWeight: 600, fontSize: 16 }}>
          Create Your Will →
        </button>
      </div>
    </div>
  );
}

const Badge3 = ({ icon, t }) => (
  <div className="card p-3 text-center flex flex-col items-center gap-1.5">
    <Icon name={icon} size={20} color="#5B2EE0" />
    <div style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.2 }}>{t}</div>
  </div>
);

// ─── Will Summary (post-creation) ──────────────────────────────────────────
function WillSummary() {
  const app = useApp();
  const will = useWill();
  const allAssetLabels = [
    ...WILL_ASSET_OPTIONS.filter(a => will.assets.includes(a.id)).map(a => ({ id: a.id, icon: a.icon, label: a.label, value: a.value })),
    ...will.assetsCustom.filter(c => c.selected).map(c => ({ id: c.id, icon: "package", label: c.label, value: c.value })),
  ];
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--bg)" }}>
      <SubHeader title="My Will" onBack={() => app.go("profile")} right={<IconBtn onClick={() => app.toast("Will downloaded as PDF")}><Icon name="download" size={16} color="#fff"/></IconBtn>} />
      <div className="scroll-area flex-1 overflow-y-auto pb-28">
        <div className="px-4 pt-4">
          <div className="card p-4 flex items-center gap-3" style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)", border: "1px solid #DCFCE7" }}>
            <div className="rounded-full flex items-center justify-center" style={{ width: 44, height: 44, background: "#16A34A" }}>
              <Icon name="shield-check" size={22} color="#fff" />
            </div>
            <div className="flex-1">
              <div style={{ fontSize: 15, fontWeight: 700 }}>Your will is active</div>
              <div className="ink-2" style={{ fontSize: 12 }}>Last updated {will.updated || "today"}</div>
            </div>
            <Tag kind="success">Submitted</Tag>
          </div>
        </div>

        <ReviewSection title="Personal" onEdit={() => app.go("will-create", { startStep: 0 })}>
          <ReviewRow k="Full Name" v={will.personal.fullName} />
          <ReviewRow k="DOB" v={will.personal.dob} />
          <ReviewRow k="Address" v={will.personal.address} wrap />
        </ReviewSection>

        <ReviewSection title={`Assets (${allAssetLabels.length})`} onEdit={() => app.go("will-create", { startStep: 1 })}>
          {allAssetLabels.map(a => (
            <div key={a.id} className="flex items-center px-3 py-2 gap-3">
              <IconCircle icon={a.icon} size={32} />
              <div className="flex-1" style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</div>
              <Masked style={{ fontSize: 12, color: "var(--ink-2)" }}>{a.value}</Masked>
            </div>
          ))}
        </ReviewSection>

        <ReviewSection title={`Beneficiaries (${will.beneficiaries.length})`} onEdit={() => app.go("will-create", { startStep: 2 })}>
          {will.beneficiaries.map(b => (
            <div key={b.id} className="flex items-center px-3 py-2 gap-3">
              <Avatar initial={b.initial} color={b.color} size={32} />
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 13, fontWeight: 600 }}>{b.name}</div>
                <div className="ink-2" style={{ fontSize: 11 }}>{b.relation}</div>
              </div>
              <div className="text-right" style={{ fontSize: 14, fontWeight: 700, color: "var(--brand)" }}>{b.share || 0}%</div>
            </div>
          ))}
        </ReviewSection>

        <ReviewSection title="Guardian" onEdit={() => app.go("will-create", { startStep: 3 })}>
          <ReviewRow k="Name" v={will.guardian.name} />
          <ReviewRow k="Relation" v={will.guardian.relation} />
          <ReviewRow k="Phone" v={will.guardian.phone} />
          <ReviewRow k="Email" v={will.guardian.email} />
        </ReviewSection>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
        <button onClick={() => app.go("will-create")} className="w-full py-3 flex items-center justify-center gap-2" style={{ border: "1.5px solid var(--brand)", color: "var(--brand)", borderRadius: 12, fontWeight: 600, fontSize: 15 }}>
          <Icon name="pen-line" size={16} color="#5B2EE0" /> Modify Will
        </button>
      </div>
    </div>
  );
}

// ─── Success screen ────────────────────────────────────────────────────────
function WillSuccess() {
  const app = useApp();
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "#fff" }}>
      <div style={{ background: "#fff" }}>
        <StatusBar dark />
        <div className="flex items-center justify-end px-4 py-2">
          <button onClick={() => app.go("will-intro")} className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }}><Icon name="x" size={20} color="#111"/></button>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center" style={{ marginTop: -60 }}>
        <div className="fade-in rounded-full flex items-center justify-center" style={{ width: 116, height: 116, background: "linear-gradient(135deg, #16A34A 0%, #0E7E36 100%)", boxShadow: "0 12px 32px -6px rgba(22,163,74,0.45)" }}>
          <Icon name="shield-check" size={64} color="#fff" stroke={2.6} />
        </div>
        <div className="fade-in mt-6" style={{ fontSize: 22, fontWeight: 700 }}>Your Will is Created!</div>
        <div className="fade-in ink-2 mt-2" style={{ fontSize: 14, lineHeight: 1.5, maxWidth: 280 }}>
          Your legal will has been securely saved. A SEBI-registered advisor will review it within 48 hours.
        </div>
        <div className="fade-in mt-8 flex gap-3">
          <button onClick={() => app.go("profile")} className="px-5 py-2.5" style={{ border: "1.5px solid var(--brand)", color: "var(--brand)", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>Back to Profile</button>
          <button onClick={() => app.go("will-intro")} className="px-5 py-2.5 text-white" style={{ background: "var(--brand)", borderRadius: 10, fontWeight: 600, fontSize: 14 }}>View Will</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WillIntro, WillCreation, WillSummary, WillSuccess });
