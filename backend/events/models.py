from django.db import models, transaction
from django.utils import timezone


class Maintenance(models.Model):
    """
    Model to store maintenance events.
    """

    start = models.DateTimeField()
    description = models.TextField(default="Maintenance mode")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=10,
        choices=[("active", "Active"), ("inactive", "Inactive")],
        default="active",
    )

    def save(self, *args, **kwargs):
        if self.start < timezone.now():
            self.status = "inactive"

        with transaction.atomic():
            if self.pk is None:
                Maintenance.objects.filter(status="active").update(status="inactive")
                super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.description} - {self.start}"
