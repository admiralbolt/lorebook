from . import models
from . import serializers
from rest_framework import generics

class NPCListCreate(generics.ListCreateAPIView):
  queryset = models.NPC.objects.all()
  serializer_class = serializers.NPCSerializer

  def get_queryset(self):
    """We override the default behavior to return only met npcs to unauthenticated users."""
    return models.NPC.objects.all() if self.request.user.is_authenticated else models.NPC.objects.all().filter(met=True)



class NPCDetail(generics.RetrieveUpdateDestroyAPIView):
  queryset = models.NPC.objects.all()
  serializer_class = serializers.NPCSerializer

  def get_queryset(self):
    """We override the default behavior to return only met npcs to unauthenticated users."""
    return models.NPC.objects.all() if self.request.user.is_authenticated else models.NPC.objects.all().filter(met=True)
