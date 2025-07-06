import { useEffect, useState } from "react";
import { ethers } from "ethers";
import contractABI from "./PropertyRegistry.json";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";

const CONTRACT_ADDRESS = "0x76ba0eE43d4894Abf2dcE433b8D12dbcd4ed9cD0"; // Remplace par le tien

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formAdd, setFormAdd] = useState({
    certId: "",
    owner: "",
    propertyType: "",
    location: "",
    area: "",
    date: "",
  });

  const [formEdit, setFormEdit] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // 🆕 Citoyen : recherche par nom
  const [citizenName, setCitizenName] = useState("");
  const [citizenCertificates, setCitizenCertificates] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("🦊 Installez MetaMask !");
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      const instance = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      setAccount(addr);
      setContract(instance);

      const adminAddress = await instance.getAdmin();
      setIsAdmin(adminAddress.toLowerCase() === addr.toLowerCase());
    };

    init();
  }, []);

  const handleAddChange = (e) => {
    setFormAdd({ ...formAdd, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await contract.addCertificate(
        formAdd.certId,
        formAdd.owner,
        formAdd.propertyType,
        formAdd.location,
        parseInt(formAdd.area),
        formAdd.date
      );
      alert("✅ Certificat ajouté !");
      setFormAdd({ certId: "", owner: "", propertyType: "", location: "", area: "", date: "" });
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'ajout.");
    }
  };

  const handleEditChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await contract.updateCertificate(
        formEdit.certId,
        formEdit.owner,
        formEdit.propertyType,
        formEdit.location,
        parseInt(formEdit.area),
        formEdit.date
      );
      alert("✏️ Certificat modifié avec succès !");
      setFormEdit(null);
    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de la modification.");
    }
  };

  const handleSearch = async () => {
    try {
      const cert = await contract.verifyCertificate(searchId);
      if (!cert || cert.owner === "") {
        setResult(null);
        setError("❌ Aucun certificat trouvé.");
      } else {
        setResult(cert);
        setError("");
      }
    } catch (err) {
      console.error(err);
      setError("❌ Erreur de recherche.");
    }
  };

  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Certificat de Propriété", 20, 20);
    doc.setFontSize(12);
    doc.text(`ID : ${data.certId}`, 20, 40);
    doc.text(`Propriétaire : ${data.owner}`, 20, 50);
    doc.text(`Type : ${data.propertyType}`, 20, 60);
    doc.text(`Localisation : ${data.location}`, 20, 70);
    doc.text(`Superficie : ${data.area} m²`, 20, 80);
    doc.text(`Date : ${data.date}`, 20, 90);
    doc.save(`Certificat-${data.certId}.pdf`);
  };

  // 🔍 Recherche citoyen par nom (filtrage côté client)
  const handleCitizenSearch = async () => {
    if (!citizenName) return;
    const found = [];
    const possibleIds = ["CERT-001", "CERT-002", "CERT-003", "CERT-004", "CERT-005"]; // Liste d’exemples
    for (let id of possibleIds) {
      try {
        const cert = await contract.verifyCertificate(id);
        if (cert.owner.toLowerCase() === citizenName.toLowerCase()) {
          found.push(cert);
        }
      } catch {}
    }
    setCitizenCertificates(found);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-primary">🌍 Certificat de Propriété Territoriale</h2>
      <p><strong>👤 Compte connecté :</strong> {account || "Aucun"}</p>
      <hr />

      {/* Admin : ajout certificat */}
      {isAdmin && (
        <>
          <h4>📝 Ajouter un certificat</h4>
          <form onSubmit={handleAdd}>
            {["certId", "owner", "propertyType", "location", "area", "date"].map((field) => (
              <input
                key={field}
                className="form-control my-2"
                name={field}
                type={field === "area" ? "number" : field === "date" ? "date" : "text"}
                placeholder={field}
                value={formAdd[field]}
                onChange={handleAddChange}
                required
              />
            ))}
            <button className="btn btn-primary">Ajouter</button>
          </form>
          <hr />
        </>
      )}

      {/* Recherche globale par ID */}
      <h4>🔍 Rechercher un certificat (ID)</h4>
      <div className="input-group mb-3">
        <input className="form-control" value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="Entrez ID certificat" />
        <button className="btn btn-secondary" onClick={handleSearch}>Rechercher</button>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      {result && (
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">📄 Certificat trouvé</h5>
            <p><strong>ID :</strong> {result.certId}</p>
            <p><strong>Propriétaire :</strong> {result.owner}</p>
            <p><strong>Type :</strong> {result.propertyType}</p>
            <p><strong>Localisation :</strong> {result.location}</p>
            <p><strong>Superficie :</strong> {result.area} m²</p>
            <p><strong>Date :</strong> {result.date}</p>

            <button className="btn btn-outline-success mt-3 me-3" onClick={() => generatePDF(result)}>📄 Exporter PDF</button>

            {isAdmin && (
              <button
                className="btn btn-outline-warning mt-3"
                onClick={() =>
                  setFormEdit({ ...result, area: result.area.toString() })
                }
              >
                ✏️ Modifier
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modifier un certificat */}
      {formEdit && isAdmin && (
        <>
          <hr />
          <h4>✏️ Modifier certificat</h4>
          <form onSubmit={handleEdit}>
            {["certId", "owner", "propertyType", "location", "area", "date"].map((field) => (
              <input
                key={field}
                className="form-control my-2"
                name={field}
                type={field === "area" ? "number" : field === "date" ? "date" : "text"}
                value={formEdit[field]}
                onChange={handleEditChange}
                readOnly={field === "certId"}
                required
              />
            ))}
            <button className="btn btn-warning">Mettre à jour</button>
          </form>
        </>
      )}

      {/* 🧑‍🤝‍🧑 Section citoyen */}
      <hr />
      <h4>👥 Espace citoyen : voir mes certificats</h4>
      <div className="input-group mb-3">
        <input
          className="form-control"
          value={citizenName}
          onChange={(e) => setCitizenName(e.target.value)}
          placeholder="Nom propriétaire"
        />
        <button className="btn btn-info" onClick={handleCitizenSearch}>Afficher</button>
      </div>

      {citizenCertificates.length > 0 && (
        <div className="mt-3">
          <h5>📄 Certificats trouvés ({citizenCertificates.length})</h5>
          {citizenCertificates.map((c, i) => (
            <div key={i} className="border p-3 mb-3 rounded bg-light">
              <p><strong>ID :</strong> {c.certId}</p>
              <p><strong>Type :</strong> {c.propertyType}</p>
              <p><strong>Localisation :</strong> {c.location}</p>
              <p><strong>Superficie :</strong> {c.area} m²</p>
              <p><strong>Date :</strong> {c.date}</p>
              <button className="btn btn-outline-success btn-sm" onClick={() => generatePDF(c)}>📄 PDF</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
