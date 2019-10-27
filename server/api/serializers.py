from . import models
from rest_framework import serializers

class AliasSerializer(serializers.Field):

  def to_representation(self, aliases_text):
    return aliases_text.splitlines()

  def to_internal_value(self, aliases_list):
    return "\n".join(aliases_list)


class NPCSerializer(serializers.ModelSerializer):

  aliases = AliasSerializer()

  class Meta:
    model = models.NPC
    fields = "__all__"


class SongSerializer(serializers.ModelSerializer):

  class Meta:
    model = models.Song
    fields = "__all__"
