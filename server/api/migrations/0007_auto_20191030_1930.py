# Generated by Django 2.2.6 on 2019-10-30 19:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_npc_aliases'),
    ]

    operations = [
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('visible', models.BooleanField(default=False)),
                ('description', models.TextField(blank=True, default='')),
                ('lore', models.TextField(blank=True, default=None)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='npc',
            name='city',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.City'),
        ),
    ]