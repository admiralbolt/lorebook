from . import models
from . import serializers
from rest_framework import generics

class NPCListCreate(generics.ListCreateAPIView):
  queryset = models.NPC.objects.all()
  serializer_class = serializers.NPCSerializer

  def get_queryset(self):
    """We override the default behavior to return only met npcs to unauthenticated users."""
    npcs = models.NPC.objects.order_by('name')
    return npcs if self.request.user.is_authenticated else npcs.filter(visible=True)


class NPCDetail(generics.RetrieveUpdateDestroyAPIView):
  queryset = models.NPC.objects.all()
  serializer_class = serializers.NPCSerializer

  def get_queryset(self):
    """We override the default behavior to return only met npcs to unauthenticated users."""
    npcs = models.NPC.objects.order_by('name')
    return npcs if self.request.user.is_authenticated else npcs.filter(visible=True)

class SongListCreate(generics.ListCreateAPIView):
  queryset = models.Song.objects.all()
  serializer_class = serializers.SongSerializer

  def get_queryset(self):
    """We override the default behavior to return only non-hidden songs to unauthenticated users."""
    songs = models.Song.objects.order_by('name')
    return songs if self.request.user.is_authenticated else songs.filter(visible=True)

class SongDetail(generics.RetrieveUpdateDestroyAPIView):
  queryset = models.Song.objects.all()
  serializer_class = serializers.SongSerializer

  def get_queryset(self):
    """We override the default behavior to return only non-hidden songs to unauthenticated users."""
    songs = models.Song.objects.order_by('name')
    return songs if self.request.user.is_authenticated else songs.filter(visible=True)
