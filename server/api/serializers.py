from . import models
import json
from rest_framework import serializers

class AliasSerializer(serializers.Field):

  def to_representation(self, aliases_text):
    return aliases_text.splitlines()

  def to_internal_value(self, aliases_list):
    return "\n".join(aliases_list)

class JsonSerializer(serializers.Field):

  def to_representation(self, json_string):
    return json.loads(json_string)

  def to_internal_value(self, json_data):
    return json.dumps(json_data)


class NPCSerializer(serializers.ModelSerializer):
  aliases = AliasSerializer(required=False)

  class Meta:
    model = models.NPC
    fields = "__all__"


class PlaceSerializer(serializers.ModelSerializer):
  aliases = AliasSerializer(required=False)
  points_of_interest = JsonSerializer(required=False)

  class Meta:
    model = models.Place
    fields = "__all__"


class SongSerializer(serializers.ModelSerializer):

  class Meta:
    model = models.Song
    fields = "__all__"
