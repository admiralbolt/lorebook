"""Route urls -> views."""

from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from api import search
from api import views

router = routers.DefaultRouter(trailing_slash=False)  # pylint: disable=invalid-name
router.register(r"beasts", views.BeastViewSet)
router.register(r"lores", views.LoreViewSet)
router.register(r"npcs", views.NPCViewSet)
router.register(r"places", views.PlaceViewSet)
router.register(r"sessions", views.SessionViewSet)

urlpatterns = [
  path("api-auth-token/", obtain_auth_token),
  path("links/", views.links),
  path("beasts/upload/", views.upload_beast),
  path("places/upload/", views.upload_place),
  path("search/", search.search),
  url(r"^", include(router.urls)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
