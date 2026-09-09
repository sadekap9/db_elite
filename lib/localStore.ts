import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "lib", "localData.json");

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  status: string;
  email?: string;
  city?: string;
  birthday?: string;
  preferredStyle?: string;
  totalDresses?: number;
  totalAmountINR?: string;
  lastPurchaseDate?: string;
  createdAt?: string;
}

export interface PurchaseRecord {
  id: string;
  customerId: string;
  dressName: string;
  collection?: string;
  purchaseDate: string;
  amountINR: string;
  qty: number;
  createdAt?: string;
}

export interface TemplateRecord {
  id: string;
  templateName?: string;
  title?: string;
  category?: string;
  targetAudience?: string;
  messageText?: string;
  message_body?: string;
  variables?: string;
  createdAt?: string;
}

export interface MilestoneRuleRecord {
  id: string;
  startDate?: string;
  endDate?: string;
  durationMonths?: number;
  targetDresses?: number;
  tierName?: string;
  description?: string;
  ruleName?: string;
  dressesRequired?: number;
  amountRequiredINR?: string;
  periodDays?: number;
  rewardBenefit?: string;
  createdAt?: string;
}

export interface StoreData {
  customers: CustomerRecord[];
  purchases: PurchaseRecord[];
  templates: TemplateRecord[];
  rules: MilestoneRuleRecord[];
}

const initialData: StoreData = {
  customers: [],
  purchases: [],
  templates: [],
  rules: [
    {
      id: "1",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      durationMonths: 6,
      targetDresses: 6,
      tierName: "Gold VIP Member",
      description: "Buy 6 dresses between 2024-01-01 and 2024-06-30 (6 Months) to unlock Gold VIP Member status.",
      ruleName: "Mid-Year Gold Progress",
      dressesRequired: 6,
      amountRequiredINR: "₹1,00,000",
      periodDays: 180,
      rewardBenefit: "15% Exclusive Discount",
    },
    {
      id: "2",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      durationMonths: 12,
      targetDresses: 12,
      tierName: "Elite Circle VIP",
      description: "Buy 12 dresses between 2024-01-01 and 2024-12-31 (12 Months) to unlock Elite Circle VIP status.",
      ruleName: "12-Dress Annual Elite Target",
      dressesRequired: 12,
      amountRequiredINR: "₹2,00,000",
      periodDays: 365,
      rewardBenefit: "20% Exclusive Discount & Private Atelier Fitting",
    },
  ],
};

function normPhone(p: string): string {
  return String(p || "").replace(/[^0-9]/g, "");
}

function deduplicateStore(data: StoreData): StoreData {
  if (!data.customers || data.customers.length <= 1) return data;

  const phoneMap = new Map<string, CustomerRecord>();
  const idRemap = new Map<string, string>();

  for (const cust of data.customers) {
    const key = normPhone(cust.phone);
    if (!key) continue;

    if (!phoneMap.has(key)) {
      phoneMap.set(key, { ...cust });
    } else {
      const primary = phoneMap.get(key)!;
      idRemap.set(String(cust.id), String(primary.id));

      const dresses1 = primary.totalDresses || 0;
      const dresses2 = cust.totalDresses || 0;
      const combinedDresses = dresses1 + dresses2;

      const amt1 = Number(String(primary.totalAmountINR || "0").replace(/[^0-9]/g, "")) || 0;
      const amt2 = Number(String(cust.totalAmountINR || "0").replace(/[^0-9]/g, "")) || 0;
      const combinedAmt = amt1 + amt2;

      let newStatus = primary.status;
      if (combinedDresses >= 12) newStatus = "Elite";
      else if (combinedDresses === 11) newStatus = "Almost Elite";
      else if (combinedDresses >= 8) newStatus = "Gold";
      else if (combinedDresses >= 4) newStatus = "Silver";

      primary.totalDresses = combinedDresses;
      primary.totalAmountINR = combinedAmt > 0 ? `₹${combinedAmt.toLocaleString("en-IN")}` : primary.totalAmountINR;
      primary.status = newStatus;
      if (cust.name && cust.name.length > (primary.name || "").length) {
        primary.name = cust.name;
      }
      if (cust.lastPurchaseDate && (!primary.lastPurchaseDate || cust.lastPurchaseDate > primary.lastPurchaseDate)) {
        primary.lastPurchaseDate = cust.lastPurchaseDate;
      }
    }
  }

  if (idRemap.size > 0 && data.purchases) {
    data.purchases.forEach((p) => {
      if (idRemap.has(String(p.customerId))) {
        p.customerId = idRemap.get(String(p.customerId))!;
      }
    });
  }

  data.customers = Array.from(phoneMap.values());
  return data;
}

