# Generated by Django 2.2.7 on 2019-11-10 00:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_remove_npc_city'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='points_of_interest',
            field=models.TextField(blank=True, default=''),
        ),
    ]