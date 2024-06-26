import asyncio
import random

from django.http import StreamingHttpResponse
from django.shortcuts import render

from .models import Maintenance
from rest_framework import viewsets
from .seriealizers import MaintenanceSerializer
import json

DELAY = 5


async def sse_stream(request):
    """
    Sends server-sent events to the client.
    """

    async def event_stream():
        emojis = ["🚀", "🐎", "🌅", "🦾", "🍇"]
        i = 0
        while True:
            yield f"data: {random.choice(emojis)} {i}\n\n"
            i += 1
            await asyncio.sleep(1)

    return StreamingHttpResponse(event_stream(), content_type="text/event-stream")


async def maintenance_sse_stream(request):
    """
    Sends server-sent events to the client.
    """

    async def event_stream():
        while True:
            last_maintenance = await asyncio.to_thread(
                lambda: Maintenance.objects.filter(status="active").last()
            )

            if last_maintenance:
                start = last_maintenance.start
                description = last_maintenance.description
                while True:
                    event_data = json.dumps(
                        {
                            "start": str(start),
                            "description": description,
                            "frequency": f"every {DELAY} seconds",
                        }
                    )

                    yield f"data: {event_data}\n\n"
                    # Check if the status is still active, otherwise break the loop
                    if not await asyncio.to_thread(
                        lambda: Maintenance.objects.filter(
                            id=last_maintenance.id, status="active"
                        ).exists()
                    ):
                        break
                    await asyncio.sleep(DELAY)
            else:
                # Sleep for a while before checking again if there is no active maintenance
                await asyncio.sleep(DELAY)

    return StreamingHttpResponse(event_stream(), content_type="text/event-stream")


def index(request):
    return render(request, "sse/events.html")


def alternative(request):
    return render(request, "sse/maintenance_sse.html")


class EventViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceSerializer
