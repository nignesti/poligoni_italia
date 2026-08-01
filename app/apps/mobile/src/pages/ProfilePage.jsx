import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { listDocuments, createDocument } from "@/api/documentsApi";
import { exportLocalData, importLocalData } from "@/lib/localStore";
import { supabase } from "@/api/supabaseClient";
import { useAuth } from "@/lib/useAuth";
import { User, FileText, AlertTriangle, ChevronRight, Loader2, Plus, Shield, Download, Upload, LogOut, X, Award } from "lucide-react";
import { computeDocumentAlerts, DOCUMENT_LABELS, formatDate } from "@/lib/domain";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";

// Le etichette locali includono "tessera_socio", non presente nell'enum
// document_type dello schema (Piano §4.2): esclusa dalle opzioni selezionabili.
const SELECTABLE_DOCUMENT_TYPES = Object.keys(DOCUMENT_LABELS).filter((t) => t !== "tessera_socio");

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddDoc, setShowAddDoc] = useState(false);
  const [saving, setSaving] = useState(false);
  const importInputRef = useRef(null);

  useBodyScrollLock(showAddDoc);

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const loadData = async () => {
    try {
      const docData = await listDocuments();
      setDocs(docData || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const alerts = computeDocumentAlerts(docs);

  const handleExportBackup = () => {
    const data = exportLocalData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `poligoni-italia-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      importLocalData(JSON.parse(text));
      alert("Backup ripristinato. Riapri Armeria, Munizioni o Documenti per vedere i dati.");
      loadData();
    } catch (err) {
      console.error(err);
      alert("File di backup non valido");
    }
    e.target.value = "";
  };

  const [newDoc, setNewDoc] = useState({
    type: "porto_armi_tav",
    expires_on: "",
  });

  const handleAddDoc = async () => {
    setSaving(true);
    try {
      await createDocument({ type: newDoc.type, expiresOn: newDoc.expires_on });
      setNewDoc({ type: "porto_armi_tav", expires_on: "" });
      setShowAddDoc(false);
      loadData();
    } catch (e) {
      console.error(e);
      alert("Errore nel salvataggio");
    }
    setSaving(false);
  };

  const alertStyles = {
    scaduto: "bg-red-50 border-red-200 text-red-700",
    urgente: "bg-red-50 border-red-200 text-red-700",
    prossimo: "bg-orange-50 border-orange-200 text-orange-700",
    attenzione: "bg-yellow-50 border-yellow-200 text-yellow-700",
    ok: "bg-green-50 border-green-200 text-green-700",
  };

  const alertLabels = {
    scaduto: "Scaduto",
    urgente: "Scade entro 7 giorni",
    prossimo: "Scade entro 30 giorni",
    attenzione: "Scade entro 90 giorni",
    ok: "Valido",
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 pt-12 pb-6 rounded-b-3xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Tiratore</h1>
            <p className="text-sm text-slate-300">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Recap riepilogo */}
        {alerts.length > 0 && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-orange-500" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Riepilogo documenti</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-2xl font-bold">{alerts.length}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Totali</p>
              </div>
              <div className="text-center border-x border-slate-700">
                <p className="text-2xl font-bold text-green-400">
                  {alerts.filter((d) => d.alertLevel === "ok").length}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Validi</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">
                  {alerts.filter((d) => d.alertLevel === "scaduto" || d.alertLevel === "urgente" || d.alertLevel === "prossimo").length}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">In scadenza</p>
              </div>
            </div>
            {alerts.some((d) => d.alertLevel === "scaduto") && (
              <div className="mt-3 bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-200">
                  {alerts.filter((d) => d.alertLevel === "scaduto").length} documento/i scaduto/i — rinnovare al più presto
                </p>
              </div>
            )}
          </div>
        )}

        {/* Documents */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Documenti e scadenze</h2>
            <button
              onClick={() => setShowAddDoc(true)}
              className="text-orange-600 text-xs font-medium flex items-center gap-0.5"
            >
              <Plus className="w-3.5 h-3.5" /> Aggiungi
            </button>
          </div>

          {alerts.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 text-center border border-slate-100">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Nessun documento registrato</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Aggiungi le date di scadenza per ricevere avvisi
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map((doc) => (
                <div
                  key={doc.id}
                  className={`rounded-xl p-3 border ${alertStyles[doc.alertLevel]} flex items-center justify-between`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{DOCUMENT_LABELS[doc.type] || doc.type}</p>
                    <p className="text-xs opacity-80">
                      Scade: {formatDate(doc.expires_on)}
                      {doc.daysLeft >= 0 ? ` (${doc.daysLeft} giorni)` : ""}
                    </p>
                  </div>
                  <span className="text-xs font-semibold whitespace-nowrap ml-2">{alertLabels[doc.alertLevel]}</span>
                </div>
              ))}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-2 flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Si salvano solo le date di scadenza, non i documenti originali. I tuoi documenti restano solo su questo dispositivo: non li inviamo né li conserviamo sui nostri server.
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <button
            onClick={handleExportBackup}
            className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50"
          >
            <Download className="w-5 h-5 text-slate-400" />
            <div className="flex-1 text-left">
              <span className="block text-sm text-slate-700">Esporta dati locali</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">Armeria, munizioni, documenti — file di backup</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={() => importInputRef.current?.click()}
            className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50"
          >
            <Upload className="w-5 h-5 text-slate-400" />
            <div className="flex-1 text-left">
              <span className="block text-sm text-slate-700">Importa backup</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">Ripristina da un file esportato in precedenza</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleImportFile}
          />
          <button className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50">
            <Shield className="w-5 h-5 text-slate-400" />
            <span className="flex-1 text-left text-sm text-slate-700">Privacy e dati</span>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 hover:bg-red-50 transition-colors text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span className="flex-1 text-left text-sm font-medium">Esci</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-400">Poligoni Italia v1.0</p>
          <p className="text-[10px] text-slate-300 mt-1">
            Strumento sportivo. Nessuna intermediazione su armi o munizioni.
          </p>
        </div>
      </div>

      {/* Add doc modal */}
      {showAddDoc && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={() => setShowAddDoc(false)}>
          <div
            className="bg-white rounded-t-3xl p-5 max-w-md w-full max-h-[85dvh] overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Aggiungi documento</h3>
              <button onClick={() => setShowAddDoc(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-500">Tipo documento</label>
                <select
                  value={newDoc.type}
                  onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {SELECTABLE_DOCUMENT_TYPES.map((key) => (
                    <option key={key} value={key}>
                      {DOCUMENT_LABELS[key]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500">Data di scadenza</label>
                <input
                  type="date"
                  value={newDoc.expires_on}
                  onChange={(e) => setNewDoc({ ...newDoc, expires_on: e.target.value })}
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                onClick={handleAddDoc}
                disabled={!newDoc.expires_on || saving}
                className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-30 active:scale-95 transition-transform"
              >
                {saving ? "Salvataggio…" : "Salva documento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
