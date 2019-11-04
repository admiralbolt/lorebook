// Format errors in a sane way. Errors from the backend come in as an object
// that map the model field -> array of error messages. i.e.:
// {'description': ['This field is required', ...]}
export default function formatErrors(errors) {
  let errorString = "";
  for (let property in errors) {
    if (Array.isArray(errors[property])) {
      errors[property].forEach(error => {
        errorString += `Field '${property}' has error: ${error} <br />`;
      });
    } else {
      errorString += `Field '${property}' has error: ${errors[property]} <br />`;
    }
  }
  return errorString;
}
