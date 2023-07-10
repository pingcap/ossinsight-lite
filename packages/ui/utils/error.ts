export function getErrorInfo (error: unknown) {
  let message: string
  let title: string | undefined
  if (error) {
    if (typeof error === 'object') {
      if ('message' in error) {
        message = String(error.message)
      }else {
        message = error.toString()
      }
      if ('title' in error) {
        title = String(error.title)
      } else if ('type' in error) {
        title = String(error.type)
      }
    } else {
      message = String(error)
    }
  } else {
    message = 'No message'
  }

  return { title, message }
}