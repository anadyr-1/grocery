# Generated by Django 2.0.7 on 2018-08-09 00:15

from django.db import migrations


class Migration(migrations.Migration):

    atomic = False

    dependencies = [
        ('grocery_list', '0003_auto_20180809_0013'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='grocery',
            name='created_at',
        ),
    ]
