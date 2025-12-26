import EntriesList from "./components/EntriesList";

export default function App() {
  return (
    <div className="app-container">

      <div className="hero">

  <h1 className="hero-title">
    <span className="accent">Personal</span> Growth Tracker
  </h1>

  <p className="hero-sub">
    reflections • mind archive • self evolution
  </p>

</div>


      <EntriesList />

    </div>
  );
}
