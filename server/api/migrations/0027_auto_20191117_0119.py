# Generated by Django 2.2.7 on 2019-11-17 01:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_session_ordinal'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='x',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='place',
            name='y',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]
