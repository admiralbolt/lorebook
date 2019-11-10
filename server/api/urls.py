from . import search
from . import views
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

router = routers.DefaultRouter(trailing_slash=False)
router.register(r"beasts", views.BeastViewSet)
router.register(r"lores", views.LoreViewSet)
router.register(r"npcs", views.NPCViewSet)
router.register(r"places", views.PlaceViewSet)
router.register(r"songs", views.SongViewSet)

urlpatterns = [
  path("api-auth-token/", obtain_auth_token),
  path("links/", views.links),
  path("beasts/upload/", views.upload_beast),
  path("songs/upload/", views.upload_song),
  path("places/upload/", views.upload_place),
  path("search/", search.auto_complete),
  url(r"^", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
