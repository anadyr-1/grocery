from rest_framework import serializers
from grocery_list.models import Grocery, GroceryList, Recipe

class GrocerySerializer(serializers.ModelSerializer):
  id = serializers.IntegerField(required=False)

  class Meta:
    model = Grocery
    fields = ('id','name','quantity','unit','recipe')

class GroceryListSerializer(serializers.ModelSerializer):
  grocery_set = GrocerySerializer(many=True)

  class Meta:
    model = GroceryList
    fields = ('id','created_at','grocery_set')

  def create(self, validated_data):
    groceries_data = validated_data.pop('grocery_set')
    groceryList = GroceryList.objects.create(**validated_data)
    for grocery_data in groceries_data:
      try:
        grocery_data.pop('id')
      except KeyError:
        pass
      try:
        grocery_data.pop('recipe')
      except KeyError:
        pass
      Grocery.objects.create(groceryList=groceryList, **grocery_data)
    return groceryList
  
  def update(self, instance, validated_data):
    groceries_data = validated_data.pop('grocery_set')
    instance.save()

    for grocery in instance.grocery_set.all():
      groceryToBeDeleted = True
      for grocery_data in groceries_data:
        if grocery.id == grocery_data.get('id'):
          groceryToBeDeleted = False
          break
      if groceryToBeDeleted:
        grocery.delete()
    instance.save()

    for grocery_data in groceries_data:
        try:
          grocery = Grocery.objects.get(pk=grocery_data.get('id'))
        except (Grocery.DoesNotExist):
          Grocery.objects.create(recipe=instance, **grocery_data)
        else:
          grocery.name = grocery_data.get('name', grocery.name)
          grocery.quantity = grocery_data.get('quantity', grocery.quantity)
          grocery.unit = grocery_data.get('unit', grocery.unit)
          grocery.save()
    instance.save()

    return instance
  
class RecipeSerializer(serializers.ModelSerializer):
  grocery_set = GrocerySerializer(many=True)

  class Meta:
    model = Recipe
    fields = ('id','name','grocery_set')

  def create(self, validated_data):
    groceries_data = validated_data.pop('grocery_set')
    recipe = Recipe.objects.create(**validated_data)
    for grocery_data in groceries_data:
      Grocery.objects.create(recipe=recipe, **grocery_data)
    return recipe
  
  def update(self, instance, validated_data):
    groceries_data = validated_data.pop('grocery_set')
    instance.name = validated_data.get('name', instance.name)
    instance.save()

    for grocery in instance.grocery_set.all():
      groceryToBeDeleted = True
      for grocery_data in groceries_data:
        if grocery.id == grocery_data.get('id'):
          groceryToBeDeleted = False
          break
      if groceryToBeDeleted:
        grocery.delete()
    instance.save()

    for grocery_data in groceries_data:
        try:
          grocery = Grocery.objects.get(pk=grocery_data.get('id'))
        except (Grocery.DoesNotExist):
          Grocery.objects.create(recipe=instance, **grocery_data)
        else:
          grocery.name = grocery_data.get('name', grocery.name)
          grocery.quantity = grocery_data.get('quantity', grocery.quantity)
          grocery.unit = grocery_data.get('unit', grocery.unit)
          grocery.save()
    instance.save()

    return instance