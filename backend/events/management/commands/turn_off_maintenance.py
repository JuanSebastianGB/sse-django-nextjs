from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """It is a custom management command to change Maintenance to inactive."""

    help = "Change Maintenance to inactive"

    def handle(self, *args, **options):
        from events.models import Maintenance

        Maintenance.objects.filter(status="active").update(status="inactive")
        self.stdout.write(
            self.style.SUCCESS("Successfully set Maintenance to inactive")
        )