function readStore(): StoreData {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      writeStore(initialData);
      return initialData;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const data = JSON.parse(raw);
    if (!data.customers || !Array.isArray(data.customers)) {
      writeStore(initialData);
      return initialData;
    }
    const cleanData = deduplicateStore(data);
    if (cleanData.customers.length !== data.customers.length) {
      writeStore(cleanData);
    }
    return cleanData;
  } catch (err) {
    console.error("Error reading localData.json store:", err);
    return initialData;
  }
}

function writeStore(data: StoreData): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing localData.json store:", err);
  }
}

export const localStore = {
  getCustomers: () => readStore().customers,
  
  addCustomer: (cust: Partial<CustomerRecord> & { name: string; phone: string }) => {
    const store = readStore();
    const cleanPhone = normPhone(cust.phone);
    const existingIdx = store.customers.findIndex((c) => normPhone(c.phone) === cleanPhone);

    const dresses = Number(cust.totalDresses) || 0;
    const amtStr = String(cust.totalAmountINR || "0").replace(/[^0-9]/g, "");
    const amtNum = Number(amtStr) || 0;

    if (existingIdx !== -1) {
      const existing = store.customers[existingIdx];
      const newDresses = (existing.totalDresses || 0) + dresses;

      const existingAmt = Number(String(existing.totalAmountINR || "0").replace(/[^0-9]/g, "")) || 0;
      const newAmt = existingAmt + amtNum;

      let status = existing.status;
      if (newDresses >= 12) status = "Elite";
      else if (newDresses === 11) status = "Almost Elite";
      else if (newDresses >= 8) status = "Gold";
      else if (newDresses >= 4) status = "Silver";

      existing.name = cust.name || existing.name;
      existing.totalDresses = newDresses;
      existing.totalAmountINR = newAmt > 0 ? `₹${newAmt.toLocaleString("en-IN")}` : existing.totalAmountINR;
      existing.status = status;
      if (cust.lastPurchaseDate) {
        existing.lastPurchaseDate = cust.lastPurchaseDate;
      }
      writeStore(store);
      return existing;
    }

    const newId = String(Date.now());
    let status = cust.status || "Regular";
    if (dresses >= 12) status = "Elite";
    else if (dresses === 11) status = "Almost Elite";
    else if (dresses >= 8) status = "Gold";
    else if (dresses >= 4) status = "Silver";

    const newCust: CustomerRecord = {
      id: newId,
      name: cust.name,
      phone: cust.phone,
      status,
      totalDresses: dresses,
      totalAmountINR: cust.totalAmountINR || "₹0",
      lastPurchaseDate: cust.lastPurchaseDate || new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    };
    store.customers.unshift(newCust);
    writeStore(store);
    return newCust;
  },

  updateCustomer: (id: string, updates: Partial<CustomerRecord>) => {
    const store = readStore();
    const idx = store.customers.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) {
      store.customers[idx] = { ...store.customers[idx], ...updates };
      writeStore(store);
      return store.customers[idx];
    }
    return null;
  },

  deleteCustomer: (id: string) => {
    const store = readStore();
    store.customers = store.customers.filter((c) => String(c.id) !== String(id));
    store.purchases = store.purchases.filter((p) => String(p.customerId) !== String(id));
    writeStore(store);
    return true;
  },

  getPurchases: () => readStore().purchases,

  addPurchase: (p: { customerId: string; dressName: string; collection?: string; purchaseDate?: string; amountINR?: string; qty?: number }) => {
    const store = readStore();
    const newId = `pur_${Date.now()}`;
    const qtyNum = Number(p.qty) || 1;
    const cleanAmt = String(p.amountINR || "").replace(/[^0-9]/g, "").replace(/^0+/, "");
    const amount = cleanAmt ? `₹${Number(cleanAmt).toLocaleString("en-IN")}` : "₹0";

    const newPurchase: PurchaseRecord = {
      id: newId,
      customerId: String(p.customerId),
      dressName: p.dressName,
      collection: p.collection || "Royal Collection",
      purchaseDate: p.purchaseDate || new Date().toISOString().split("T")[0],
      amountINR: amount,
      qty: qtyNum,
      createdAt: new Date().toISOString(),
    };

    store.purchases.unshift(newPurchase);

    // Recalculate customer total dresses
    const custIdx = store.customers.findIndex((c) => String(c.id) === String(p.customerId));
    if (custIdx !== -1) {
      const custPurchases = store.purchases.filter((item) => String(item.customerId) === String(p.customerId));
      const totalDresses = custPurchases.reduce((acc, curr) => acc + (Number(curr.qty) || 1), 0);

      let newStatus = store.customers[custIdx].status;
      if (totalDresses >= 12) newStatus = "Elite";
      else if (totalDresses === 11) newStatus = "Almost Elite";
      else if (totalDresses >= 8) newStatus = "Gold";
      else if (totalDresses >= 4) newStatus = "Silver";

      store.customers[custIdx].totalDresses = totalDresses;
      store.customers[custIdx].status = newStatus;
      store.customers[custIdx].lastPurchaseDate = newPurchase.purchaseDate;
    }

    writeStore(store);
    return newPurchase;
  },

  getTemplates: () => readStore().templates,

  addTemplate: (t: Partial<TemplateRecord> & { templateName?: string; messageText?: string }) => {
    const store = readStore();
    const newId = `tmpl_${Date.now()}`;
    const newTmpl: TemplateRecord = {
      id: newId,
      title: t.templateName || t.title || "Custom Template",
      templateName: t.templateName || t.title || "Custom Template",
      category: t.category || "General",
      targetAudience: t.targetAudience || "All Customers",
      messageText: t.messageText || t.message_body || "",
      message_body: t.messageText || t.message_body || "",
      createdAt: new Date().toISOString(),
    };
    store.templates.unshift(newTmpl);
    writeStore(store);
    return newTmpl;
  },

  getRules: () => readStore().rules,

  addRule: (r: Partial<MilestoneRuleRecord>) => {
    const store = readStore();
    const newId = `rule_${Date.now()}`;
    const newRule: MilestoneRuleRecord = {
      id: newId,
      startDate: r.startDate || new Date().toISOString().split("T")[0],
      endDate: r.endDate || "2026-12-31",
      durationMonths: Number(r.durationMonths) || 12,
      targetDresses: Number(r.targetDresses) || 12,
      tierName: r.tierName || "Elite Circle VIP",
      description: r.description || "",
      ruleName: r.ruleName || `${r.targetDresses || 12}-Dress Target Rule`,
      dressesRequired: Number(r.dressesRequired || r.targetDresses) || 12,
      amountRequiredINR: r.amountRequiredINR || "₹2,00,000",
      periodDays: Number(r.periodDays) || 365,
      rewardBenefit: r.rewardBenefit || "20% Exclusive Discount",
      createdAt: new Date().toISOString(),
    };
    store.rules.unshift(newRule);
    writeStore(store);
    return newRule;
  },

  deleteRule: (id: string) => {
    const store = readStore();
    store.rules = store.rules.filter((r) => String(r.id) !== String(id));
    writeStore(store);
    return true;
  },
};
