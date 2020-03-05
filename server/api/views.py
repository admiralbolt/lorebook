"""Primary api endpoints.

Viewsets are defined here for each of the item types. These viewsets create a
number of standard endpoints for each item i.e. viewing as a list, individual
detail, edit, and delete views.
"""
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated

from api import models
from api import serializers

# pylint: disable=too-many-ancestors

class BeastViewSet(viewsets.ModelViewSet):
  """View set for beasts."""
  resource_name = "beasts"
  queryset = models.Beast.objects.all()
  serializer_class = serializers.BeastSerializer

  def get_queryset(self):
    beasts = models.Beast.objects.order_by("name")
    return beasts if self.request.user.is_authenticated else beasts.filter(visible=True)

class LoreViewSet(viewsets.ModelViewSet):
  """View set for lore."""
  resource_name = "lores"
  queryset = models.Lore.objects.all()
  serializer_class = serializers.LoreSerializer

  def get_queryset(self):
    lores = models.Lore.objects.order_by("name")
    return lores if self.request.user.is_authenticated else lores.filter(visible=True)

class NPCViewSet(viewsets.ModelViewSet):
  """View set for NPCs."""
  resource_name = "npcs"
  queryset = models.NPC.objects.all()
  serializer_class = serializers.NPCSerializer

  def get_queryset(self):
    npcs = models.NPC.objects.order_by("name")
    return npcs if self.request.user.is_authenticated else npcs.filter(visible=True)


class PlaceViewSet(viewsets.ModelViewSet):
  """View set for places."""
  resource_name = "places"
  queryset = models.Place.objects.all()
  serializer_class = serializers.PlaceSerializer

  def get_queryset(self):
    places = models.Place.objects.order_by("name")
    return places if self.request.user.is_authenticated else places.filter(visible=True)


class SessionViewSet(viewsets.ModelViewSet):
  """View set for sessions."""
  resource_name = "sessions"
  queryset = models.Session.objects.all()
  serializer_class = serializers.SessionSerializer

  def get_queryset(self):
    sessions = models.Session.objects.order_by("ordinal")
    return sessions if self.request.user.is_authenticated else sessions.filter(visible=True)


class SongViewSet(viewsets.ModelViewSet):
  """View set for songs."""
  resource_name = "songs"
  queryset = models.Song.objects.all()
  serializer_class = serializers.SongSerializer

  def get_queryset(self):
    songs = models.Song.objects.order_by("name")
    return songs if self.request.user.is_authenticated else songs.filter(visible=True)

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([AllowAny])
def links(request):
  """Get links & aliases for all items."""
  link_data = []
  for model in models.LINKABLE_MODELS:
    all_objects = model.objects.all()
    data = all_objects if request.user.is_authenticated else all_objects.filter(visible=True)
    # We want to sort ALL links based on their length that way only a single link
    # gets matched. So we create a seperate entry for each alias-item combo,
    # then sort at the end.
    for item in data:
      link_data.append({
        "name": item.name,
        "model": models.MODEL_NAME_MAP[type(item)],
        "id": item.id
      })
      if hasattr(item, "aliases"):
        for alias in item.aliases.splitlines():
          link_data.append({
            "name": alias,
            "model": models.MODEL_NAME_MAP[type(item)],
            "id": item.id
          })
    link_data.sort(key=lambda link : len(link["name"]), reverse=True)
  return JsonResponse(link_data, safe=False)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_song(request):
  """Save a sound file to a song."""
  try:
    song = models.Song.objects.get(id=request.GET.get("id"))
  except ObjectDoesNotExist:
    return JsonResponse({
      "status": "failure",
      "message": f"Could not find song with id = {request.GET.get('id')}"
    })
  f = request.data["file"]
  song.sound_file.save(f.name, f, save=True)
  return JsonResponse({"status": "success", "message": ""})


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_place(request):
  """Save an image file to a place."""
  try:
    place = models.Place.objects.get(id=request.GET.get("id"))
  except ObjectDoesNotExist:
    return JsonResponse({
      "status": "failure",
      "message": f"Could not find place with id = {request.GET.get('id')}"
    })
  f = request.data["file"]
  place.image_file.save(f.name, f, save=True)
  return JsonResponse({"status": "success", "message": ""})


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_beast(request):
  """Save an image file to a beast."""
  try:
    beast = models.Beast.objects.get(id=request.GET.get("id"))
  except ObjectDoesNotExist:
    return JsonResponse({
      "status": "failure",
      "message": f"Could not find place with id = {request.GET.get('id')}"
    })
  f = request.data["file"]
  beast.image_file.save(f.name, f, save=True)
  return JsonResponse({"status": "success", "message": ""})
