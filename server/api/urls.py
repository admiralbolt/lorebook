from django.urls import path
from . import views

urlpatterns = [
  path("npc/", views.NPCListCreate.as_view()),
  path("npc/<int:pk>/", views.NPCDetail.as_view()),
]
