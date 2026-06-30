import React, { useEffect, useState } from "react";
import { getProfile } from "../services/profileService";
import {
  User,
  Key,
  Shield,
  CreditCard,
  Copy,
  Check,
  Trash2,
  Terminal,
  Lock,
  Plus,
} from "lucide-react";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("account");

  // Account Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("••••••••");
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();

        setName(profile.name);
        setEmail(profile.email);
      } catch (error) {
        console.error(error);
      }
    };

    loadProfile();
  }, []);

  // API Key States
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: "Production Webhook Link",
      key: "dt_live_2a8b9f71ee01fc938df12",
      created: "2026-05-12",
    },
    {
      id: 2,
      name: "Testing Local Daemon",
      key: "dt_test_88f9dacb2748aa01e2390f",
      created: "2026-06-01",
    },
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // Security States
  const [tfaEnabled, setTfaEnabled] = useState(true);

  // API key handling
  const handleGenerateKey = (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomHash =
      Math.random().toString(16).substring(2, 10) +
      Math.random().toString(16).substring(2, 10);
    const prefix = newKeyName.toLowerCase().includes("prod")
      ? "dt_live_"
      : "dt_test_";
    const rawKeyString = `${prefix}${randomHash}`;

    const newKey = {
      id: Date.now(),
      name: newKeyName,
      key: rawKeyString,
      created: new Date().toISOString().split("T")[0],
    };

    setApiKeys((prev) => [newKey, ...prev]);
    setNewKeyName("");
  };

  const handleRevokeKey = (id) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== id));
  };

  const handleCopyKey = (id, fullStr) => {
    navigator.clipboard.writeText(fullStr);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-900 pb-5">
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
          Workspace Settings
        </h1>
        <p className="text-zinc-400 text-xs mt-1">
          Manage your developer credentials, API tokens, security logs, and
          billing tiers.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* Navigation Tabs (Left side) */}
        <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-3 md:pb-0 border-b md:border-b-0 md:border-r border-zinc-900 md:pr-4">
          <button
            onClick={() => setActiveTab("account")}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
              activeTab === "account"
                ? "bg-zinc-900 text-white border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
            }`}
          >
            <User className="w-4 h-4" />
            Account settings
          </button>

          <button
            onClick={() => setActiveTab("developer")}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
              activeTab === "developer"
                ? "bg-zinc-900 text-white border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
            }`}
          >
            <Key className="w-4 h-4" />
            Developer API
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
              activeTab === "security"
                ? "bg-zinc-900 text-white border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
            }`}
          >
            <Shield className="w-4 h-4" />
            Security & MFA
          </button>

          <button
            onClick={() => setActiveTab("billing")}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold shrink-0 transition-colors ${
              activeTab === "billing"
                ? "bg-zinc-900 text-white border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Billing & Plans
          </button>
        </div>

        {/* Tab Contents (Right side) */}
        <div className="md:col-span-3 space-y-6">
          {/* Account details Tab */}
          {activeTab === "account" && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-5 space-y-5">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-zinc-900 pb-3">
                User Profile info
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg px-4 py-2 text-xs text-white outline-none transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg px-4 py-2 text-xs text-white outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  Workspace Password
                </label>
                <div className="relative max-w-xs">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="password"
                    defaultValue="dummy_password"
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg py-2 pl-9 pr-4 text-xs text-white outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-900">
                <button
                  onClick={() =>
                    alert("Account configuration changes saved (simulation)")
                  }
                  className="inline-flex items-center justify-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow-lg shadow-blue-500/10 transition-all hover:scale-[1.01] active:scale-[0.99] uppercase tracking-wider"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}

          {/* Developer API Tab */}
          {activeTab === "developer" && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-5 space-y-5">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-zinc-900 pb-3">
                Developer Credentials
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generate authorization tokens to integrate the DocuTrust
                document integrity daemon with your local dev pipelines (CI/CD,
                API webhooks).
              </p>

              {/* API Key Form */}
              <form
                onSubmit={handleGenerateKey}
                className="flex gap-2 max-w-md"
              >
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Key Label (e.g. Production Web) "
                  className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-zinc-700 rounded-lg px-4 py-2 text-xs text-white placeholder-zinc-550 outline-none transition-all font-medium"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg shadow-lg shadow-blue-500/10 transition-all uppercase tracking-wider shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Generate
                </button>
              </form>

              {/* API Key List */}
              <div className="space-y-3 mt-4">
                <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  Active Credentials Registry
                </h4>

                {apiKeys.length === 0 ? (
                  <div className="text-center py-6 text-xs text-zinc-500 font-mono">
                    No active API keys found.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {apiKeys.map((key) => {
                      const displayedStr =
                        key.key.substring(0, 12) +
                        "..." +
                        key.key.substring(key.key.length - 8);
                      return (
                        <div
                          key={key.id}
                          className="rounded-lg border border-zinc-850 bg-zinc-950 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                        >
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-white">
                              {key.name}
                            </div>
                            <div className="font-mono text-[9px] text-zinc-500 flex items-center gap-2 bg-zinc-900 border border-zinc-850 px-2 py-1 rounded">
                              <Terminal className="w-3 h-3 text-blue-500" />
                              {displayedStr}
                            </div>
                          </div>
                          <div className="flex gap-2 self-end sm:self-center">
                            <button
                              onClick={() => handleCopyKey(key.id, key.key)}
                              className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
                              title="Copy Token"
                            >
                              {copiedKeyId === key.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleRevokeKey(key.id)}
                              className="p-1.5 rounded bg-rose-950/20 hover:bg-rose-900/20 border border-rose-950/30 text-rose-450 transition-colors"
                              title="Revoke Token"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security and MFA settings */}
          {activeTab === "security" && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-5 space-y-5">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-zinc-900 pb-3">
                Security Policies
              </h3>

              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-900">
                <div className="space-y-0.5 pr-6">
                  <div className="text-xs font-bold text-white">
                    Two-Factor Authentication (2FA)
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-normal">
                    Protect logins and cryptographic operations by requiring OTP
                    tokens.
                  </p>
                </div>
                <button
                  onClick={() => setTfaEnabled(!tfaEnabled)}
                  className={`w-10 h-5.5 rounded-full transition-colors relative flex items-center shrink-0 ${
                    tfaEnabled ? "bg-blue-600" : "bg-zinc-800"
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                      tfaEnabled ? "translate-x-5.5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Authorized Device Logins */}
              <div className="space-y-3.5">
                <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  Active login sessions
                </h4>
                <div className="rounded-lg bg-zinc-950 border border-zinc-900 p-4 space-y-3.5 text-xs">
                  <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
                    <div>
                      <div className="font-bold text-zinc-200">
                        Chrome (Windows 11) - Current session
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        IP: 198.162.2.4 • Dallas, US
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-zinc-350">
                        DocuTrust CLI Daemon v2.4
                      </div>
                      <div className="text-[10px] text-zinc-550 font-mono mt-0.5">
                        IP: 54.81.90.12 • AWS N. Virginia, US
                      </div>
                    </div>
                    <button
                      onClick={() => alert("Revoking API session (simulation)")}
                      className="text-[10px] font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/15 px-2 py-0.5 rounded transition-all"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing & Subscriptions Tab */}
          {activeTab === "billing" && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-5 space-y-5">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-zinc-900 pb-3">
                Billing System & Tier
              </h3>

              <div className="rounded-xl bg-gradient-to-br from-indigo-950/20 to-zinc-900/40 border border-indigo-500/20 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">
                    Active plan
                  </div>
                  <div className="text-base font-bold text-white mt-1">
                    DocuTrust Professional Tier
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-normal">
                    Next renewal date: July 24, 2026 ($49.00/month billing).
                  </p>
                </div>
                <button
                  onClick={() => alert("Upgrade modal triggered (simulation)")}
                  className="inline-flex items-center justify-center text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-650/80 px-4 py-2.5 rounded-lg shadow-md transition-all uppercase tracking-wider"
                >
                  Subscription Control
                </button>
              </div>

              {/* Payment Card */}
              <div className="space-y-3.5">
                <h4 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                  Payment Instruments
                </h4>
                <div className="rounded-lg bg-zinc-950 border border-zinc-900 p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-11 bg-zinc-900 rounded border border-zinc-850 flex items-center justify-center font-bold text-[9px] italic text-zinc-500">
                      VISA
                    </div>
                    <div>
                      <div className="font-bold text-zinc-200">
                        Visa ending in 4821
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        Expires 12 / 2029
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => alert("Update card details (simulation)")}
                    className="text-xs text-blue-400 hover:text-blue-300 font-bold"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
