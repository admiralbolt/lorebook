# Generated by Django 2.2.6 on 2019-10-21 17:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_auto_20191021_1754'),
    ]

    operations = [
        migrations.RenameField(
            model_name='npc',
            old_name='hidden',
            new_name='visible',
        ),
        migrations.RenameField(
            model_name='song',
            old_name='hidden',
            new_name='visible',
        ),
    ]
