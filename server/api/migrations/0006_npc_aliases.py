# Generated by Django 2.2.6 on 2019-10-27 00:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20191021_1756'),
    ]

    operations = [
        migrations.AddField(
            model_name='npc',
            name='aliases',
            field=models.TextField(blank=True, default=''),
        ),
    ]
