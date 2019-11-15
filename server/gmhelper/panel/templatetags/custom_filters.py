import re

from bs4 import BeautifulSoup
from django import template
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe
from panel.models import City, Dungeon

register = template.Library()

@register.filter(name="class_name")
def class_name(value):
  return value.__class__.__name__

@register.filter(name="custom_views")
def custom_views(html_text):
  soup = BeautifulSoup(html_text, "html.parser")
  for city_tag in soup.find_all("city"):
    city = City.objects.get(id=city_tag["id"])
    city_tag.replace_with(BeautifulSoup(render_to_string("city.html", {"city": city})))
  for dungeon_tag in soup.find_all("dungeon"):
    dungeon = Dungeon.objects.get(id=dungeon_tag["id"])
    dungeon_tag.replace_with(BeautifulSoup(render_to_string("dungeon.html", {"dungeon": dungeon})))
  regex = re.compile(r"\n+", re.IGNORECASE)
  for item in soup:
    item_text = str(item).strip()
    if not item_text.startswith("<"):
      item.replace_with(BeautifulSoup(item_text.replace("\n", "<br />")))
  return soup
