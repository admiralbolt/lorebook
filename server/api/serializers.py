from . import models
from rest_framework import serializers


class NPCSerializer(serializers.ModelSerializer):

  class Meta:
    model = models.NPC
    fields = "__all__"
