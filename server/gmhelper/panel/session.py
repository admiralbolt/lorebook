import random

from django.db.models import Max, Q
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from panel.models import *
from panel.constants import model_map

def update(request):
  """Update the currently loaded campaign session.

  This will render a template that has all necessary html for the session
  panel.
  """
  session = Session.objects.get(id=request.GET["key"])
  request.session["session"] = session.pk
  return render(request, "session_panel.html", {
    "session": session,
    "no_cache": random.randint(1, 100000000)
  })

def content(request):
  """Render the current session content."""
  session = Session.objects.get(id=request.session["session"])
  return render(request, "session_content.html", {
    "session": session,
    "no_cache": random.randint(1, 100000000)
  })

@csrf_exempt
def save(request):
  """Save the updated text of the current session.

  Called everytime that the save button is clicked after editing session text.
  """
  session = Session.objects.get(id=request.session["session"])
  session.content = request.POST["content"]
  session.save(update_fields=["content"])
  return render(request, "session_content.html", {
    "session": session,
    "no_cache": random.randint(1, 100000000)
  })

def edit(request):
  """Delete the item from the current session.

  Returns the updated content of the session panel.
  """
  session = Session.objects.get(id=request.session["session"])
  model = request.GET["model"]
  item = model_map[model].objects.get(pk=request.GET["key"])
  action = request.GET["action"]
  # Find if there is already an existing item. It's a little jank but it works.
  # Since relations need to be defined on each individual object, we need to
  # search the relation based on the type of object. i.e. we need to filter
  # for image=item OR letter=item e.t.c.
  existing_item = SessionItem.objects.filter(**{model.split(".")[1].lower(): item})

  if action == "delete" and existing_item:
    existing_item.delete()
    session.save()
    return HttpResponse()
  elif action == "add":
    max_order = SessionItem.objects.filter(session=session).aggregate(Max('order'))['order__max'] or 0
    session_item = SessionItem.objects.create(session=session, item=item, order=max_order + 1)
    session.save()
    return render(request, "card.html", {
      "si_id": session_item.pk,
      "item": session_item.item,
      "class": session_item.item.__class__.__name__
    })

@csrf_exempt
def update_item_order(request):
  """Update the order of data items for the current session.

  This is just changing the order they are displayed in the sidebar.
  """
  session = Session.objects.get(id=request.session["session"])
  for i, si_id in enumerate(request.POST.getlist("si[]")):
    session_item = SessionItem.objects.get(id=si_id)
    print(session_item)
    session_item.order = i + 1
    session_item.save()
  return render(request, "session_panel.html", {
    "session": session,
    "no_cache": random.randint(1, 100000000)
  })
