# Generated by Django 2.0.7 on 2018-08-16 05:47

from django.db import migrations


class Migration(migrations.Migration):

    atomic = False

    dependencies = [
        ('grocery_list', '0007_auto_20180813_1744'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Recipe',
            new_name='GroceryList',
        ),
    ]