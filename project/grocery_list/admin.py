from django.contrib import admin
from grocery_list.models import Grocery, Recipe, GroceryList

# Register your models here.
admin.site.register(Grocery)
admin.site.register(Recipe)
admin.site.register(GroceryList)