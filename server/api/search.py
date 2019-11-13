"""All search related functions."""

from collections import Counter
from django.http import JsonResponse
from fuzzywuzzy import fuzz
from api import models

def jaccard(a, b):
  """Get the jaccard similarity of two strings.

  In this case we use counters to better count multiple
  occurences of characters in a string.
  """
  a_count = Counter(a)
  b_count = Counter(b)
  return float(sum((a_count & b_count).values())) / sum((a_count | b_count).values())

def score(name, keyword):
  """Compute a matching score for a keyword / item name.

  The score is computed as a weighted sum of:
    1. Partial Ratio * 1
    2. Token Ratio * 0.5
    3. Jaccard similiarity * 0.5
  """
  name_lower = name.lower()
  keyword_lower = keyword.lower()
  # Partial ratio allows for minor difference in words as long as substrings match.
  # Score is a range from 0-100.
  partial_ratio = fuzz.partial_ratio(name_lower, keyword_lower)
  # Token ratio allows for ordering differences in words as long as they are exact matches.
  # Score is a range from 0-100.
  token_ratio = fuzz.token_set_ratio(name_lower, keyword_lower)
  # Rescale jaccard to 0-100
  jc_score = jaccard(name_lower, keyword_lower) * 100

  return partial_ratio + 0.5 * token_ratio + 0.5 * jc_score

def convert_item_to_json(item):
  """Helper to convert an item to easy to use json."""
  return {
    "id": item.id,
    "model": models.MODEL_NAME_MAP[type(item)],
    "name": item.name,
  }

def auto_complete(request):
  """Auto complete a keyword and return top 5 results!"""
  keyword = request.GET["keyword"]
  if not keyword:
    return JsonResponse({
      "status": "error",
      "message": "No keyword supplied"
    })
  data = [x for z in models.SEARCHABLE_MODELS for x in z.objects.all()]
  data = sorted(data, key=lambda item: score(item, keyword), reverse=True)
  return JsonResponse([convert_item_to_json(item) for item in data[:5]], safe=False)
