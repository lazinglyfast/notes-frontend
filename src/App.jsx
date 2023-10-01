import { useState, useEffect, useRef } from "react"
import Note from "./components/Note"
import NoteForm from "./components/NoteForm"
import LoginForm from "./components/LoginForm"
import Togglable from "./components/Togglable"
import Notification from "./components/Notification"
import User from "./components/User"
import Footer from "./components/Footer"
import notesService from "./services/notes"

const App = () => {
  const [notes, setNotes] = useState(null)
  const [showAll, setShowAll] = useState(true)
  const [message, setMessage] = useState(null)
  // what, if useState(null) then I get setUsername undefined downstream
  const [user, setUser] = useState(null)
  const [attemptLogin, setAttemptLogin] = useState(false)

  const recoverCredentialsHook = () => {

    const loggedUserString = window.localStorage.getItem("loggedUser")
    if (loggedUserString) {
      const loggedUser = JSON.parse(loggedUserString)
      setUser(loggedUser)
      notesService.setToken(loggedUser.token)
    }
  }
  useEffect(recoverCredentialsHook, [])

  const listNotesHook = () => {
    notesService
      .list()
      .then(data => {
        setNotes(data)
      })
  }
  // [] means run only on first render
  useEffect(listNotesHook, [])

  const toggleImportanceOf = (note) => {
    // shallow!
    const changedNote = {
      ...note,
      important: !note.important
    }

    //HTTP PUT replaces
    //HTTP PATCH changes some properties
    notesService
      .update(changedNote)
      .then((data) => {
        setNotes(notes.map(n => n.id == note.id ? data : n))
      })
      .catch(() => {
        const text = `the note '${note.content}' was already deleted from the server`
        notify({ text, type: "error" })
        setNotes(notes.filter(n => n.id != note.id))
      })
  }

  const noteFormRef = useRef()
  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={createNote} />
    </Togglable>
  )

  const createNote = async (note) => {
    noteFormRef.current.toggleVisibility()
    const newNote = await notesService.create(note)
    setNotes(notes.concat(newNote))
  }


  const notify = message => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)

  }

  if (!notes) {
    return null
  }

  const loginForm = () => {
    return (<LoginForm
      setUser={setUser}
      setAttemptLogin={setAttemptLogin}
      notify={notify}
    />)
  }

  const loginButton = () => {
    return (
      <button type="button" onClick={() => setAttemptLogin(true)}>login</button>
    )
  }

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser")
    setUser(null)
    notesService.setToken(null)
    setAttemptLogin(false)
  }
  // I briefly slept on the keyboard typing a long line of consssssssssssss...
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={message} />
      {attemptLogin ? loginForm() : (!user && loginButton())}
      {user && noteForm()}
      {user && <User user={user} handleLogout={handleLogout} />}
      <div>
        <button type="button" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show only important notes" : "Show all notes"}
        </button>
      </div>

      <h2>Notes</h2>

      <ul>
        {
          notes
            .filter((note) => showAll || note.important)
            .map((note) => {
              return (
                <Note
                  key={note.id}
                  note={note}
                  toggleImportance={() => toggleImportanceOf(note)} />
              )
            })
        }
      </ul>
      <Footer />
    </div>
  )
}

export default App
