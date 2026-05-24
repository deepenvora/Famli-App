// =========================================================================
// shared.jsx — Design tokens, mock data, and shared building blocks.
// All components attached to window at bottom for cross-script access.
// =========================================================================

const { useState, useEffect, useRef, useMemo, useContext, createContext } = React;

// ---------- Icon helper (Lucide) ----------
const Icon = ({ name, size = 20, color, stroke = 2, className = "", style = {} }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = "";
    const svg = window.lucide.createElement(window.lucide.icons[toPascal(name)] || window.lucide.icons.Circle);
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("stroke-width", stroke);
    if (color) svg.setAttribute("stroke", color);
    ref.current.appendChild(svg);
  }, [name, size, color, stroke]);
  return <span ref={ref} className={className} style={{ display: "inline-flex", lineHeight: 0, color, ...style }} />;
};
const toPascal = (s) => s.split("-").map(p => p[0].toUpperCase() + p.slice(1)).join("");

// ---------- Mock data ----------
const MOCK = {
  user: { name: "Deepen Vora", phone: "9980210859", initial: "D" },
  netWorth: { value: "₹46 L", change: "+12%", period: "1Y", positive: true },
  assetsTotal: { value: "₹64 L", change: "+18%", period: "1Y", positive: true },
  liabilitiesTotal: { value: "₹18 L", change: "−2%", period: "1Y", positive: false },
  myselfNet: { value: "₹2.3 Cr", change: "+₹2.5L (2.5%)", positive: true },
  familyNet: { value: "₹2.3 Cr", change: "+₹2.5L (2.5%)", positive: true },
  assetAllocation: [
    { label: "Real Estate", pct: 40, value: "₹40.5 L", change: "+₹10K (24.5%)", positive: true, color: "#7BC4E8" },
    { label: "Mutual Funds", pct: 25, value: "₹35.83 L", change: "−₹44K (8.5%)", positive: false, color: "#F0A6C6" },
    { label: "Stocks", pct: 18, value: "₹28.20 L", change: "−₹4K (12.1%)", positive: false, color: "#F0D67C" },
    { label: "Crypto", pct: 10, value: "₹9.89 L", change: "+₹19.8K (1.1%)", positive: true, color: "#B59FE6" },
    { label: "Others", pct: 7, value: "₹10 L", change: "+₹11K (4.1%)", positive: true, color: "#9CDCB3" },
  ],
  assetCategories: [
    { key: "mf", icon: "briefcase", label: "Mutual Funds", count: 5, alloc: "40% allocation", value: "₹45,00,000", rawValue: 4500000, change: "+₹10.50L (24.5%)", positive: true, navTo: "mf-list" },
    { key: "stocks", icon: "bar-chart-3", label: "Stocks", count: 10, alloc: "20% allocation", value: "₹25,50,033", rawValue: 2550033, change: "−₹2.50L (8.2%)", positive: false },
    { key: "bank", icon: "landmark", label: "Bank Accounts", count: 5, alloc: "20% allocation", value: "₹11,10,500", rawValue: 1110500, change: null },
    { key: "fd", icon: "piggy-bank", label: "Fixed Deposits", count: 4, alloc: "20% allocation", value: "₹2,50,000", rawValue: 250000, change: null },
    { key: "gold", icon: "coins", label: "Gold / Silver", count: 1, alloc: "10% allocation", value: "₹5,20,000", rawValue: 520000, change: "+₹2.10L (40%)", positive: true },
    { key: "re", icon: "home", label: "Real Estate", count: 2, alloc: "15% allocation", value: "₹40,50,000", rawValue: 4050000, change: "+₹4.00L (10.8%)", positive: true },
    { key: "crypto", icon: "bitcoin", label: "Crypto", count: 3, alloc: "5% allocation", value: "₹9,89,000", rawValue: 989000, change: "+₹19.8K (1.1%)", positive: true },
  ],
  liabilities: [
    { icon: "home", label: "Home Loan", value: "₹70,00,000", rawValue: 7000000, emi: "₹50K / month" },
    { icon: "graduation-cap", label: "Education Loan", value: "₹15,00,000", rawValue: 1500000, emi: null },
    { icon: "car", label: "Car Loan", value: "₹8,00,000", rawValue: 800000, emi: "₹10K / month" },
    { icon: "hand-coins", label: "Personal Loan", value: "₹2,00,000", rawValue: 200000, emi: "₹50K / month" },
  ],
  goalsDashboard: [
    { id: "emer", emoji: "🚨", name: "Emergency", date: "Dec 2050", value: "₹2 Cr", target: "₹2 Cr", status: "unfunded" },
    { id: "edu", emoji: "🎓", name: "Kids Education", date: "Dec 2030", value: "₹50 L", target: "₹50 L", currentFunded: "₹4 L", status: "ahead" },
    { id: "swi", emoji: "🏖️", name: "Trip to Switzerland", date: "Dec 2030", value: "₹12 L", target: "₹12 L", currentFunded: "₹2 L", status: "lagging" },
  ],
  goalsFull: [
    { id: "ret", emoji: "🪑", type: "retirement", name: "Retirement", tag: "Essential", date: "Dec 2050", targetAmount: 85000000, currentFunded: 0, status: "unfunded", retireAge: 70, lifeExp: 80, monthlyExp: 50000, monthlyInc: 60000, forWhom: "Myself" },
    { id: "edu", emoji: "🎓", type: "education", name: "Kids Education", tag: "Important", date: "Dec 2030", targetAmount: 5000000, currentFunded: 400000, status: "ahead", forWhom: "Myself" },
    { id: "swiss", emoji: "🏖️", type: "vacation", name: "Trip to Switzerland", tag: "Aspirational", date: "Dec 2030", targetAmount: 1200000, currentFunded: 200000, status: "lagging", forWhom: "Myself" },
    { id: "car", emoji: "🚗", type: "purchase", name: "Buy a Car", tag: "Important", date: "Dec 2050", targetAmount: 2000000, currentFunded: 400000, status: "ahead", forWhom: "Myself" },
    { id: "vacation", emoji: "🏖️", type: "vacation", name: "Vacation", tag: "Aspirational", date: "Dec 2050", targetAmount: 1000000, currentFunded: 0, status: "unfunded", forWhom: "Myself" },
  ],
  goalFunding: {
    "switzerland": {
      currentFunded: 400000, projectedValue: 940000,
      targetAmount: 1200000, recurringMonthly: 10000,
      assets: [
        { id: "icici-lc", type: "Mutual Funds", name: "ICICI Prudential Large Cap Equity Fund",
          color: "#F97316", totalValue: 1200000, sipAmount: 10000,
          allocatedValue: 600000, allocatedSip: 5000, allocatedPct: 50,
          linkedGoals: [
            { id: "switzerland", name: "Trip to Switzerland", pct: 50, priority: "Essential", readOnly: false },
            { id: "wedding", name: "Raju's Wedding", pct: 25, priority: "Essential", readOnly: false },
            { id: "unshared", name: "Unshared Goal", pct: 25, priority: "Essential", readOnly: true },
          ]},
        { id: "hdfc-flexi", type: "Mutual Funds", name: "HDFC Flexi Cap Direct Growth",
          color: "#1E3A8A", totalValue: 600000, sipAmount: 10000,
          allocatedValue: 0, allocatedSip: 0, allocatedPct: 0, availableValue: 200000,
          linkedGoals: [{ id: "other", name: "Other Goal", pct: 70, readOnly: false }]},
        { id: "parag", type: "Mutual Funds", name: "Parag Parikh Flexi Cap Fund Direct Growth",
          color: "#15803D", totalValue: 600000, sipAmount: 10000,
          allocatedValue: 400000, allocatedSip: 10000, allocatedPct: 100, linkedGoals: []},
        { id: "hdfc-sav", type: "Bank Accounts", name: "HDFC Savings Account",
          color: "#1E3A8A", totalValue: 2000000, sipAmount: 0, allocatedPct: 0, linkedGoals: []},
        { id: "icici-sav", type: "Bank Accounts", name: "ICICI Savings Account",
          color: "#F97316", totalValue: 2000000, sipAmount: 0, allocatedPct: 0, linkedGoals: []},
      ],
    },
  },
  fundInsights: [
    { label: "Outperforming", sub: "Performing great", count: "5 funds", trend: "up", color: "#16A34A" },
    { label: "In Line", sub: "Performing good", count: "2 funds", trend: "neutral", color: "#0EA5E9" },
    { label: "Needs Monitoring", sub: "Don't invest further", count: "2 funds", trend: "warn", color: "#D97706" },
    { label: "Underperforming", sub: "Don't invest further", count: "2 funds", trend: "down", color: "#DC2626" },
    { label: "Unclassified", sub: "Don't invest further", count: "2 funds", trend: "unknown", color: "#9CA3AF" },
  ],
  mutualFunds: [
    { id: "icici", logoColor: "#F47B26", logoChar: "i", name: "ICICI Prudential Large Cap Equity Fund", type: "Equity · Growth · Direct", value: "₹1,50,00,000", invested: "₹1,20,00,000" },
    { id: "hdfc", logoColor: "#C02633", logoChar: "H", name: "HDFC Flexi Cap Direct Growth", type: "Equity · Growth · Direct", value: "₹60,00,000", invested: "₹40,00,000" },
    { id: "parag", logoColor: "#3F8A4A", logoChar: "P", name: "Parag Parikh Flexi Cap Fund Direct Growth", type: "Equity · Growth · Direct", value: "₹30,00,000", invested: "₹23,00,000" },
    { id: "nippon", logoColor: "#C9252C", logoChar: "N", name: "Nippon India Large Cap Direct Growth", type: "Equity · Growth · Direct", value: "₹10,00,000", invested: "₹8,00,000" },
  ],
  transactions: [
    { id: 1, party: "Zomato", initials: "ZM", color: "#E23744", amount: "₹482", account: "HDFC · xx62", date: "19 May 2026, 8:24 PM", dir: "out" },
    { id: 2, party: "Salary — Acme Corp", initials: "AC", color: "#5B2EE0", amount: "+₹2,45,000", account: "HDFC · xx62", date: "01 May 2026, 11:02 AM", dir: "in" },
    { id: 3, party: "Amazon", initials: "AM", color: "#FF9900", amount: "₹1,997", account: "ICICI · xx12", date: "13 May 2026, 8:08 PM", dir: "out" },
    { id: 4, party: "Swiggy Instamart", initials: "SI", color: "#FC8019", amount: "₹641", account: "HDFC · xx62", date: "12 May 2026, 7:14 PM", dir: "out" },
    { id: 5, party: "Apollo Pharmacy", initials: "AP", color: "#0A8754", amount: "₹289", account: "ICICI · xx12", date: "10 May 2026, 11:48 AM", dir: "out" },
    { id: 6, party: "Cred Mutual Fund SIP", initials: "MF", color: "#5B2EE0", amount: "₹25,000", account: "HDFC · xx62", date: "05 May 2026, 9:00 AM", dir: "out" },
    { id: 7, party: "Refund — IRCTC", initials: "IR", color: "#0EA5E9", amount: "+₹2,140", account: "HDFC · xx62", date: "04 May 2026, 10:20 AM", dir: "in" },
  ],
  creditCards: [
    { id: "hdfc", bank: "HDFC BANK", color: "#1F3D8C", last4: "0162", due: "₹0", unbilled: "₹0", network: "VISA" },
    { id: "icici", bank: "ICICI BANK", color: "#A6431B", last4: "5512", due: "₹14,802", unbilled: "₹3,210", network: "MASTERCARD" },
  ],
  creditTxns: [
    { party: "airport lounge", initials: "AL", color: "#E58A2C", amount: "₹2", card: "HDFC · xx62", date: "18 May 2026, 12:03 PM", src: "SMS" },
    { party: "amazon pay", initials: "AP", color: "#5B2EE0", amount: "₹465.60", card: "ICICI · xx12", date: "16 May 2026, 10:22 PM", src: "SMS" },
    { party: "amazon pay", initials: "AP", color: "#5B2EE0", amount: "₹241", card: "ICICI · xx12", date: "15 May 2026, 1:41 PM", src: "SMS" },
    { party: "amazon pay grocery", initials: "AP", color: "#B154E0", amount: "₹1,997.38", card: "ICICI · xx12", date: "13 May 2026, 8:08 PM", src: "SMS" },
    { party: "name-cheap.com", initials: "NA", color: "#DC2626", amount: "₹37.35", card: "ICICI · xx12", date: "04 May 2026, 10:29 AM", src: "SMS" },
    { party: "claude.ai subscription", initials: "CS", color: "#2A6FDB", amount: "₹23.60", card: "ICICI · xx12", date: "02 May 2026, 9:18 AM", src: "SMS" },
  ],
  insurance: [
    { id: "car", icon: "car", label: "Car", policy: "HDFC Ergo · Honda City", premium: "₹12,400/yr", sumAssured: "₹8.2 L", expiry: "Aug 2026", owner: "D", ownerColor: "#5B2EE0" },
    { id: "health", icon: "heart-pulse", label: "Health", policy: "Star Family Floater", premium: "₹38,000/yr", sumAssured: "₹25 L", expiry: "Mar 2027", owner: "D", ownerColor: "#5B2EE0" },
    { id: "life", icon: "shield", label: "Life", policy: "HDFC Click 2 Protect", premium: "₹18,500/yr", sumAssured: "₹2 Cr", expiry: "Jan 2055", owner: "D", ownerColor: "#5B2EE0" },
    { id: "gen", icon: "home", label: "General", policy: "Home contents · ICICI Lombard", premium: "₹4,800/yr", sumAssured: "₹15 L", expiry: "Nov 2026", owner: "D", ownerColor: "#5B2EE0" },
  ],
  insuranceFamily: [
    { id: "car", icon: "car", label: "Car", policy: "3 active policies", premium: "₹42K/yr", sumAssured: "₹24 L", owners: [{initial:"D",color:"#5B2EE0"},{initial:"S",color:"#E91E63"},{initial:"R",color:"#0EA5E9"}] },
    { id: "health", icon: "heart-pulse", label: "Health", policy: "Family floater + 2 individuals", premium: "₹86K/yr", sumAssured: "₹50 L", owners: [{initial:"D",color:"#5B2EE0"},{initial:"S",color:"#E91E63"},{initial:"R",color:"#0EA5E9"},{initial:"P",color:"#16A34A"}] },
    { id: "life", icon: "shield", label: "Life", policy: "4 term policies", premium: "₹64K/yr", sumAssured: "₹6 Cr", owners: [{initial:"D",color:"#5B2EE0"},{initial:"S",color:"#E91E63"},{initial:"R",color:"#0EA5E9"},{initial:"P",color:"#16A34A"}] },
  ],
  spending: { month: "April 2026", value: "₹75,000", change: "+₹8,200 vs Mar", positive: false },
  spendingFamily: { month: "April 2026", value: "₹2,84,000", change: "+₹22K vs Mar", positive: false, byMember: [
    { initial: "D", name: "Deepen", color: "#5B2EE0", value: "₹75,000" },
    { initial: "S", name: "Shalini", color: "#E91E63", value: "₹62,000" },
    { initial: "R", name: "Rakesh", color: "#0EA5E9", value: "₹98,000" },
    { initial: "P", name: "Priyanka", color: "#16A34A", value: "₹49,000" },
  ] },
  hygiene: { banks: { total: 5, issues: 2 }, folios: { total: 18, issues: 8 }, demat: { total: 3, issues: 4 } },
  creditScore: { score: 815, change: "+0", category: "Excellent", provider: "Experian", asOf: "05 Feb, 2026" },
  creditScoreFamily: [
    { id: "wife", relation: "Wife", name: "Shalini Mehta", score: 792, category: "Excellent", change: "+12 last month" },
    { id: "father", relation: "Father", name: "Ramesh Mehta", score: 754, category: "Good", change: "−3 last month" },
    { id: "mother", relation: "Mother", name: "Sudha Mehta", score: 821, category: "Excellent", change: "+8 last month" },
  ],
  bankAccounts: [
    { id: "hdfc", bank: "HDFC Bank", last4: "0162", color: "#1F3D8C", balance: "₹4,82,140", type: "Savings" },
    { id: "icici", bank: "ICICI Bank", last4: "5512", color: "#A6431B", balance: "₹2,28,500", type: "Salary" },
    { id: "kotak", bank: "Kotak Mahindra", last4: "8821", color: "#E7322B", balance: "₹1,12,860", type: "Savings" },
    { id: "axis", bank: "Axis Bank", last4: "4002", color: "#A1276F", balance: "₹68,200", type: "Savings" },
    { id: "sbi", bank: "SBI", last4: "0556", color: "#1F4F95", balance: "₹18,800", type: "Savings" },
  ],
  familyGroups: [
    { id: "agarwal", name: "Agarwal Family", value: "₹2.10 Cr", members: [{initial:"R",color:"#5B2EE0"},{initial:"S",color:"#E91E63"},{initial:"N",color:"#0EA5E9"}], extra: 3, color: "#FCE7C2", initial: "A" },
    { id: "patel", name: "Patel Family", value: "₹10.45 Cr", members: [{initial:"R",color:"#5B2EE0"},{initial:"K",color:"#0EA5E9"}], extra: 1, color: "#FFEDD5", initial: "P" },
  ],
  familyMembersDetail: [
    { id: "rakesh", name: "Rakesh Gupta", role: "Myself", initial: "R", color: "#5B2EE0", status: null, phone: "9980111543" },
    { id: "shalini", name: "Shalini Gupta", role: "Spouse", initial: "S", color: "#E91E63", status: "Pending", phone: "9988220011" },
    { id: "sameer", name: "Sameer Gupta", role: "Son", initial: "S", color: "#0EA5E9", status: "Added", phone: "9988220012" },
    { id: "nimisha", name: "Nimisha Gupta", role: "Daughter", initial: "N", color: "#F5A8B3", status: "Declined", phone: "9988220013" },
    { id: "shreekanth", name: "Shreekanth Gupta", role: "Father", initial: "S", color: "#F5A8B3", status: "Expired", phone: "9988220014" },
    { id: "kalpana", name: "Kalpana Gupta", role: "Mother", initial: "K", color: "#F5A8B3", status: "Revoked", phone: "9988220015" },
  ],
  notifications: [
    { id: 1, kind: "due", icon: "credit-card", color: "#DC2626", title: "Credit Card payment due", body: "₹14,802 on ICICI · xx12 due in 3 days. Pay now to avoid late fees.", time: "2h ago", unread: true },
    { id: 2, kind: "invite", icon: "user-plus", color: "#5B2EE0", title: "Family group invite", body: "Rakesh Gupta invited you to join Agarwal Family.", time: "5h ago", unread: true, actions: true },
    { id: 3, kind: "accept", icon: "check-circle-2", color: "#16A34A", title: "Invite accepted", body: "Shalini accepted your invitation to Mehta Family.", time: "Yesterday", unread: false },
    { id: 4, kind: "perf", icon: "trending-up", color: "#16A34A", title: "Portfolio up 15%", body: "Your equity portfolio has returned 15% YTD. Great work!", time: "2d ago", unread: false },
    { id: 5, kind: "kyc", icon: "alert-triangle", color: "#D97706", title: "KYC pending", body: "2 accounts have incomplete KYC. Resolve to avoid restrictions.", time: "3d ago", unread: false },
  ],
  documents: [
    { id: "aadhaar", title: "Aadhaar Card", number: "XXXX XXXX 4421", icon: "id-card", color: "#5B2EE0", expiry: null, updated: "12 Jan 2026" },
    { id: "pan", title: "PAN Card", number: "BTXPM2941K", icon: "badge-info", color: "#0EA5E9", expiry: null, updated: "04 Feb 2026" },
    { id: "passport", title: "Passport", number: "M9842301", icon: "plane", color: "#16A34A", expiry: "Jul 2029", updated: "08 Aug 2024" },
    { id: "dl", title: "Driving License", number: "MH14 20200012345", icon: "car", color: "#D97706", expiry: "Dec 2031", updated: "19 Dec 2024" },
    { id: "voter", title: "Voter ID", number: "XYZ1234567", icon: "vote", color: "#A1276F", expiry: null, updated: "02 May 2024" },
  ],
  fundDetail: {
    name: "ICICI Prudential Large Cap Equity Fund",
    type: "Equity · Growth · Direct",
    current: "₹12,45,00,000",
    invested: "₹10,00,00,000",
    totalReturns: "₹45,000 (22.2%)",
    oneDay: "₹1,000 (0.5%)",
    xirr: "6.3%",
    performance: "Ahead",
    transactions: [
      { folio: "13166500", amount: "+ ₹10,000", units: "146.862 units / ₹95.229 NAV", date: "05 Jan 2026" },
      { folio: "13166501", amount: "+ ₹20,000", units: "146.862 units / ₹95.229 NAV", date: "04 Jan 2026" },
      { folio: "13166502", amount: "+ ₹15,000", units: "146.862 units / ₹95.229 NAV", date: "04 Jan 2026" },
      { folio: "13166503", amount: "+ ₹5,000", units: "73.431 units / ₹95.229 NAV", date: "03 Jan 2026" },
    ],
  },
  goalTypes: [
    { key: "emergency", emoji: "🚨", title: "Emergency", desc: "Build a safety net for life's surprises." },
    { key: "education", emoji: "🎓", title: "Education", desc: "Invest in learning and growth." },
    { key: "retirement", emoji: "🪑", title: "Retirement", desc: "Plan for the retirement you need." },
    { key: "home", emoji: "🏠", title: "Home / Property", desc: "Save towards buying or upgrading a home." },
    { key: "vacation", emoji: "🏖️", title: "Vacation", desc: "Make memories. Plan dream trips ahead." },
    { key: "purchase", emoji: "🚗", title: "Major Purchase", desc: "Set aside funds for your next car or bike." },
    { key: "life", emoji: "💍", title: "Life Event", desc: "Prepare for life's special events." },
    { key: "other", emoji: "🎯", title: "Other", desc: "Create a custom goal that fits your plans." },
  ],
  familyMembers: [
    { id: "rs", name: "Ramesh", initial: "R", color: "#5B2EE0", net: "₹1,50,00,000", funds: 5 },
    { id: "sd", name: "Sudha", initial: "S", color: "#E91E63", net: "₹60,00,000", funds: 4 },
    { id: "jg", name: "Jagminder", initial: "J", color: "#0EA5E9", net: "₹30,00,000", funds: 2 },
    { id: "pr", name: "Priyanka", initial: "P", color: "#16A34A", net: "₹10,00,000", funds: 2 },
  ],
};

