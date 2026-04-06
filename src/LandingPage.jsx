import "./LandingPage.css"

export default function LandingPage({ onCreateTrip }) {
  return (
    <main className="landing">
      <section className="hero">
        <p className="eyebrow">TripTogether</p>
        <h1>Turn travel ideas into an actual plan.</h1>
        <p className="hero-text">
          Plan trip day by day, adjust as you go, and keep everything in one place.
        </p>

        <button className="primary-button" onClick={onCreateTrip}>
          Create a trip
        </button>
      </section>

      <section className="preview-section">
        <img
          className="preview-image"
          src="/itinerary-preview.png"
          alt="TripTogether itinerary preview"
        />
      </section>
    </main>
  )
}