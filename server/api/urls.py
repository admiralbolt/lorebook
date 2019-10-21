from . import views
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
  path("npcs/", views.NPCListCreate.as_view()),
  path("npcs/<int:pk>/", views.NPCDetail.as_view()),
  path("api-auth-token/", obtain_auth_token),
]
