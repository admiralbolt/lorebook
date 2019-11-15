from django.urls import path
from panel import session
from panel import views

urlpatterns = [
    path("auto_complete", views.auto_complete),
    path("client", views.client),
    path("controls", views.controls),
    path("info_card", views.info_card),
    path("songs", views.songs),
    path("display_item", views.display_item),
    path("update_session", session.update),
    path("session_content", session.content),
    path("save_session", session.save),
    path("edit_session", session.edit),
    path("update_item_order", session.update_item_order)
]
