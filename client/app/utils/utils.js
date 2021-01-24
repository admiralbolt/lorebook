// Format errors in a sane way. Errors from the backend come in as an object
// that map the model field -> array of error messages. i.e.:
// {'description': ['This field is required', ...]}
export function formatErrors(errors) {
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

// Format model names for display. This is mostly to titleize names but in
// cases like NPC every letter is capital.
export function formatModelName(modelName) {
  return {
    'beast': 'Beast',
    'lore': 'Lore',
    'place': 'Place',
    'npc': 'NPC',
    'session': 'Sesh'
  }[modelName] || modelName;
}

// Format model names for *plural* display.
export function formatModelNamePlural(modelName) {
  return {
    'beast': 'Beasts',
    'lore': 'Lore',
    'place': 'Places',
    'npc': 'NPCs',
    'session': 'Seshes'
  }[modelName] || modelName;
}
