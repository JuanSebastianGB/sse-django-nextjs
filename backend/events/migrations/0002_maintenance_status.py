# Generated by Django 5.0.6 on 2024-05-29 12:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("events", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="maintenance",
            name="status",
            field=models.CharField(
                choices=[("active", "Active"), ("inactive", "Inactive")],
                default="active",
                max_length=10,
            ),
        ),
    ]
