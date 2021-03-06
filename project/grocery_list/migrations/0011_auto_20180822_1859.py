# Generated by Django 2.0.7 on 2018-08-22 18:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('grocery_list', '0010_auto_20180816_2009'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='grocery',
            name='containing_recipe',
        ),
        migrations.RemoveField(
            model_name='grocerylist',
            name='groceries',
        ),
        migrations.RemoveField(
            model_name='recipe',
            name='groceries',
        ),
        migrations.AddField(
            model_name='grocery',
            name='groceryList',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='grocery_list.GroceryList'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='grocery',
            name='recipe',
            field=models.ForeignKey(default='1', on_delete=django.db.models.deletion.CASCADE, to='grocery_list.Recipe'),
            preserve_default=False,
        ),
    ]
