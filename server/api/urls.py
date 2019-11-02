from . import search
from . import views
from django.conf.urls import url
from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"npcs", views.NPCViewSet)

urlpatterns = [
  path("songs/", views.SongListCreate.as_view()),
  path("songs/<int:pk>/", views.SongDetail.as_view()),
  path("api-auth-token/", obtain_auth_token),
  path("links/", views.links),
  path("search/", search.auto_complete),
  url(r"^", include(router.urls)),
]
