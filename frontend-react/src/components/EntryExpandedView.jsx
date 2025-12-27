import "../styles/entries.css";

export default function EntryExpandedView({ entry, onClose }) {

  if (!entry) return null;

  const date = new Date(entry.createdAt || entry.date)
    .toLocaleString();

    <p className="expanded-body">
  {(entry.content || entry.note || "").trim() || "— no text —"}
</p>


  return (
    <div className="expanded-overlay">

      <div className="expanded-panel">

        <button className="expanded-close" onClick={onClose}>
          Close
        </button>

        <h2 className="expanded-title">
          {entry.title || "Untitled Reflection"}
        </h2>

        <span className="expanded-date">
          {date}
        </span>

        <p className="expanded-body">
          {entry.content || entry.note}
        </p>

      </div>
    </div>
  );
}
