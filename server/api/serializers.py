"""Serialize database items.

Manipulate data to make it easier for the client to use.
"""

import json
from rest_framework import serializers
from api import models

class AliasSerializer(serializers.Field):
  """Custom serializer for aliases.

  Internally aliases are newline seperated strings.
  Externally it's an actual array.
  """

  def to_representation(self, value):
    return value.splitlines()

  def to_internal_value(self, data):
    return "\n".join(data)

class JsonSerializer(serializers.Field):
  """Custom serializer for json fields.

  Internally json fields are represented as a string.
  Externally it's json. What the fuck did you expect?
  """

  def to_representation(self, value):
    return json.loads(value) if value else []

  def to_internal_value(self, data):
    return json.dumps(data)


class BeastSerializer(serializers.ModelSerializer):
  """Serialize beasts..."""

  class Meta:
    model = models.Beast
    fields = "__all__"

class LoreSerializer(serializers.ModelSerializer):
  """Serialize lore..."""

  class Meta:
    model = models.Lore
    fields = "__all__"

class NPCSerializer(serializers.ModelSerializer):
  """Serialize an NPC..."""
  aliases = AliasSerializer(required=False)

  class Meta:
    model = models.NPC
    fields = "__all__"


class PlaceSerializer(serializers.ModelSerializer):
  """Serialize a place...

  Aliases and points of interest need to be custom serialized.
  """
  aliases = AliasSerializer(required=False)
  points_of_interest = JsonSerializer(required=False)

  class Meta:
    model = models.Place
    fields = "__all__"


class SessionSerializer(serializers.ModelSerializer):
  """Serialize a session..."""

  class Meta:
    model = models.Session
    fields = "__all__"
