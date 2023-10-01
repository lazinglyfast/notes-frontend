import Togglable from "./Togglable"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/react"

describe("<Togglable />", () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv">
          toggable content
        </div>
      </Togglable>
    ).container
  })

  test("renders its children", async () => {
    await screen.findAllByText("toggable content")
  })

  test("at start the children are not displayed", () => {
    const div = container.querySelector(".togglableContent")
    expect(div).toHaveStyle("display: none")
  })

  test("after clicking the button, children are displayed", async () => {
    const user = userEvent.setup()
    const button = screen.getByText("show...")
    await user.click(button)

    const div = container.querySelector(".togglableContent")
    expect(div).not.toHaveStyle("display: none")
  })

  test("after clicking cancel, children are hidden", async () => {
    const user = userEvent.setup()
    const show = screen.getByText("show...")
    await user.click(show)

    const cancel = screen.getByText("cancel")
    await user.click(cancel)

    const div = container.querySelector(".togglableContent")
    expect(div).toHaveStyle("display: none")
  })
})
