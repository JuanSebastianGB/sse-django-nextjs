# Server-Sent Events with Daphne

This project demonstrates the implementation of Server-Sent Events (SSE) using Daphne as the ASGI server. SSE is a powerful feature for real-time updates from the server to the client, which is particularly useful for applications like notifications, live updates, and real-time data streaming.

## Getting Started

### Prerequisites

- Python 3.8+
- Django 3.1+
- Daphne 3.0+
- Channels 3.0+

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/JuanSebastianGB/sse-django-nextjs.git
    cd  sse-django-nextjs
    ```

2.  **Create a virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate
    ```

3.  **Install the dependencies:**

    `pip install -r requirements.txt`

4.  **Run migrations:**

    `python manage.py migrate`

5.  **Start the server:**

    `python manage runserver`

### Configuration

Ensure your `settings.py` file is configured correctly for Channels and Daphne. Example configuration:

```python

# settings.py
INSTALLED_APPS = [
    ...
    'channels',
]

ASGI_APPLICATION = 'core.asgi.application'

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}
```

### Usage

1.  **Create a Django view for SSE:**

```python

    from django.http import HttpResponse
    import time

    def sse_view(request):
        def event_stream():
            while True:
                time.sleep(1)
                yield f'data: The current time is {time.strftime("%Y-%m-%d %H:%M:%S")}\n\n'

        response = HttpResponse(event_stream(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        return response
```

2.  **Add the view to your `urls.py`:**

```python
from django.urls import path
from .views import sse_view

urlpatterns = [
    path('sse/', sse_view),
]
```

3.  **Create a frontend to consume SSE:**

```html
<!DOCTYPE html>
<html>
  <body>
    <h1>Server-Sent Events Demo</h1>
    <div id="sse-data"></div>

    <script>
      const eventSource = new EventSource('/sse/');
      eventSource.onmessage = function (event) {
        document.getElementById('sse-data').innerHTML = event.data;
      };
    </script>
  </body>
</html>
```

## Resources

For a detailed explanation of Server-Sent Events with Daphne, you can refer to this comprehensive [blog post](https://www.photondesigner.com/articles/server-sent-events-daphne?ref-yt-server-sent-events-daphne) by Photon Designer.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
