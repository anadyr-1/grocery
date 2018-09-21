from django.db import models

class Recipe(models.Model):
  name = models.CharField(max_length=200)

class GroceryList(models.Model):
  created_at=models.DateTimeField(auto_now_add=True)

class Grocery(models.Model):
  name = models.CharField(max_length=100)
  quantity = models.DecimalField(
    decimal_places=2,
    max_digits = 4,
  )
  UNIT_CHOICES = (
    ('x','Units'),
    ('tsp','Teaspoons'),
    ('tbsp','Tablespoons'),
    ('cup','Cups'),
    ('pint','Pints'),
    ('quart','Quarts'),
    ('oz','Ounces'),
    ('lb','Pounds'),
    ('kg','Kilograms'),
  )
  unit = models.CharField(
    max_length=4,
    choices=UNIT_CHOICES,
    default='x',
  )

  recipe = models.ForeignKey(Recipe,on_delete=models.CASCADE,blank=True,null=True)
  groceryList = models.ForeignKey(GroceryList,on_delete=models.CASCADE,blank=True,null=True)

  def amount_string(self):
    return (str(int(self.quantity)) if self.quantity % 1 == 0 else str(self.quantity)) + self.unit

  def __str__(self):
    return self.name