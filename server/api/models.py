from django.db import models


class NamedModel(models.Model):
  """Abstract base class to save some boilerplate."""
  name = models.CharField(max_length=128, unique=True)
  # Alternate names for a model to make them more searchable.
  # In order for them to work as intended, they should be separated on new lines.
  aliases = models.TextField(default="", blank=True)
  # Controls whether or not the players can see the item.
  visible = models.BooleanField(default=False)

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
  flavor = models.TextField(default="", blank=True)

  def __str__(self):
    return self.name


class Song(NamedModel):
  """Music makes the world go round."""
  artist = models.CharField(max_length=255, blank=True)
  flavor = models.TextField(default="", blank=True)
  tags = models.ManyToManyField(Tag, blank=True)
  # Whether or not to loop the song continuously. This is generally true for
  # things like battle & ambient music.
  loop = models.BooleanField(default=False)
  sound_file = models.FileField(upload_to="music/")
  # items = GenericRelation("SessionItem", related_query_name="song")


class City(NamedModel):
  """Cities the players have been to along the way."""
  description = models.TextField(default="", blank=True)
  info = models.TextField(default="", blank=True)


class NPC(NamedModel):
  """Characters the players meet along the way."""
  appearance = models.TextField(default="", blank=True)
  info = models.TextField(default="", blank=True)
  city = models.ForeignKey(City, on_delete=models.SET_NULL, blank=True, null=True)


class Lore(NamedModel):
  """Lore!

  Rather than creating several separate models (Lore, Letters, Books, e.t.c),
  everything will be kept underneath a single 'Lore' type.
  """
  BOOK = "Book"
  GENERAL = "General"
  LETTER = "Letter"
  lore_type = models.CharField(max_length=32, choices=(
    (BOOK, BOOK),
    (GENERAL, GENERAL),
    (LETTER, LETTER),
  ))
  author = models.ForeignKey(NPC, on_delete=models.SET_NULL, blank=True, null=True)
  date_received = models.DateField(default=None, blank=True)
  date_written = models.DateField(default=None, blank=True)
  text = models.TextField(default="", blank=True)


ADMIN_MODELS = [City, Lore, NPC, Song, Tag]
LINKABLE_MODELS = [City, Lore, NPC, Song]
SEARCHABLE_MODELS = [City, Lore, NPC, Song]
MODEL_NAME_MAP = {
  City: "city",
  Lore: "lore",
  NPC: "npc",
  Song: "song"
}
