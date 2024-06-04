from django.utils import timezone
from django.core.management.base import BaseCommand
from datetime import datetime, timedelta


class Command(BaseCommand):
    """It is a custom management command to set the date of a maintenance event."""

    help = "Set the date of a maintenance event"

    def add_arguments(self, parser):
        parser.add_argument(
            "--description",
            type=str,
            help="Description of the maintenance event",
            default="Maintenance mode",
        )
        parser.add_argument(
            "--start",
            type=str,
            help="Start date and time of the maintenance event",
            required=False,
        )
        parser.add_argument(
            "--delta", type=int, help="Set the date in minutes from now"
        )

        parser.add_argument(
            "-dt",
            "--delta-type",
            type=str,
            choices=["m", "h", "d"],
            default="h",
            help="Delta type: m (minutes), h (hours), d (days)",
        )

    def handle(self, *args, **options):
        description = options["description"]
        start_str = options.get("start")
        delta = options.get("delta")
        delta_type = options.get("delta_type")

        if not start_str and not delta:
            self.stdout.write(
                self.style.ERROR("You must provide a start date or a delta")
            )
            return

        start = self.calculate_start_time(start_str, delta, delta_type)
        if start is None:
            return

        self.create_maintenance_event(description, start)

    def calculate_start_time(self, start_str, delta, delta_type):
        """
        Calculate the start time based on the given start string and delta.

        Args:
          start_str (str): The start time string in the format "YYYY-MM-DD HH:MM:SS".
          delta (int): The number of hours to add to the current time.
          delta_type (str): The type of delta: m (minutes), h (hours), d (days).

        Returns:
          datetime.datetime or None: The calculated start time as a timezone-aware datetime object,
          or None if the start string is invalid.

        """
        if delta:
            delta_args = {"m": "minutes", "h": "hours", "d": "days"}
            return timezone.now() + timedelta(**{delta_args[delta_type]: delta})

        try:
            start = datetime.strptime(start_str, "%Y-%m-%d %H:%M:%S")
            return timezone.make_aware(start, timezone.get_current_timezone())
        except ValueError:
            self.stdout.write(
                self.style.ERROR("Invalid date format. Use YYYY-MM-DD HH:MM:SS")
            )
            return None

    def create_maintenance_event(self, description, start):
        """
        Create a maintenance event with the given description and start date.

        Args:
          description (str): The description of the maintenance event.
          start (datetime): The start date of the maintenance event.

        Returns:
          None
        """
        from events.models import Maintenance

        maintenance = Maintenance(description=description, start=start)
        maintenance.save()
        self.stdout.write(self.style.SUCCESS("Maintenance event created successfully"))
        self.stdout.write(self.style.SUCCESS(f"Description: {maintenance.description}"))
        self.stdout.write(self.style.SUCCESS(f"Start date: {maintenance.start}"))
