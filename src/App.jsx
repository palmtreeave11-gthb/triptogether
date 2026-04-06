import { useEffect, useState } from "react"
import LandingPage from "./LandingPage"
import PackingList from "./Components/PackingList"
import Ideas from "./Components/Ideas"
import Itinerary from "./Components/Itinerary"
import "./App.css"

export default function App() {
  const [showTrip, setShowTrip] = useState(false)
  // localStorage.removeItem("tripData")
  const [trip, setTrip] = useState(() => {
    const stored = window.localStorage.getItem("tripData")

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return {
          title: parsed.title || "New Trip",
          ideas: parsed.ideas || [],
          itinerary: parsed.itinerary || [],
          packingItems: parsed.packingItems || [],
        }
      } catch {
        // fall through to default trip
      }
    }

    return {
      title: "New Trip",
      ideas: [{id: 1, text: "Trolltunga hiking"}],
      itinerary: [],
      packingItems: [{ id: 1, name: "Rain jacket", packed: false }],
    }
  })

  useEffect(() => {
    window.localStorage.setItem("tripData", JSON.stringify(trip))
  }, [trip])

  if (!showTrip) {
    return <LandingPage onCreateTrip={() => setShowTrip(true)} />
  }

  return (
    <main className="app">
      <header className="app-header">
        <p className="eyebrow">TripTogether</p>
        <h1>{trip.title}</h1>
        <p className="subtitle">
          Plan trips with friends before the trip begins.
        </p>
      </header>

      <section className="section-card">
        <Ideas ideas={trip.ideas} setTrip={setTrip} />
      </section>
      <section className="section-card">
        <Itinerary days={trip.itinerary} setTrip={setTrip} />
      </section>

      <section className="section-card">
        <PackingList
          items={trip.packingItems}
          setItems={(newItems) =>
            setTrip((prevTrip) => ({
              ...prevTrip,
              packingItems: newItems,
            }))
          }
        />
      </section>
    </main>
  )
}
