# Generated by Django 2.0.7 on 2018-08-22 19:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('grocery_list', '0011_auto_20180822_1859'),
    ]

    operations = [
        migrations.AlterField(
            model_name='grocery',
            name='groceryList',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='grocery_list.GroceryList'),
        ),
        migrations.AlterField(
            model_name='grocery',
            name='recipe',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='grocery_list.Recipe'),
        ),
    ]
