from rest_framework import routers
from .views import EventViewSet


router = routers.DefaultRouter()

router.register(r"events", EventViewSet, basename="event")


urlpatterns = router.urls
