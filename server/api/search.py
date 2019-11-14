"""All search related functions."""

from collections import Counter
from django.http import JsonResponse
from fuzzywuzzy import fuzz
from api import models
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, parser_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

_PARTIAL_RATIO_WEIGHT = 0.6
_TOKEN_RATIO_WEIGHT = 1
_JACCARD_WEIGHT = 0.5
_SCORE_THRESHOLD = 50

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

  return (
    partial_ratio * _PARTIAL_RATIO_WEIGHT +
    token_ratio * _TOKEN_RATIO_WEIGHT +
    jc_score * _JACCARD_WEIGHT
  ) / sum([_PARTIAL_RATIO_WEIGHT, _TOKEN_RATIO_WEIGHT, _JACCARD_WEIGHT])

def convert_item_to_json(item, score):
  """Helper to convert an item to easy to use json."""
  return {
    "id": item.id,
    "model": models.MODEL_NAME_MAP[type(item)],
    "name": item.name,
    "score": score
  }

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([AllowAny])
def search(request):
  """Auto complete a keyword and return top 5 results!"""
  print(request.GET)
  keyword = request.GET.get("keyword")
  if not keyword:
    return JsonResponse({
      "status": "error",
      "message": "No keyword supplied"
    })
  data = []
  for model in models.SEARCHABLE_MODELS:
    data.extend(model.objects.all() if request.user.is_authenticated else model.objects.all().filter(visible=True))
  data = list(map(
    lambda item: convert_item_to_json(item, score(item.name, keyword)
  ), data))
  data = list(filter(lambda item : item["score"] > _SCORE_THRESHOLD, data))
  data = sorted(data, key=lambda item: item["score"], reverse=True)
  return JsonResponse(data[:5], safe=False)
