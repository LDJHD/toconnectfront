"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/lib/services/admin";
import { abonnementsService } from "@/lib/services/abonnements";
import { articlesService } from "@/lib/services/articles";
import { categoriesService } from "@/lib/services/categories";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";

const getPlatformColor = (plateforme: string) => {
  const colors: Record<string, string> = {
    Netflix: "#e50914", "Prime Video": "#00a8e1", Spotify: "#1db954", GogoFlix: "#f5a623", CapCut: "#111111", Disney: "#113ccf", "Disney+": "#113ccf",
  };
  return colors[plateforme] || "#6c5ce7";
};

type Tab = "type_comptes" | "comptes" | "abonnements" | "articles" | "utilisateurs" | "codes";

function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("type_comptes");

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [addAdminError, setAddAdminError] = useState("");
  const [addAdminSuccess, setAddAdminSuccess] = useState("");

  const [abonnements, setAbonnements] = useState<any[]>([]);
  const [typeComptes, setTypeComptes] = useState<any[]>([]);
  const [comptes, setComptes] = useState<any[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [promoHistory, setPromoHistory] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const adminData = localStorage.getItem("admin_data");
    if (!token || !adminData) { router.push("/admin"); return; }
    setAdmin(JSON.parse(adminData));
  }, [router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [aboRes, tcRes, cRes, uRes, artRes, catRes, promoRes, promoHistRes] = await Promise.allSettled([
        abonnementsService.getAll(),
        abonnementsService.getTypeComptes(),
        adminService.getComptes(),
        adminService.getUtilisateurs(),
        articlesService.getAllAdmin(),
        categoriesService.all(),
        adminService.getPromoCodes(),
        adminService.getPromoCodeHistory(),
      ]);
      if (aboRes.status === "fulfilled") setAbonnements(aboRes.value.data?.data || aboRes.value.data || []);
      if (tcRes.status === "fulfilled") setTypeComptes(tcRes.value.data?.data || tcRes.value.data || []);
      if (cRes.status === "fulfilled") setComptes(cRes.value.data?.data || cRes.value.data || []);
      if (uRes.status === "fulfilled") setUtilisateurs(uRes.value.data?.data || uRes.value.data || []);
      if (artRes.status === "fulfilled") setArticles(artRes.value.data?.data || artRes.value.data || []);
      if (catRes.status === "fulfilled") setCategories(catRes.value.data?.data || catRes.value.data || []);
      if (promoRes.status === "fulfilled") setPromoCodes(promoRes.value.data?.data || promoRes.value.data || []);
      if (promoHistRes.status === "fulfilled") setPromoHistory(promoHistRes.value.data?.data || promoHistRes.value.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (admin) fetchData(); }, [admin, fetchData]);

  const handleLogout = () => { localStorage.removeItem("admin_token"); localStorage.removeItem("admin_data"); router.push("/admin"); };

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminPassword) { setAddAdminError("Remplir tous les champs"); return; }
    if (newAdminPassword.length < 6) { setAddAdminError("Min. 6 caracteres"); return; }
    setAddingAdmin(true); setAddAdminError(""); setAddAdminSuccess("");
    try {
      await adminService.createAdmin({ email: newAdminEmail, motDePasse: newAdminPassword });
      setAddAdminSuccess("Admin cree !"); setNewAdminEmail(""); setNewAdminPassword("");
      setTimeout(() => { setShowAddAdmin(false); setAddAdminSuccess(""); }, 1500);
    } catch (err: any) { setAddAdminError(err?.response?.data?.error || "Erreur"); }
    finally { setAddingAdmin(false); }
  };

  if (!admin) return null;

  const tabs: { key: Tab; label: string; count: number; icon: string }[] = [
    { key: "type_comptes", label: "Formules", count: typeComptes.length, icon: "fi-rr-list" },
    { key: "comptes", label: "Comptes", count: comptes.length, icon: "fi-rr-user" },
    { key: "abonnements", label: "Abonnements", count: abonnements.length, icon: "fi-rr-play" },
    { key: "articles", label: "Articles", count: articles.length, icon: "fi-rr-shopping-bag" },
    { key: "utilisateurs", label: "Utilisateurs", count: utilisateurs.length, icon: "fi-rr-users" },
    { key: "codes", label: "Codes points", count: promoCodes.length, icon: "fi-rr-ticket" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f7" }}>
      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#e50914", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.9rem" }}><i className="fi-rr-settings"></i></div>
          <div><span style={{ fontWeight: 700, fontSize: "1rem" }}>Tkp Store</span><span style={{ display: "block", fontSize: "0.75rem", color: "#999" }}>Administration</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => setShowAddAdmin(true)} style={{ ...btnStyle, background: "#e50914", padding: "8px 18px", fontSize: "0.85rem" }}><i className="fi-rr-plus"></i> Ajouter admin</button>
          <span style={{ fontSize: "0.85rem", color: "#666" }}>{admin.email}</span>
          <button onClick={handleLogout} style={{ background: "#f5f5f5", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", color: "#e50914" }}>Deconnexion</button>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "25px 20px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "25px", overflowX: "auto", paddingBottom: "5px" }}>
          {tabs.map((tab) => (
            <div key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ minWidth: "150px", flex: 1, background: activeTab === tab.key ? "#e50914" : "#fff", color: activeTab === tab.key ? "#fff" : "#333", borderRadius: "14px", padding: "18px", cursor: "pointer", transition: "all 0.3s ease", boxShadow: activeTab === tab.key ? "0 4px 15px rgba(229,9,20,0.3)" : "0 2px 8px rgba(0,0,0,0.04)", border: activeTab === tab.key ? "none" : "1px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <i className={tab.icon} style={{ fontSize: "1.1rem", opacity: 0.8 }}></i>
                <span style={{ fontSize: "1.6rem", fontWeight: 800 }}>{tab.count}</span>
              </div>
              <span style={{ fontWeight: 600, fontSize: "0.82rem" }}>{tab.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1.3rem", margin: 0 }}>{tabs.find((t) => t.key === activeTab)?.label}</h3>
          <button onClick={fetchData} disabled={loading} style={{ background: "#fff", border: "1px solid #ddd", padding: "8px 18px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}><i className="fi-rr-refresh"></i> Actualiser</button>
        </div>

        {loading ? (
          <div className="text-center" style={{ padding: "60px" }}><div className="spinner-border text-danger" role="status" /></div>
        ) : (
          <>
            {activeTab === "type_comptes" && <TypeComptesTab data={typeComptes} onRefresh={fetchData} />}
            {activeTab === "comptes" && <ComptesTab data={comptes} onRefresh={fetchData} />}
            {activeTab === "abonnements" && <AbonnementsTab data={abonnements} onRefresh={fetchData} />}
            {activeTab === "articles" && <ArticlesTab data={articles} categories={categories} onRefresh={fetchData} />}
            {activeTab === "utilisateurs" && <UtilisateursTab data={utilisateurs} />}
            {activeTab === "codes" && <PromoCodesTab codes={promoCodes} history={promoHistory} onRefresh={fetchData} />}
          </>
        )}
      </div>

      {showAddAdmin && (
        <Modal onClose={() => setShowAddAdmin(false)} title="Ajouter un admin">
          {addAdminError && <AlertMsg type="error" text={addAdminError} />}
          {addAdminSuccess && <AlertMsg type="success" text={addAdminSuccess} />}
          <FormField label="Email" type="email" value={newAdminEmail} onChange={setNewAdminEmail} placeholder="admin@email.com" />
          <FormField label="Mot de passe" type="password" value={newAdminPassword} onChange={setNewAdminPassword} placeholder="Min. 6 caracteres" />
          <SubmitBtn loading={addingAdmin} text="Creer le compte admin" onClick={handleAddAdmin} />
        </Modal>
      )}
    </div>
  );
}

/* ==================== TYPE COMPTES ==================== */

function TypeComptesTab({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [nom, setNom] = useState("");
  const [plateforme, setPlateforme] = useState("Netflix");
  const [prix, setPrix] = useState("");
  const [nombreEcran, setNombreEcran] = useState("1");
  const [description, setDescription] = useState("");
  const [composition, setComposition] = useState("");

  const resetForm = () => { setNom(""); setPlateforme("Netflix"); setPrix(""); setNombreEcran("1"); setDescription(""); setComposition(""); setEditing(null); setError(""); setImageFile(null); setImagePreview(null); };

  const openEdit = (tc: any) => {
    setEditing(tc); setNom(tc.nom || ""); setPlateforme(tc.plateforme || "Netflix"); setPrix(String(tc.prix || "")); setNombreEcran(String(tc.nombreEcran || tc.nombre_ecran || "1")); setDescription(tc.description || ""); setComposition(tc.composition || "");
    setImagePreview(tc.image ? `${BACKEND_URL}/${tc.image}` : null); setImageFile(null); setShowForm(true); setError("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSave = async () => {
    if (!nom || !prix) { setError("Nom et prix sont requis"); return; }
    setSaving(true); setError("");
    const fd = new FormData();
    fd.append("nom", nom); fd.append("plateforme", plateforme); fd.append("prix", prix); fd.append("nombreEcran", nombreEcran); fd.append("description", description); fd.append("composition", composition);
    if (imageFile) fd.append("image", imageFile);
    try {
      if (editing) { await adminService.updateTypeCompte(editing.id, fd); }
      else { await adminService.createTypeCompte(fd); }
      resetForm(); setShowForm(false); onRefresh();
    } catch (err: any) { setError(err?.response?.data?.message || "Erreur"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette formule ?")) return;
    try { await adminService.deleteTypeCompte(id); onRefresh(); } catch { alert("Erreur"); }
  };

  return (
    <div>
      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} style={{ ...btnStyle, background: showForm ? "#666" : "#e50914" }}>
          <i className={showForm ? "fi-rr-cross" : "fi-rr-plus"}></i> {showForm ? "Fermer" : "Ajouter une formule"}
        </button>
      </div>
      {showForm && (
        <div style={formCardStyle}>
          <h4 style={{ fontWeight: 700, marginBottom: "20px" }}>{editing ? "Modifier la formule" : "Nouvelle formule"}</h4>
          {error && <AlertMsg type="error" text={error} />}
          <div className="row">
            <div className="col-md-6"><FormField label="Nom *" value={nom} onChange={setNom} placeholder="Ex: Netflix Standard" /></div>
            <div className="col-md-6">
              <label style={labelStyle}>Plateforme *</label>
              <select value={plateforme} onChange={(e) => setPlateforme(e.target.value)} className="form-control" style={inputStyle}>
                {["Netflix", "Prime Video", "Spotify", "GogoFlix", "CapCut", "Disney+","Pack"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-md-4"><FormField label="Prix/mois (F) *" type="number" value={prix} onChange={setPrix} placeholder="2500" /></div>
            <div className="col-md-4"><FormField label="Nb ecrans" type="number" value={nombreEcran} onChange={setNombreEcran} placeholder="1" /></div>
            <div className="col-md-4"><FormField label="Composition" value={composition} onChange={setComposition} placeholder="Optionnel" /></div>
            <div className="col-12"><FormField label="Description" value={description} onChange={setDescription} placeholder="Description de la formule" /></div>
            <div className="col-12">
              <label style={labelStyle}>Image</label>
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                {imagePreview && <img src={imagePreview} alt="preview" style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px", border: "1px solid #eee" }} />}
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} style={{ display: "none" }} />
                <button type="button" onClick={() => fileRef.current?.click()} style={{ ...btnStyle, background: "#f0f0f0", color: "#333", padding: "8px 16px", fontSize: "0.85rem" }}>
                  <i className="fi-rr-picture"></i> {imagePreview ? "Changer l'image" : "Ajouter une image"}
                </button>
              </div>
            </div>
          </div>
          <SubmitBtn loading={saving} text={editing ? "Enregistrer" : "Creer"} onClick={handleSave} />
        </div>
      )}
      <div style={tableCardStyle}>
        {data.length === 0 ? <EmptyState text="Aucune formule" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}><thead><tr style={theadRowStyle}>
              <Th>Image</Th><Th>Nom</Th><Th>Plateforme</Th><Th>Ecrans</Th><Th>Prix/mois</Th><Th>Actions</Th>
            </tr></thead><tbody>
              {data.map((tc: any) => (
                <tr key={tc.id} style={tbodyRowStyle}>
                  <Td><ImgThumb src={tc.image ? `${BACKEND_URL}/${tc.image}` : null} /></Td>
                  <Td style={{ fontWeight: 600 }}>{tc.nom}</Td>
                  <Td><PlatformBadge name={tc.plateforme} /></Td>
                  <Td>{tc.nombreEcran || tc.nombre_ecran || "-"}</Td>
                  <Td style={{ fontWeight: 700, color: getPlatformColor(tc.plateforme) }}>{Number(tc.prix).toLocaleString("fr-FR")} F</Td>
                  <Td><ActionBtns onEdit={() => openEdit(tc)} onDelete={() => handleDelete(tc.id)} /></Td>
                </tr>
              ))}
            </tbody></table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== ARTICLES ==================== */

function ArticlesTab({ data, categories, onRefresh }: { data: any[]; categories: any[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const filesRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<{ url: string; file?: File; id?: number; fromServer?: boolean }[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [prixPromo, setPrixPromo] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stock, setStock] = useState("0");
  const [enVedette, setEnVedette] = useState(false);
  const [actif, setActif] = useState(true);

  const resetForm = () => {
    setNom(""); setDescription(""); setPrix(""); setPrixPromo(""); setCategoryId(""); setStock("0"); setEnVedette(false); setActif(true);
    setEditing(null); setError(""); setImagePreviews([]); setDeletedImageIds([]);
  };

  const openEdit = (art: any) => {
    setEditing(art); setNom(art.nom || ""); setDescription(art.description || ""); setPrix(String(art.prix || "")); setPrixPromo(String(art.prixPromo || art.prix_promo || "")); setCategoryId(String(art.categoryId || art.category_id || "")); setStock(String(art.stock || "0")); setEnVedette(art.enVedette || art.en_vedette || false); setActif(art.actif !== false);
    const existingImages = (art.images || []).map((img: any) => ({ url: `${BACKEND_URL}${img.imageUrl || img.image_url}`, id: img.id, fromServer: true }));
    setImagePreviews(existingImages); setDeletedImageIds([]); setShowForm(true); setError("");
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((f) => ({ url: URL.createObjectURL(f), file: f }));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    if (filesRef.current) filesRef.current.value = "";
  };

  const removeImage = (index: number) => {
    const img = imagePreviews[index];
    if (img.fromServer && img.id) { setDeletedImageIds((prev) => [...prev, img.id!]); }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!nom || !prix || !categoryId) { setError("Nom, prix et categorie sont requis"); return; }
    setSaving(true); setError("");

    // Delete removed server images
    for (const imgId of deletedImageIds) {
      try { await articlesService.deleteImage(imgId); } catch { /* ignore */ }
    }

    const fd = new FormData();
    fd.append("nom", nom); fd.append("prix", prix); fd.append("categoryId", categoryId); fd.append("stock", stock);
    if (description) fd.append("description", description);
    if (prixPromo) fd.append("prixPromo", prixPromo);
    if (enVedette) fd.append("enVedette", "true");
    if (editing) fd.append("actif", actif ? "true" : "false");

    // Add new files
    const newFiles = imagePreviews.filter((p) => p.file);
    newFiles.forEach((p) => { if (p.file) fd.append("images", p.file); });

    try {
      if (editing) { await articlesService.update(editing.id, fd); }
      else { await articlesService.create(fd); }
      resetForm(); setShowForm(false); onRefresh();
    } catch (err: any) { setError(err?.response?.data?.message || err?.response?.data?.error || "Erreur"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet article et ses images ?")) return;
    try { await articlesService.delete(id); onRefresh(); } catch { alert("Erreur"); }
  };

  return (
    <div>
      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} style={{ ...btnStyle, background: showForm ? "#666" : "#e50914" }}>
          <i className={showForm ? "fi-rr-cross" : "fi-rr-plus"}></i> {showForm ? "Fermer" : "Ajouter un article"}
        </button>
      </div>
      {showForm && (
        <div style={formCardStyle}>
          <h4 style={{ fontWeight: 700, marginBottom: "20px" }}>{editing ? "Modifier l'article" : "Nouvel article"}</h4>
          {error && <AlertMsg type="error" text={error} />}
          <div className="row">
            <div className="col-md-8"><FormField label="Nom *" value={nom} onChange={setNom} placeholder="Nom de l'article" /></div>
            <div className="col-md-4">
              <label style={labelStyle}>Categorie *</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="form-control" style={inputStyle}>
                <option value="">-- Choisir --</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div className="col-md-3"><FormField label="Prix (F) *" type="number" value={prix} onChange={setPrix} placeholder="5000" /></div>
            <div className="col-md-3"><FormField label="Prix promo (F)" type="number" value={prixPromo} onChange={setPrixPromo} placeholder="Optionnel" /></div>
            <div className="col-md-3"><FormField label="Stock" type="number" value={stock} onChange={setStock} placeholder="0" /></div>
            <div className="col-md-3" style={{ display: "flex", alignItems: "center", gap: "20px", paddingTop: "28px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
                <input type="checkbox" checked={enVedette} onChange={(e) => setEnVedette(e.target.checked)} /> En vedette
              </label>
              {editing && (
                <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.85rem" }}>
                  <input type="checkbox" checked={actif} onChange={(e) => setActif(e.target.checked)} /> Actif
                </label>
              )}
            </div>
            <div className="col-12"><FormField label="Description" value={description} onChange={setDescription} placeholder="Description de l'article" /></div>
            <div className="col-12">
              <label style={labelStyle}>Images</label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "10px" }}>
                {imagePreviews.map((img, i) => (
                  <div key={i} style={{ position: "relative", width: "90px", height: "70px" }}>
                    <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", border: "1px solid #eee" }} />
                    <button onClick={() => removeImage(i)} style={{ position: "absolute", top: "-6px", right: "-6px", background: "#e50914", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "0.6rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="fi-rr-cross"></i>
                    </button>
                    {i === 0 && <span style={{ position: "absolute", bottom: "2px", left: "2px", background: "#e50914", color: "#fff", fontSize: "0.55rem", padding: "1px 5px", borderRadius: "4px" }}>Principal</span>}
                  </div>
                ))}
                <input ref={filesRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFilesChange} style={{ display: "none" }} />
                <button type="button" onClick={() => filesRef.current?.click()} style={{ width: "90px", height: "70px", borderRadius: "8px", border: "2px dashed #ddd", background: "#fafafa", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", color: "#999", fontSize: "0.7rem" }}>
                  <i className="fi-rr-plus" style={{ fontSize: "1rem" }}></i> Ajouter
                </button>
              </div>
            </div>
          </div>
          <SubmitBtn loading={saving} text={editing ? "Enregistrer" : "Creer"} onClick={handleSave} />
        </div>
      )}
      <div style={tableCardStyle}>
        {data.length === 0 ? <EmptyState text="Aucun article" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}><thead><tr style={theadRowStyle}>
              <Th>Image</Th><Th>Nom</Th><Th>Categorie</Th><Th>Prix</Th><Th>Promo</Th><Th>Stock</Th><Th>Statut</Th><Th>Actions</Th>
            </tr></thead><tbody>
              {data.map((art: any) => {
                const mainImg = art.images?.find((i: any) => i.principal) || art.images?.[0];
                return (
                  <tr key={art.id} style={tbodyRowStyle}>
                    <Td><ImgThumb src={mainImg ? `${BACKEND_URL}${mainImg.imageUrl || mainImg.image_url}` : null} /></Td>
                    <Td style={{ fontWeight: 600, maxWidth: "200px", whiteSpace: "normal" }}>{art.nom}</Td>
                    <Td>{art.category?.nom || art.categorie?.nom || "-"}</Td>
                    <Td style={{ fontWeight: 700 }}>{Number(art.prix).toLocaleString("fr-FR")} F</Td>
                    <Td style={{ color: art.prixPromo || art.prix_promo ? "#e50914" : "#ccc" }}>{(art.prixPromo || art.prix_promo) ? `${Number(art.prixPromo || art.prix_promo).toLocaleString("fr-FR")} F` : "-"}</Td>
                    <Td>{art.stock}</Td>
                    <Td><StatusBadge status={art.actif !== false ? "actif" : "inactif"} /></Td>
                    <Td><ActionBtns onEdit={() => openEdit(art)} onDelete={() => handleDelete(art.id)} /></Td>
                  </tr>
                );
              })}
            </tbody></table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== COMPTES ==================== */

function ComptesTab({ data, onRefresh }: { data: any[]; onRefresh: () => void; }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [emailCompte, setEmailCompte] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [plateforme, setPlateforme] = useState("Netflix");
  const [nbUtilisateurs, setNbUtilisateurs] = useState("8");
  const [dateExpiration, setDateExpiration] = useState("");

  const resetForm = () => { setEmailCompte(""); setMotDePasse(""); setPlateforme("Netflix"); setNbUtilisateurs("8"); setDateExpiration(""); setEditing(null); setError(""); };

  const openEdit = (c: any) => {
    setEditing(c); setEmailCompte(c.emailCompte || c.email_compte || ""); setMotDePasse(c.motDePasse || c.mot_de_passe || ""); setPlateforme(c.plateforme || "Netflix"); setNbUtilisateurs(String(c.nbUtilisateurs || c.nb_utilisateurs || "8"));
    setDateExpiration(c.dateExpiration ? c.dateExpiration.substring(0, 10) : c.date_expiration ? c.date_expiration.substring(0, 10) : ""); setShowForm(true); setError("");
  };

  const handleSave = async () => {
    if (!emailCompte || !motDePasse) { setError("Email et mot de passe requis"); return; }
    setSaving(true); setError("");
    const payload = { emailCompte, motDePasse, plateforme, nbUtilisateurs: Number(nbUtilisateurs), dateExpiration: dateExpiration || undefined };
    try {
      if (editing) { await adminService.updateCompte(editing.id, payload); }
      else { await adminService.createCompte(payload); }
      resetForm(); setShowForm(false); onRefresh();
    } catch (err: any) { setError(err?.response?.data?.error || "Erreur"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce compte ?")) return;
    try { await adminService.deleteCompte(id); onRefresh(); } catch { alert("Erreur"); }
  };

  return (
    <div>
      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} style={{ ...btnStyle, background: showForm ? "#666" : "#e50914" }}>
          <i className={showForm ? "fi-rr-cross" : "fi-rr-plus"}></i> {showForm ? "Fermer" : "Ajouter un compte"}
        </button>
      </div>
      {showForm && (
        <div style={formCardStyle}>
          <h4 style={{ fontWeight: 700, marginBottom: "20px" }}>{editing ? "Modifier le compte" : "Nouveau compte"}</h4>
          {error && <AlertMsg type="error" text={error} />}
          <div className="row">
            <div className="col-md-6"><FormField label="Email du compte *" type="email" value={emailCompte} onChange={setEmailCompte} placeholder="compte@netflix.com" /></div>
            <div className="col-md-6"><FormField label="Mot de passe *" value={motDePasse} onChange={setMotDePasse} placeholder="Mot de passe" /></div>
            <div className="col-md-4">
              <label style={labelStyle}>Plateforme *</label>
              <select value={plateforme} onChange={(e) => setPlateforme(e.target.value)} className="form-control" style={inputStyle}>
                {["Netflix", "Prime Video", "Spotify", "GogoFlix", "CapCut", "Disney+"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="col-md-4"><FormField label="Nb utilisateurs" type="number" value={nbUtilisateurs} onChange={setNbUtilisateurs} placeholder="8" /></div>
            <div className="col-md-4"><FormField label="Date expiration" type="date" value={dateExpiration} onChange={setDateExpiration} /></div>
          </div>
          <SubmitBtn loading={saving} text={editing ? "Enregistrer" : "Creer"} onClick={handleSave} />
        </div>
      )}
      <div style={tableCardStyle}>
        {data.length === 0 ? <EmptyState text="Aucun compte" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}><thead><tr style={theadRowStyle}>
              <Th>ID</Th><Th>Email</Th><Th>Mot de passe</Th><Th>Plateforme</Th><Th>Utilisateurs</Th><Th>Expiration</Th><Th>Actions</Th>
            </tr></thead><tbody>
              {data.map((c: any) => (
                <tr key={c.id} style={tbodyRowStyle}>
                  <Td>#{c.id}</Td>
                  <Td style={{ fontWeight: 600 }}>{c.emailCompte || c.email_compte || "-"}</Td>
                  <Td><code style={{ background: "#f5f5f5", padding: "3px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>{c.motDePasse || c.mot_de_passe || "***"}</code></Td>
                  <Td><PlatformBadge name={c.plateforme} /></Td>
                  <Td>{c.nbUtilisateurs || c.nb_utilisateurs || "-"}</Td>
                  <Td style={{ color: "#999", fontSize: "0.8rem" }}>{(c.dateExpiration || c.date_expiration) ? new Date(c.dateExpiration || c.date_expiration).toLocaleDateString("fr-FR") : "-"}</Td>
                  <Td><ActionBtns onEdit={() => openEdit(c)} onDelete={() => handleDelete(c.id)} /></Td>
                </tr>
              ))}
            </tbody></table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== ABONNEMENTS ==================== */

function AbonnementsTab({ data, onRefresh }: { data: any[]; onRefresh: () => void }) {
  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet abonnement ?")) return;
    try { const api = (await import("@/lib/api")).default; await api.delete(`/abonnements/delete/${id}`); onRefresh(); } catch { alert("Erreur"); }
  };
  if (data.length === 0) return <div style={tableCardStyle}><EmptyState text="Aucun abonnement" /></div>;
  return (
    <div style={tableCardStyle}><div style={{ overflowX: "auto" }}>
      <table style={tableStyle}><thead><tr style={theadRowStyle}>
        <Th>ID</Th><Th>Utilisateur</Th><Th>Plateforme</Th><Th>Formule</Th><Th>Debut</Th><Th>Fin</Th><Th>Statut</Th><Th>Actions</Th>
      </tr></thead><tbody>
        {data.map((abo: any) => (
          <tr key={abo.id} style={tbodyRowStyle}>
            <Td>#{abo.id}</Td>
            <Td><div><span style={{ fontWeight: 600, display: "block" }}>{abo.utilisateur?.nom || abo.nom || "-"}</span><span style={{ color: "#999", fontSize: "0.8rem" }}>{abo.utilisateur?.email || abo.email || ""}</span></div></Td>
            <Td><PlatformBadge name={abo.typeCompte?.plateforme || abo.type_compte?.plateforme || ""} /></Td>
            <Td>{abo.typeCompte?.nom || abo.type_compte?.nom || "-"}</Td>
            <Td style={{ color: "#999", fontSize: "0.8rem" }}>{(abo.dateDebut || abo.date_debut) ? new Date(abo.dateDebut || abo.date_debut).toLocaleDateString("fr-FR") : "-"}</Td>
            <Td style={{ color: "#999", fontSize: "0.8rem" }}>{(abo.dateFin || abo.date_fin) ? new Date(abo.dateFin || abo.date_fin).toLocaleDateString("fr-FR") : "-"}</Td>
            <Td><StatusBadge status={(abo.inactif || abo.fin) ? "inactif" : "actif"} /></Td>
            <Td><button onClick={() => handleDelete(abo.id)} style={deleteBtnStyle} title="Supprimer"><i className="fi-rr-trash"></i></button></Td>
          </tr>
        ))}
      </tbody></table>
    </div></div>
  );
}

/* ==================== UTILISATEURS ==================== */

function UtilisateursTab({ data }: { data: any[] }) {
  if (data.length === 0) return <div style={tableCardStyle}><EmptyState text="Aucun utilisateur" /></div>;
  return (
    <div style={tableCardStyle}><div style={{ overflowX: "auto" }}>
      <table style={tableStyle}><thead><tr style={theadRowStyle}>
        <Th>ID</Th><Th>Nom</Th><Th>Email</Th><Th>Telephone</Th><Th>Inscription</Th>
      </tr></thead><tbody>
        {data.map((u: any) => (
          <tr key={u.id} style={tbodyRowStyle}>
            <Td>#{u.id}</Td><Td style={{ fontWeight: 600 }}>{u.nom || "-"}</Td><Td>{u.email || "-"}</Td><Td>{u.telephone || "-"}</Td>
            <Td style={{ color: "#999", fontSize: "0.8rem" }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("fr-FR") : "-"}</Td>
          </tr>
        ))}
      </tbody></table>
    </div></div>
  );
}

function PromoCodesTab({ codes, history, onRefresh }: { codes: any[]; history: any[]; onRefresh: () => void }) {
  const [generatedCode, setGeneratedCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const generateRandomCode = () => {
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();
    setGeneratedCode(`TC-${Date.now().toString().slice(-4)}-${random}`);
    setError("");
    setSuccess("");
  };

  const handleConfirm = async () => {
    if (!generatedCode) {
      setError("Generez d'abord un code");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await adminService.createPromoCode({ code: generatedCode, pointsValue: 0.05 });
      setSuccess("Code enregistre en base");
      setGeneratedCode("");
      onRefresh();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={formCardStyle}>
        <h4 style={{ fontWeight: 700, marginBottom: "16px" }}>Generation de code points</h4>
        {error && <AlertMsg type="error" text={error} />}
        {success && <AlertMsg type="success" text={success} />}
        <div className="row">
          <div className="col-md-8">
            <FormField label="Code genere" value={generatedCode} onChange={setGeneratedCode} placeholder="Cliquez sur Generer" />
          </div>
          <div className="col-md-4" style={{ display: "flex", alignItems: "end", gap: "8px", paddingBottom: "15px" }}>
            <button onClick={generateRandomCode} style={{ ...btnStyle, background: "#111827", padding: "10px 14px", fontSize: "0.85rem" }}>
              Generer
            </button>
            <button onClick={handleConfirm} disabled={saving} style={{ ...btnStyle, padding: "10px 14px", fontSize: "0.85rem", opacity: saving ? 0.7 : 1 }}>
              {saving ? "..." : "Confirmer"}
            </button>
          </div>
        </div>
      </div>

      <div style={tableCardStyle}>
        <div style={{ padding: "16px", borderBottom: "1px solid #eee", fontWeight: 700 }}>Codes disponibles (utilisables 1 fois)</div>
        {codes.length === 0 ? <EmptyState text="Aucun code actif" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}><thead><tr style={theadRowStyle}>
              <Th>Code</Th><Th>Points</Th><Th>Date</Th>
            </tr></thead><tbody>
              {codes.map((code: any) => (
                <tr key={code.id} style={tbodyRowStyle}>
                  <Td style={{ fontWeight: 700 }}>{code.code}</Td>
                  <Td>+{Number(code.pointsValue || code.points_value || 0).toFixed(2)}</Td>
                  <Td>{code.createdAt ? new Date(code.createdAt).toLocaleString("fr-FR") : "-"}</Td>
                </tr>
              ))}
            </tbody></table>
          </div>
        )}
      </div>

      <div style={{ ...tableCardStyle, marginTop: "16px" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid #eee", fontWeight: 700 }}>Historique (qui a fait quoi)</div>
        {history.length === 0 ? <EmptyState text="Aucun historique" /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}><thead><tr style={theadRowStyle}>
              <Th>Action</Th><Th>Code</Th><Th>User/Admin</Th><Th>Points</Th><Th>Date</Th>
            </tr></thead><tbody>
              {history.map((h: any) => (
                <tr key={h.id} style={tbodyRowStyle}>
                  <Td>{h.action}</Td>
                  <Td style={{ fontWeight: 700 }}>{h.code}</Td>
                  <Td>{h.utilisateurId || h.utilisateur_id ? `User #${h.utilisateurId || h.utilisateur_id}` : h.adminId || h.admin_id ? `Admin #${h.adminId || h.admin_id}` : "-"}</Td>
                  <Td>{h.pointsAdded || h.points_added ? `+${Number(h.pointsAdded || h.points_added).toFixed(2)}` : "-"}</Td>
                  <Td>{h.createdAt ? new Date(h.createdAt).toLocaleString("fr-FR") : "-"}</Td>
                </tr>
              ))}
            </tbody></table>
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== SHARED ==================== */

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: "16px", padding: "30px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
          <h3 style={{ fontWeight: 700, fontSize: "1.2rem", margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#999" }}><i className="fi-rr-cross"></i></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, type = "text", value, onChange, placeholder }: { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (<div style={{ marginBottom: "15px" }}><label style={labelStyle}>{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="form-control" style={inputStyle} /></div>);
}

function SubmitBtn({ loading, text, onClick }: { loading: boolean; text: string; onClick: () => void }) {
  return (<button onClick={onClick} disabled={loading} style={{ width: "100%", background: "#e50914", color: "#fff", border: "none", padding: "13px", borderRadius: "10px", fontWeight: 700, fontSize: "0.95rem", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginTop: "5px" }}>{loading && <span className="spinner-border spinner-border-sm me-2" role="status" />}{text}</button>);
}

function AlertMsg({ type, text }: { type: "error" | "success"; text: string }) {
  return (<div style={{ background: type === "error" ? "#fef2f2" : "#e8f5e9", color: type === "error" ? "#dc2626" : "#2e7d32", padding: "10px 14px", borderRadius: "8px", marginBottom: "15px", fontSize: "0.85rem" }}>{text}</div>);
}

function ActionBtns({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (<div style={{ display: "flex", gap: "6px" }}><button onClick={onEdit} style={editBtnStyle} title="Modifier"><i className="fi-rr-pencil"></i></button><button onClick={onDelete} style={deleteBtnStyle} title="Supprimer"><i className="fi-rr-trash"></i></button></div>);
}

function ImgThumb({ src }: { src: string | null }) {
  return src ? <img src={src} alt="" style={{ width: "50px", height: "40px", objectFit: "cover", borderRadius: "6px", border: "1px solid #eee" }} /> : <div style={{ width: "50px", height: "40px", borderRadius: "6px", background: "#f5f5f5", display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: "0.8rem" }}><i className="fi-rr-picture"></i></div>;
}

function PlatformBadge({ name }: { name: string }) {
  return (<span style={{ background: `${getPlatformColor(name)}15`, color: getPlatformColor(name), padding: "4px 10px", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600 }}>{name || "-"}</span>);
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  const isActive = s === "actif" || s === "active";
  return (<span style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, background: isActive ? "#e8f5e9" : "#fef2f2", color: isActive ? "#2e7d32" : "#dc2626" }}>{status || "N/A"}</span>);
}

function EmptyState({ text }: { text: string }) {
  return (<div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}><i className="fi-rr-info" style={{ fontSize: "2rem", display: "block", marginBottom: "10px" }}></i><p>{text}</p></div>);
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ padding: "14px 16px", textAlign: "left", fontSize: "0.8rem", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{children}</th>;
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <td style={{ padding: "14px 16px", fontSize: "0.9rem", whiteSpace: "nowrap", ...style }}>{children}</td>;
}

/* ==================== STYLES ==================== */
const labelStyle: React.CSSProperties = { display: "block", fontWeight: 600, fontSize: "0.85rem", marginBottom: "6px", color: "#333" };
const inputStyle: React.CSSProperties = { padding: "11px 14px", borderRadius: "10px", border: "2px solid #eee", width: "100%" };
const btnStyle: React.CSSProperties = { background: "#e50914", color: "#fff", border: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" };
const formCardStyle: React.CSSProperties = { background: "#fff", borderRadius: "16px", padding: "25px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #eee" };
const tableCardStyle: React.CSSProperties = { background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid #eee" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse" };
const theadRowStyle: React.CSSProperties = { background: "#fafafa", borderBottom: "2px solid #f0f0f0" };
const tbodyRowStyle: React.CSSProperties = { borderBottom: "1px solid #f5f5f5" };
const editBtnStyle: React.CSSProperties = { background: "#f0f7ff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", color: "#2563eb", fontSize: "0.85rem" };
const deleteBtnStyle: React.CSSProperties = { background: "#fef2f2", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", color: "#dc2626", fontSize: "0.85rem" };

export default AdminDashboard;
