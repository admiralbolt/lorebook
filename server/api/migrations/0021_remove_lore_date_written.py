# Generated by Django 2.2.7 on 2019-11-10 16:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_auto_20191110_1639'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lore',
            name='date_written',
        ),
    ]
