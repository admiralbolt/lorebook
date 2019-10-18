from . import models
from . import serializers
from rest_framework import generics

class NPCListCreate(generics.ListCreateAPIView):
  queryset = models.NPC.objects.all()
  serializer_class = serializers.NPCSerializer

class NPCDetail(generics.RetrieveUpdateDestroyAPIView):
  queryset = models.NPC.objects.all()
  serializer_class = serializers.NPCSerializer
