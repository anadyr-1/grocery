from django.urls import path
from django.conf.urls import url
from django.contrib import admin
from . import views

urlpatterns = [
    path('admin/',admin.site.urls),
    path('api/grocerylist/submit/',views.grocery_list_of_lists),
    path('api/grocerylist/',views.grocery_list_of_lists),
    url(r'^api/grocerylist/(?P<id>\d+)/$',views.grocery_list_detail),
    path('api/grocery/', views.groceries ),
    path('api/recipes/', views.recipe_list),
    path('api/recipes/submit/', views.new_recipe),
    url(r'^api/recipes/(?P<id>\d+)/$',views.recipe_detail),
]