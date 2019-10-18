from django.db import models

class NamedModel(models.Model):
  """Abstract base class to save some boilerplate."""
  name = models.CharField(max_length=128)

  class Meta:
    abstract = True

  def __str__(self):
    return self.name

class Tag(models.Model):
  """An abstract class for classifying data items.

  Will be used to make things more searchable in the future. Music will be
  tagged with things like 'Battle' and 'Ambient'.
  """
  name = models.CharField(max_length=64)
  flavor = models.TextField(default=None, blank=True)

  def __str__(self):
    return self.name


class Song(NamedModel):
  """Music makes the world go round."""
  artist = models.CharField(max_length=255, blank=True)
  flavor = models.TextField(default=None, blank=True)
  tags = models.ManyToManyField(Tag, blank=True)
  # Whether or not to loop the song continuously. This is generally true for
  # things like battle & ambient music.
  loop = models.BooleanField(default=False)
  sound_file = models.FileField(upload_to="music/")
  # items = GenericRelation("SessionItem", related_query_name="song")

class NPC(NamedModel):
  """Characters the players meet along the way."""
  appearance = models.TextField(default=None, blank=True)
  lore = models.TextField(default=None, blank=True)
  # Whether or not the players have met the npc yet.
  met = models.BooleanField(default=False)

ADMIN_MODELS = [NPC, Song]
