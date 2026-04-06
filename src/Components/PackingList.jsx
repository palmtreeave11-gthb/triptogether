import { useRef, useState } from "react"
import "./PackingList.css"

export default function PackingList({ items, setItems }) {
  const [newItemName, setNewItemName] = useState("")
  const inputRef = useRef(null)

  const toggleItem = (id) => {
    setItems(items.map(item => (item.id === id ? { ...item, packed: !item.packed } : item)))
  }

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id))
  }

  const addItem = (e) => {
    e.preventDefault()
    const name = newItemName.trim()
    if (!name) return

    const nextId = items.length ? Math.max(...items.map(i => i.id)) + 1 : 1
    setItems([...items, { id: nextId, name, packed: false }])
    setNewItemName("")
    inputRef.current?.focus()
  }

  const packedCount = items.filter(item => item.packed).length
  const totalCount = items.length

  return (
    <>
      <h2 className="packinglist-header">
        <span>Things to Bring</span>
        <span>({packedCount}/{totalCount})</span>
      </h2>
      <p className="section-description">
        And what you don't want to forget.
      </p>
      <ul>
        {items.map(item => (
          <li key={item.id} className="packinglist-item">
            <label className="packinglist-itemLabel">
              <input
                type="checkbox"
                checked={item.packed}
                onChange={() => toggleItem(item.id)}
              />
              {item.name}
            </label>
            <button
              type="button"
              onClick={() => deleteItem(item.id)}
              aria-label={`Delete ${item.name}`}
              className="action-button text-button"
            >
              delete
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={addItem} className="packinglist-form">
        <input
          ref={inputRef}
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="packinglist-input"
          placeholder="Add an item (e.g., Passport)"
          aria-label="New packing item"
        />
        <button type="submit">Add</button>
      </form>
    </>
  )
}
