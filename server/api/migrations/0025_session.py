# Generated by Django 2.2.7 on 2019-11-10 23:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_auto_20191110_1832'),
    ]

    operations = [
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128, unique=True)),
                ('aliases', models.TextField(blank=True, default='')),
                ('visible', models.BooleanField(default=False)),
                ('summary', models.TextField(blank=True, default='')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]