# Generated by Django 2.2.6 on 2019-11-05 01:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20191103_0149'),
    ]

    operations = [
        migrations.AlterField(
            model_name='song',
            name='sound_file',
            field=models.FileField(blank=True, upload_to='music/'),
        ),
    ]
