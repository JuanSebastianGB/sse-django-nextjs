from django.urls import path
from .views import sse_stream, index, maintenance_sse_stream, alternative


urlpatterns = [
    path("", index, name="index"),
    path("alternative/", alternative, name="alternative"),
    path("stream/", sse_stream, name="sse_stream"),
    path("mstream/", maintenance_sse_stream, name="maintenance_sse_stream"),
]
