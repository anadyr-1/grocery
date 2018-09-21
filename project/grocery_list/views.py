from grocery_list.models import Grocery, GroceryList, Recipe
from grocery_list.serializers import GrocerySerializer, GroceryListSerializer, RecipeSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse

@csrf_exempt
def recipe_list(request):
    if request.method == 'GET':
        recipes = Recipe.objects.all()
        serializer = RecipeSerializer(recipes,many=True)
        return JsonResponse(serializer.data,safe=False)
    if request.method == 'DELETE':
        data = JSONParser().parse(request)
        try:
            id = data['id']
        except KeyError:
            return JsonResponse("No recipe to delete",safe=False)
        try:
            recipe = Recipe.objects.get(pk=id)
        except Recipe.DoesNotExist:
            return JsonResponse("No recipe to delete",safe=False)
        recipe.delete()
        return JsonResponse("Deleted",safe=False)

@csrf_exempt
def groceries(request):
    if request.method == 'GET':
        groceries = Grocery.objects.all()
        serializer = GrocerySerializer(groceries,many=True)
        return JsonResponse(serializer.data,safe=False)

@csrf_exempt
def grocery_list(request,id):
    if request.method == 'PUT':
        recipe = Recipe.objects.get(pk=id)
        groceries = Grocery.objects.all()
        serializer = GrocerySerializer(groceries,many=True)
        return JsonResponse(serializer.data,safe=False)

@csrf_exempt
def new_recipe(request):
    data = JSONParser().parse(request)
    serializer = RecipeSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return JsonResponse("Got here",safe=False)
    return JsonResponse(serializer.data,safe=False)

@csrf_exempt
def recipe_detail(request,id):
    data = JSONParser().parse(request)
    recipe = Recipe.objects.get(pk=id)
    serializer = RecipeSerializer(recipe,data=data)
    if serializer.is_valid():
        serializer.save()
    return JsonResponse(serializer.data,safe=False)

@csrf_exempt
def grocery_list_detail(request,id):
    if request.method == 'DELETE':
        gl = GroceryList.objects.get(pk=id)
        for grocery in gl.grocery_set.all():
            grocery.delete()
        gl.delete()
        return JsonResponse("Success",status=201,safe=False)
    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        
        groceryList = GroceryList.objects.get(pk=id)
        
        serializer = GroceryListSerializer(groceryList,data=data)
        if serializer.is_valid():
            serializer.save()
        return JsonResponse(serializer.data,safe=False)

@csrf_exempt
def grocery_list_of_lists(request):
    if request.method == 'GET':
        groceryLists = GroceryList.objects.all()
        serializer = GroceryListSerializer(groceryLists,many=True)
        return JsonResponse(serializer.data,safe=False)
    elif request.method == 'PUT':
        data = JSONParser().parse(request)
        serializer = GroceryListSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
        return JsonResponse(serializer.data,status=201,safe=False)