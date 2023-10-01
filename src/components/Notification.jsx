// import { PropTypes } from "prop-types"

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={"message " + message.type}>
      {message.text}
    </div>
  )
}
// Notification.propTypes = {
//   message: {
//
//   }
//   message: PropTypes.string,
//   type: PropTypes.string,
// }

export default Notification
