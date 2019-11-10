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


class Beast(NamedModel):
  """Raawwwwrrr."""
  appearance = models.TextField(default="", blank=True)
  info = models.TextField(default="", blank=True)
  image_file = models.FileField(upload_to="beasts/", blank=True)


class Song(NamedModel):
  """Music makes the world go round."""
  artist = models.CharField(max_length=255, blank=True)
  flavor = models.TextField(default="", blank=True)
  # Whether or not to loop the song continuously. This is generally true for
  # things like battle & ambient music.
  loop = models.BooleanField(default=False)
  sound_file = models.FileField(upload_to="music/", blank=True)


class Place(NamedModel):
  """Cities, dungeons, and features the players have been to along the way."""
  description = models.TextField(default="", blank=True)
  info = models.TextField(default="", blank=True)
  image_file = models.FileField(upload_to="places/", blank=True)
  type = models.CharField(max_length=32, choices=(
    ("City", "City"),
    ("Dungeon", "Dungeon"),
    ("Location", "Location")
  ))
  # Points of interest within a place will be stored as serialized JSON. I feel
  # like creating a whole new table for this isn't worthwhile. The JSON for
  # points of interest will be simple:
  # [{"name": "The Painted Pony", "info": "..."}, ...]
  points_of_interest = models.TextField(default="", blank=True)


class NPC(NamedModel):
  """Characters the players meet along the way."""
  appearance = models.TextField(default="", blank=True)
  info = models.TextField(default="", blank=True)


class Lore(NamedModel):
  """Lore!

  Rather than creating several separate models (Lore, Letters, Books, e.t.c),
  everything will be kept underneath a single 'Lore' type.
  """
  type = models.CharField(max_length=32, choices=(
    ("Book", "Book"),
    ("General", "General"),
    ("Letter", "Letter"),
    ("Story", "Story"),
  ))
  author = models.CharField(default="", max_length=128, blank=True);
  date_received = models.DateField(default=None, blank=True, null=True)
  text = models.TextField(default="", blank=True)


ADMIN_MODELS = [Beast, Lore, NPC, Place, Song]
LINKABLE_MODELS = [Beast, Lore, Place, NPC, Song]
SEARCHABLE_MODELS = [Beast, Lore, Place, NPC, Song]
MODEL_NAME_MAP = {
  Beast: "beast",
  Lore: "lore",
  NPC: "npc",
  Place: "place",
  Song: "song"
}
