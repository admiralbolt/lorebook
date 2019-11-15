from django.conf.urls import url

from panel.consumers import ControlConsumer

websocket_urlpatterns = [
  url(r'^ws/session_control/$', ControlConsumer),
]
