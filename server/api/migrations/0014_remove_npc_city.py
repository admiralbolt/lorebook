# Generated by Django 2.2.6 on 2019-11-09 16:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_place_place_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='npc',
            name='city',
        ),
    ]
