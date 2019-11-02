from . import models
from collections import Counter
from django.http import JsonResponse
from fuzzywuzzy import fuzz

def jaccard(a, b):
  """Get the jaccard similarity of two strings.

  In this case we use counters to better count multiple
  occurences of characters in a string.
  """
  a_count = Counter(a)
  b_count = Counter(b)
  return float(sum((a_count & b_count).values())) / sum((a_count | b_count).values())

def score(name, keyword):
  n = name.lower()
  k = keyword.lower()
  # Partial ratio allows for minor differences in words as long as substrings match. Score from 0-100.
  partial_ratio = fuzz.partial_ratio(n, k)
  # Token ratio allows for ordering differences in words as long as they are exact matches. Score from 0-100.
  token_ratio = fuzz.token_ratio(n, k)
  # Rescale jaccard to 0-100
  jc = jaccard(n, k) * 100

  return partial_ratio + 0.5 * token_ratio + 0.5 * jc

def convert_item_to_json(item):
  return {
    "id": item.id,
    "model": models.MODEL_NAME_MAP[type(item)],
    "name": obj.name,
  }

def auto_complete(request):
  keyword = request.GET["keyword"]
  if not keyword:
    return JsonResponse()
  data = [x for z in models.ALL_SEARCHABLE_OBJECTS for x in z.objects.all()]
  data = sorted(data, key=lambda item: score(item, keyword), reverse=True)
  return JsonResponse([convert_item_to_json(item) for item in data[:5]], safe=False)
