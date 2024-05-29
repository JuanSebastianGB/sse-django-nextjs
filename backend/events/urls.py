from django.urls import path
from .views import sse_stream, index


urlpatterns = [
    path("",index, name="index"),
    path("stream/", sse_stream, name="sse_stream")
]
