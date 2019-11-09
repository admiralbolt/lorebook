# Generated by Django 2.2.6 on 2019-11-09 16:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_auto_20191109_1546'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='place_type',
            field=models.CharField(choices=[('City', 'City'), ('Dungeon', 'Dungeon'), ('Location', 'Location')], default='City', max_length=32),
            preserve_default=False,
        ),
    ]
