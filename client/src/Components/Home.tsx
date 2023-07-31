import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { socket } from "../socket";

import Logo from "../assets/Google_Docs.max-2800x2800-1 (1).svg";

export default function Home() {
  const navigate = useNavigate();

  interface docType {
    _id: string;
    docId: string;
    email: string;
    data: string | object;
    thumbnail?: string | null;
  }
  const [docs, setDocs] = useState<[docType] | null>(null);

  const createDoc = async () => {
    const newDocId = uuidv4();
    const email = localStorage.getItem("email");

    const response = await axios.post(
      "http://localhost:4000/api/doc/create-doc",
      { newDocId, email }
    );

    if (!response.data.success) return console.log("Internal Server Error");
    navigate(`/documents/${newDocId}`);
  };

  useEffect(() => {
    const getAllDocs = async () => {
      const email = localStorage.getItem("email");
      const authToken = localStorage.getItem("auth-token");

      const response = await axios.post(
        "http://localhost:4000/api/doc/get-all-docs",
        { email, authToken }
      );

      const docs = response.data.docs;
      if (!docs) return;

      setDocs(docs);
    };
    getAllDocs();
  }, []);

  return (
    <>
      <div className="nav">
        <input type="checkbox" id="nav-check" />
        <div className="nav-header">
          <img src={Logo} alt="" />
          <div className="nav-title">Docs</div>
        </div>
        {/* Search*/}
        <div className="search-bar">
          <span className="material-symbols-outlined">search</span>
          <input type="text" placeholder="Search" />
        </div>
        {/* Hamburger */}
        <div className="nav-btn">
          <label htmlFor="nav-check">
            <span></span>
            <span></span>
            <span></span>
          </label>
        </div>

        <div className="nav-links">
          <button onClick={createDoc}>
            <span className="material-symbols-outlined">note_add</span>
          </button>
        </div>
      </div>

      <div className="body" id="docs">
        {docs ? (
          docs.length > 0 ? (
            docs.map((doc) => {
              return (
                <Link
                  key={doc._id}
                  className="card"
                  to={`/documents/${doc.docId}`}
                  style={{
                    background: `url(${doc.thumbnail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></Link>
              );
            })
          ) : (
            <p>
              Welcome! Start by creating a new document to get going. Click the
              button in top right corner to begin crafting your content.
            </p>
          )
        ) : (
          <p>Loading Docs...</p>
        )}
      </div>
    </>
  );
}
