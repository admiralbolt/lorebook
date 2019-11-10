from . import models
from . import serializers
from django.core.serializers import serialize
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, authentication_classes, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated


class BeastViewSet(viewsets.ModelViewSet):
  resource_name = "beasts"
  queryset = models.Beast.objects.all()
  serializer_class = serializers.BeastSerializer

  def get_queryset(self):
    beasts = models.Beast.objects.order_by("name")
    return beasts if self.request.user.is_authenticated else beasts.filter(visible=True)

class LoreViewSet(viewsets.ModelViewSet):
  resource_name = "lores"
  queryset = models.Lore.objects.all()
  serializer_class = serializers.LoreSerializer

  def get_queryset(self):
    lores = models.Lore.objects.order_by("name")
    return lores if self.request.user.is_authenticated else lores.filter(visible=True)

class NPCViewSet(viewsets.ModelViewSet):
  resource_name = "npcs"
  queryset = models.NPC.objects.all()
  serializer_class = serializers.NPCSerializer

  def get_queryset(self):
    npcs = models.NPC.objects.order_by("name")
    return npcs if self.request.user.is_authenticated else npcs.filter(visible=True)


class PlaceViewSet(viewsets.ModelViewSet):
  resource_name = "places"
  queryset = models.Place.objects.all()
  serializer_class = serializers.PlaceSerializer

  def get_queryset(self):
    places = models.Place.objects.order_by("name")
    return places if self.request.user.is_authenticated else places.filter(visible=True)


class SongViewSet(viewsets.ModelViewSet):
  resource_name = "songs"
  queryset = models.Song.objects.all()
  serializer_class = serializers.SongSerializer

  def get_queryset(self):
    songs = models.Song.objects.order_by("name")
    return songs if self.request.user.is_authenticated else songs.filter(visible=True)


def links(request):
  links = []
  for model in models.LINKABLE_MODELS:
    all_objects = model.objects.all()
    data = all_objects if request.user.is_authenticated else all_objects.filter(visible=True)
    for item in data:
      link = {
        "aliases": [item.name],
        "model": models.MODEL_NAME_MAP[type(item)],
        "id": item.id
      }
      if hasattr(item, "aliases"):
        for alias in item.aliases.splitlines():
          link["aliases"].append(alias)
        link["aliases"].sort(key=lambda s: len(s), reverse=True)
      links.append(link)

  return JsonResponse(links, safe=False)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_song(request):
  try:
    song = models.Song.objects.get(id=request.GET.get("id"))
  except:
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
  try:
    place = models.Place.objects.get(id=request.GET.get("id"))
  except:
    return JsonResponse({
      "status": "failure",
      "message": f"Could not find place with id = {request.GET.get('id')}"
    })
  f = request.data["file"]
  place.image_file.save(f.name, f, save=True)
  return JsonResponse({"status": "success", "message": ""})
