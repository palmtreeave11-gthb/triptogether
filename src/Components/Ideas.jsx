import { useRef, useState } from "react"

export default function Ideas({ ideas, setTrip }) {
  const [newIdea, setNewIdea] = useState("")
  const inputRef = useRef(null)

  function addIdea(e) {
    e.preventDefault()

    const trimmedIdea = newIdea.trim()
    if (!trimmedIdea) return

    const idea = {
      id: Date.now(),
      text: trimmedIdea,
    }

    setTrip((prevTrip) => ({
      ...prevTrip,
      ideas: [idea, ...prevTrip.ideas],
    }))

    setNewIdea("")
    inputRef.current?.focus()
  }

  function deleteIdea(id) {
    setTrip((prevTrip) => ({
      ...prevTrip,
      ideas: prevTrip.ideas.filter((idea) => idea.id !== id),
    }))
  }

  return (
    <div>
      <div className="section-header">
        <h2>Ideas</h2>
        <p className="section-description">
          Capture trip ideas before they get lost in chat.
        </p>
      </div>

      <form className="idea-form" onSubmit={addIdea}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Add an idea, place, or activity..."
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {ideas.length === 0 ? (
        <p className="empty-state">No ideas yet.</p>
      ) : (
        <ul className="idea-list">
          {ideas.map((idea) => (
            <li key={idea.id} className="idea-item">
              <span>{idea.text}</span>
              <button
                type="button"
                className="action-button text-button"
                onClick={() => deleteIdea(idea.id)}
              >
                delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}