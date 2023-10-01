import { useState } from "react"

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState("")

  const addNote = (e) => {
    e.preventDefault()

    createNote({
      content: newNote,
      important: true,
    })

    setNewNote("")
  }

  return (
    <form onSubmit={addNote}>
      <input
        id="note"
        value={newNote}
        placeholder="write note content here"
        onChange={(e) => setNewNote(e.target.value)}
      />
      <button id="save" type="submit">save</button>
    </form>
  )
}

export default NoteForm
