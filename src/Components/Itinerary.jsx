import { useState } from "react"

export default function Itinerary({ days, setTrip }) {
  const [newDate, setNewDate] = useState("")
  const [newCity, setNewCity] = useState("")
  const [newNotes, setNewNotes] = useState("")
  const [newStatus, setNewStatus] = useState("idea")
  const [editingId, setEditingId] = useState(null)
  const [expandedNotes, setExpandedNotes] = useState({})

  const addDay = (e) => {
    e.preventDefault()

    const date = newDate.trim()
    const city = newCity.trim()
    const notes = newNotes.trim()

    if (!date && !city && !notes) return

    const newDay = {
      id: Date.now(),
      date,
      city,
      notes,
      status: newStatus,
    }

    setTrip((prevTrip) => ({
      ...prevTrip,
      itinerary: [...prevTrip.itinerary, newDay],
    }))

    setNewDate("")
    setNewCity("")
    setNewNotes("")
    setNewStatus("idea")
  }

  const toggleNotes = (id) => {
    setExpandedNotes(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const duplicateDay = (id) => {
    setTrip((prevTrip) => {
      const index = prevTrip.itinerary.findIndex((d) => d.id === id);
      if (index === -1) return prevTrip;
  
      const dayToCopy = prevTrip.itinerary[index];
  
      const newDay = {
        ...dayToCopy,
        id: Date.now() + Math.random(), // simple unique id
        city: dayToCopy.city + " copy"
      };
  
      const newItinerary = [...prevTrip.itinerary];
      newItinerary.splice(index + 1, 0, newDay);
  
      return {
        ...prevTrip,
        itinerary: newItinerary,
      }
    })
  }

  const moveDayUp = (index) => {
    if (index === 0) return
  
    setTrip((prevTrip) => {
      const newItinerary = [...prevTrip.itinerary]
      ;[newItinerary[index - 1], newItinerary[index]] = [
        newItinerary[index],
        newItinerary[index - 1],
      ]
  
      return {
        ...prevTrip,
        itinerary: newItinerary,
      }
    })
  }

  const moveDayDown = (index) => {
    setTrip((prevTrip) => {
      if (index === prevTrip.itinerary.length - 1) return prevTrip
  
      const newItinerary = [...prevTrip.itinerary]
      ;[newItinerary[index], newItinerary[index + 1]] = [
        newItinerary[index + 1],
        newItinerary[index],
      ]
  
      return {
        ...prevTrip,
        itinerary: newItinerary,
      }
    })
  }

  const deleteDay = (id) => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      itinerary: prevTrip.itinerary.filter((day) => day.id !== id),
    }))
  }

  const nextStatus = {
    idea: "tentative",
    tentative: "confirmed",
    confirmed: "idea",
  }
  
  const cycleStatus = () => {
    setNewStatus((current) => nextStatus[current])
  }

  const [editDraft, setEditDraft] = useState({
    date: "",
    city: "",
    notes: "",
    status: "idea",
  })

  const startEdit = (day) => {
    setEditingId(day.id)
    setEditDraft(day)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }
  
  const saveEdit = () => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      itinerary: prevTrip.itinerary.map((day) =>
        day.id === editingId ? { ...day, ...editDraft } : day
      ),
    }))
  
    setEditingId(null)
  }

  const toggleStatus = (id) => {
    setTrip((prevTrip) => ({
      ...prevTrip,
      itinerary: prevTrip.itinerary.map((day) => {
        const currentStatus = day.status || "idea"
  
        return day.id === id
          ? { ...day, status: nextStatus[currentStatus] }
          : day
      }),
    }))
  }

  return (
    <>
      <div className="itinerary-header">
        <h2>Itinerary</h2>
      </div>

      <p className="section-description">
      Plan day by day. Adjust as you go.
      </p>

      {days.length === 0 ? (
        <p className="empty-state">Add your days.</p>
      ) : (
        <ul className="itinerary-list">
            {days.map((day, index) => {
                const isExpanded = expandedNotes[day.id]
                const isLong = day.notes && day.notes.length > 120

                let displayNotes = day.notes || ""

                if (!isExpanded && isLong) {
                    displayNotes = day.notes.slice(0, 120) + "..."
                }

                return (
                    <li key={day.id} className="itinerary-item">
                    {editingId === day.id ? (
                        <>
                    <div className="itinerary-main">
                    <div className="edit-top-row">
                        <input
                        className="itinerary-date-input"
                        type="text"
                        value={editDraft.date}
                        onChange={(e) =>
                            setEditDraft({ ...editDraft, date: e.target.value })
                        }
                        placeholder="Date"
                        />

                        <input
                        type="text"
                        value={editDraft.city}
                        onChange={(e) =>
                            setEditDraft({ ...editDraft, city: e.target.value })
                        }
                        placeholder="City"
                        />
                        <button
                        type="button"
                        className={`status-cycle-button status-${editDraft.status}`}
                        onClick={() =>
                            setEditDraft((current) => ({
                              ...current,
                              status: nextStatus[current.status],
                            }))
                        }
                        >
                        {editDraft.status}
                        </button>

                        <div className="edit-actions">
                            <button type="button" className="action-button text-button" onClick={saveEdit}>
                                save
                            </button>
                            <button type="button" className="action-button text-button" onClick={cancelEdit}>
                                cancel
                            </button>
                        </div>
                    </div>

                    <textarea className="edit-notes"
                        value={editDraft.notes}
                        onChange={(e) =>
                        setEditDraft({ ...editDraft, notes: e.target.value })
                        }
                        placeholder="Notes"
                        
                    />
                    </div>


                </>
                ) : (
                <>
                    <div className="itinerary-main">
                    <div className="itinerary-topline">
                        <div className="itinerary-title">
                        <span className="itinerary-date">{day.date || "No date"}</span>
                        {day.city && <span> — {day.city}</span>}
                        </div>

                        <button
                        type="button"
                        className={`status-cycle-button status-${day.status}`}
                        onClick={() => toggleStatus(day.id)}
                        >
                        {day.status}
                        </button>
                        <div className="itinerary-actions">
                            {index > 0 && (
                                <button
                                type="button"
                                className="action-button icon-button"
                                onClick={() => moveDayUp(index)}
                                >
                                ↑
                                </button>
                            )}

                            {index < days.length - 1 && (
                                <button
                                type="button"
                                className="action-button icon-button"
                                onClick={() => moveDayDown(index)}
                                >
                                ↓
                                </button>
                            )}

                            <button
                                type="button"
                                className="action-button text-button"
                                onClick={() => startEdit(day)}
                            >
                                edit
                            </button>

                            <button
                            type="button"
                            className="action-button text-button"
                            onClick={() => duplicateDay(day.id)}
                            >
                            duplicate
                            </button>

                            <button
                                type="button"
                                className="action-button text-button action-button--danger"
                                onClick={() => deleteDay(day.id)}
                            >
                                delete
                            </button>

                        </div>
                    </div>

                    {day.notes && (
                    <div className="itinerary-notes">
                        <p>{displayNotes}</p>

                        {isLong && (
                        <button
                            type="button"
                            className="action-button text-button text-button--subtle"
                            onClick={() => toggleNotes(day.id)}
                        >
                            {isExpanded ? "less ↑" : "more ↓"}
                        </button>
                        )}
                    </div>
                    )}
                    </div>

                    
                </>
                )}
            </li>
            )
        })}
        </ul>
      )}

      <form onSubmit={addDay} className="itinerary-form">
        
            <input
            className="itinerary-date-input"
            type="text"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            placeholder="Date (e.g., Day 1, Aug 12)"
            aria-label="Itinerary date"
            />
            
            <input
            type="text"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="City (e.g., Bergen)"
            aria-label="Itinerary city"
            />
        
            <button
                type="button"
                className={`status-cycle-button status-${newStatus}`}
                onClick={cycleStatus}
            >
                {newStatus}
            </button>
      

        <textarea
        value={newNotes}
        onChange={(e) => setNewNotes(e.target.value)}
        placeholder="Activities, lodging, notes, or anything else..."
        aria-label="Itinerary notes"
        />

        <button type="submit">Add</button>
      </form>
    </>
  )
}