// =========================================================================
// AppCtx — global state for navigation, history, masked values, toasts
// =========================================================================
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// =========================================================================
// StatusBar — Android-style mock
// =========================================================================
const StatusBar = ({ dark = false }) => {
  const c = dark ? "#111111" : "#FFFFFF";
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-1 text-xs" style={{ color: c, fontWeight: 600 }}>
      <span>9:30 PM</span>
      <div className="flex items-center gap-1.5" style={{ opacity: 0.95 }}>
        <Icon name="bluetooth" size={12} color={c} stroke={2.4} />
        <Icon name="wifi" size={13} color={c} stroke={2.4} />
        <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 3px", border: `1px solid ${c}`, borderRadius: 3 }}>5G</span>
        <Icon name="signal-high" size={13} color={c} stroke={2.4} />
        <div style={{ width: 18, height: 9, border: `1.4px solid ${c}`, borderRadius: 2, position: "relative" }}>
          <div style={{ position: "absolute", inset: 1, background: c, borderRadius: 1 }}></div>
          <div style={{ position: "absolute", right: -3, top: 2, width: 2, height: 4, background: c, borderRadius: 1 }}></div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// PurpleHeader — Dashboard / Wealth / Goals style
// =========================================================================
const PurpleHeader = ({ label, profile = "Myself", showProfile = true, showEye = true, showShare = false, showAdd = false, onAdd, showBell = false, showAdvisory = false }) => {
  const app = useApp();
  return (
    <div className="header-grad" style={{ paddingBottom: 14 }}>
      <StatusBar dark={false} />
      <div className="flex items-center justify-between px-4 pt-2">
        <div className="flex items-center gap-3 min-w-0">
          {showProfile && (
            <button
              onClick={() => app.go("profile")}
              className="rounded-full flex items-center justify-center"
              style={{ width: 36, height: 36, background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.18)" }}
              aria-label="Open profile"
            >
              <Icon name="user" size={18} color="#fff" />
            </button>
          )}
          <button onClick={() => app.openSheet("profileSwitch")} className="text-left">
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", lineHeight: 1.1 }}>{label}</div>
            <div className="flex items-center gap-1" style={{ color: "#fff", fontWeight: 600, fontSize: 17, lineHeight: 1.2 }}>
              <span style={{ borderBottom: "1px solid rgba(255,255,255,0.5)" }}>{profile}</span>
              <Icon name="chevron-down" size={16} color="#fff" stroke={2.5} />
            </div>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {showEye && (
            <IconBtn onClick={() => app.setMasked(m => !m)} aria-label="Toggle visibility">
              <Icon name={app.masked ? "eye-off" : "eye"} size={20} color="#fff" />
            </IconBtn>
          )}
          {showShare && (
            <IconBtn onClick={() => app.toast("Sharing link copied")}>
              <Icon name="share-2" size={18} color="#fff" />
            </IconBtn>
          )}
          {showAdd && (
            <IconBtn onClick={onAdd || (() => app.toast("Add asset — coming soon"))}>
              <Icon name="plus" size={20} color="#fff" />
            </IconBtn>
          )}
          {showAdvisory && (
            <IconBtn onClick={() => app.go("advisory")} aria-label="Open Advisory">
              <Icon name="sparkles" size={18} color="#fff" />
              <span style={{ position: "absolute", top: 3, right: 3, width: 7, height: 7, background: "#FFD166", borderRadius: 999, border: "1.5px solid #5125CD" }} />
            </IconBtn>
          )}
          {showBell && (
            <IconBtn onClick={() => app.go("notifications")}>
              <Icon name="bell" size={20} color="#fff" />
              <span style={{ position: "absolute", top: 4, right: 4, width: 8, height: 8, background: "#FF4A6B", borderRadius: 999, border: "2px solid #5125CD" }} />
            </IconBtn>
          )}
        </div>
      </div>
    </div>
  );
};

const IconBtn = ({ children, onClick, ...rest }) => (
  <button onClick={onClick} {...rest}
    className="rounded-full flex items-center justify-center relative"
    style={{ width: 36, height: 36, background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.16)" }}>
    {children}
  </button>
);

// =========================================================================
// SubHeader — back-arrow page header
// =========================================================================
const SubHeader = ({ title, sub, onBack, right = null }) => {
  const app = useApp();
  return (
    <div className="header-grad" style={{ paddingBottom: 14 }}>
      <StatusBar dark={false} />
      <div className="flex items-center justify-between px-4 pt-2">
        <div className="flex items-center gap-2">
          <button onClick={onBack || (() => app.back())} className="rounded-full flex items-center justify-center" style={{ width: 32, height: 32 }} aria-label="Back">
            <Icon name="arrow-left" size={22} color="#fff" stroke={2.2} />
          </button>
          <div>
            {sub && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", lineHeight: 1.1 }}>{sub}</div>}
            <div style={{ fontSize: 17, color: "#fff", fontWeight: 600 }}>{title}</div>
          </div>
        </div>
        {right}
      </div>
    </div>
  );
};

// =========================================================================
// BottomNav — single unified set across the whole app
// =========================================================================
const NAV_ITEMS = [
  { key: "dashboard", icon: "home", label: "Home" },
  { key: "wealth", icon: "wallet", label: "Wealth" },
  { key: "goals", icon: "target", label: "Goals" },
  { key: "transactions", icon: "arrow-left-right", label: "Transactions" },
  { key: "credit", icon: "credit-card", label: "Credit" },
];

const BottomNav = ({ active }) => {
  const app = useApp();
  const items = NAV_ITEMS;
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white" style={{ borderTop: "1px solid var(--border)", height: 70 }}>
      <div className="grid h-full" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map(it => {
          const isActive = active === it.key;
          return (
            <button key={it.key} onClick={() => app.go(it.key)} className="flex flex-col items-center justify-center relative" style={{ color: isActive ? "var(--brand)" : "var(--ink-3)" }}>
              {isActive && <div style={{ position: "absolute", top: 0, left: "30%", right: "30%", height: 3, background: "var(--brand)", borderRadius: "0 0 3px 3px" }} />}
              <Icon name={it.icon} size={20} color={isActive ? "#5B2EE0" : "#9CA3AF"} stroke={isActive ? 2.2 : 1.8} />
              <div style={{ fontSize: 11, fontWeight: isActive ? 600 : 500, marginTop: 2 }}>{it.label}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// =========================================================================
// FAB — purple sparkle button → AI Assistant
// =========================================================================
const FAB = ({ bottom = 86 }) => {
  const app = useApp();
  return (
    <button
      onClick={() => app.go("ai")}
      className="absolute rounded-full flex items-center justify-center shimmer fab-glow"
      style={{ right: 18, bottom, width: 54, height: 54 }}
      aria-label="Ask Buddy AI"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 L13.5 9.2 L20.5 11 L13.5 12.8 L12 20 L10.5 12.8 L3.5 11 L10.5 9.2 Z" fill="#fff"/>
        <circle cx="18" cy="5" r="1.2" fill="#fff" opacity="0.85"/>
        <circle cx="5.5" cy="17.5" r="0.9" fill="#fff" opacity="0.7"/>
      </svg>
    </button>
  );
};

// =========================================================================
// Sparkline (inline SVG)
// =========================================================================
const Sparkline = ({ width = 110, height = 40, color = "#5B2EE0", points = null, fillOpacity = 0.18 }) => {
  const series = points || [22, 24, 21, 26, 25, 30, 28, 33, 31, 36, 38, 42, 40, 47, 50, 52];
  const min = Math.min(...series), max = Math.max(...series);
  const range = max - min || 1;
  const stepX = width / (series.length - 1);
  const path = series.map((v, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${height - ((v - min) / range) * (height - 6) - 3}`).join(" ");
  const area = `${path} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="sparkfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={fillOpacity}/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkfill)" />
      <path d={path} stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// =========================================================================
// MaskedValue — hides text when masked global is set
// =========================================================================
const Masked = ({ children, style }) => {
  const app = useApp();
  if (app.masked) return <span style={{ ...style, letterSpacing: 2 }}>••••••</span>;
  return <span style={style}>{children}</span>;
};

// =========================================================================
// Tag pill
// =========================================================================
const Tag = ({ children, kind = "neutral" }) => {
  const map = {
    neutral: { bg: "var(--brand-soft)", fg: "var(--brand)" },
    important: { bg: "#FFE7C2", fg: "#9A5A00" },
    essential: { bg: "#E6F0FF", fg: "#1F4FBA" },
    aspirational: { bg: "#FFE4F0", fg: "#A6266A" },
    success: { bg: "#DCFCE7", fg: "#15803D" },
    warn: { bg: "#FEF3C7", fg: "#92400E" },
    danger: { bg: "#FEE2E2", fg: "#B91C1C" },
  };
  const t = map[kind] || map.neutral;
  return <span className="chip" style={{ background: t.bg, color: t.fg }}>{children}</span>;
};

const tagKind = (label) => {
  const l = (label || "").toLowerCase();
  if (l === "essential") return "essential";
  if (l === "important") return "important";
  if (l === "aspirational") return "aspirational";
  return "neutral";
};

// =========================================================================
// IconCircle — small circular icon backdrop (used for asset rows etc)
// =========================================================================
const IconCircle = ({ icon, bg = "var(--brand-soft)", color = "var(--brand)", size = 40 }) => (
  <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: size, height: size, background: bg }}>
    <Icon name={icon} size={size * 0.5} color={color} stroke={2} />
  </div>
);

// =========================================================================
// Toast
// =========================================================================
const Toast = ({ msg }) => (
  <div className="toast-in absolute" style={{ bottom: 100, left: "50%", padding: "10px 16px", background: "rgba(17,17,17,0.92)", color: "#fff", borderRadius: 999, fontSize: 12, fontWeight: 500, zIndex: 60 }}>
    {msg}
  </div>
);

// =========================================================================
// Generic bottom sheet wrapper
// =========================================================================
const Sheet = ({ open, onClose, children, height = "auto" }) => {
  if (!open) return null;
  return (
    <div className="absolute inset-0" style={{ zIndex: 50 }}>
      <div className="backdrop-in absolute inset-0" onClick={onClose} style={{ background: "rgba(40, 42, 60, 0.55)" }} />
      <div className="sheet-in absolute left-0 right-0 bottom-0 bg-white" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "85%", height, overflow: "hidden" }}>
        <div className="flex justify-center pt-2 pb-1">
          <div style={{ width: 44, height: 4, background: "#E5E7EB", borderRadius: 2 }} />
        </div>
        {children}
      </div>
    </div>
  );
};

// =========================================================================
// Bank/Fund logo tile
// =========================================================================
const LogoTile = ({ color, char, size = 36, rounded = 8 }) => (
  <div className="flex items-center justify-center shrink-0" style={{ width: size, height: size, background: "#fff", border: "1px solid #E5E7EB", borderRadius: rounded, fontWeight: 800, fontSize: size * 0.5, color }}>
    <div style={{ width: size * 0.7, height: size * 0.7, borderRadius: rounded - 2, background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{char}</div>
  </div>
);

const Avatar = ({ initial, color = "#5B2EE0", size = 28 }) => (
  <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: size, height: size, background: color, color: "#fff", fontSize: size * 0.45, fontWeight: 700 }}>{initial}</div>
);

// =========================================================================
// AvatarStack — small overlapping circles
// =========================================================================
const AvatarStack = ({ items = [], size = 22 }) => (
  <div className="flex items-center">
    {items.map((it, i) => (
      <div key={i} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 10 - i, border: "2px solid #fff", borderRadius: "50%" }}>
        <Avatar initial={it.initial} color={it.color} size={size} />
      </div>
    ))}
  </div>
);

// =========================================================================
// Trend arrow + value
// =========================================================================
const Trend = ({ positive, value, neutral = false }) => {
  if (neutral) return <span className="ink-3" style={{ fontSize: 12 }}>{value}</span>;
  const c = positive ? "var(--pos)" : "var(--neg)";
  return (
    <span className="inline-flex items-center gap-0.5" style={{ color: c, fontSize: 12, fontWeight: 600 }}>
      <svg width="10" height="10" viewBox="0 0 10 10" style={{ transform: positive ? "none" : "rotate(180deg)" }}>
        <path d="M5 1 L9 6 H6 V9 H4 V6 H1 Z" fill={c}/>
      </svg>
      {value}
    </span>
  );
};

// Expose everything
Object.assign(window, {
  Icon, MOCK, AppCtx, useApp,
  StatusBar, PurpleHeader, SubHeader, IconBtn, BottomNav, FAB,
  Sparkline, Masked, Tag, tagKind, IconCircle, Toast, Sheet, LogoTile, Avatar, AvatarStack, Trend,
});
if (typeof window !== "undefined" && window.__famliFirstTimeFunding === undefined) window.__famliFirstTimeFunding = true;
