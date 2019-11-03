from . import models
from . import serializers
from django.core.serializers import serialize
from django.http import JsonResponse
from rest_framework import generics, viewsets

class NPCViewSet(viewsets.ModelViewSet):
  resource_name = 'npcs'
  queryset = models.NPC.objects.all()
  serializer_class = serializers.NPCSerializer

  def get_queryset(self):
    """We override the default behavior to return only met npcs to unauthenticated users."""
    npcs = models.NPC.objects.order_by('name')
    return npcs if self.request.user.is_authenticated else npcs.filter(visible=True)


class SongViewSet(viewsets.ModelViewSet):
  resource_name = 'songs'
  queryset = models.Song.objects.all()
  serializer_class = serializers.SongSerializer

  def get_queryset(self):
    """We override the default behavior to return only met songs to unauthenticated users."""
    songs = models.Song.objects.order_by('name')
    return songs if self.request.user.is_authenticated else songs.filter(visible=True)


def links(self):
  links = []
  for model in models.LINKABLE_MODELS:
    all_objects = model.objects.all()
    data = all_objects if self.user.is_authenticated else all_objects.filter(visible=True)
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
