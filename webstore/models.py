from django.db import models

# Create your models here.

# Category is a product category (i.e. 'Espressos')
class Category(models.Model):
  label = models.CharField(max_length=25)
  # We need to separate drink categories from other categories (such as 'Coffee Machines'): product pages are different
  isDrinkCategory = models.BooleanField()

  class Meta:
    # Force the admin panel to show 'Categories' instead of 'Categorys'
    verbose_name_plural = "Categories"

  def __str__(self):
    return f"{self.label}"

  # Serialize only the category
  def serialize(self):
    return {
      "id": self.id,
      "label": self.label,
      "isDrinkCategory": self.isDrinkCategory
    }

  # Serialize the category with its products and their product types
  def serializeWithProducts(self):
    return {
      "id": self.id,
      "label": self.label,
      "isDrinkCategory": self.isDrinkCategory,
      # We need to call the 'Product.serialize()' function on each product
      "products": list(map(Product.serialize, self.products.all()))
    }

# Product class
class Product(models.Model):
  name = models.CharField(max_length=25)
  shortDescription = models.CharField(max_length=511)
  description = models.CharField(max_length=2499)
  type = models.CharField(max_length=15, null=True)
  color = models.CharField(max_length=7)
  isLightColor = models.BooleanField(default=False)
  typeColor = models.CharField(max_length=7, null=True)
  indicator = models.IntegerField(default=1)
  category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")

  def __str__(self):
    return f"{self.name} {self.type if self.type else ''}"

  # Serialize only the product
  def serialize(self):
    return {
      "id": self.id,
      "name": self.name,
      "description": self.description,
      "shortDescription": self.shortDescription,
      "type": self.type,
      "color": self.color,
      "isLightColor": self.isLightColor,
      "typeColor": self.typeColor,
      "indicator": self.indicator
    }

  # Serialize the product with its category
  def serializeWithCategory(self):
    return {
      "id": self.id,
      "name": self.name,
      "description": self.description,
      "shortDescription": self.shortDescription,
      "type": self.type,
      "color": self.color,
      "isLightColor": self.isLightColor,
      "typeColor": self.typeColor,
      "indicator": self.indicator,
      "category": self.category.serialize()
    }

  # Serialize the product with its types
  def serializeWithTypes(self):
    return {
      "id": self.id,
      "name": self.name,
      "description": self.description,
      "shortDescription": self.shortDescription,
      "type": self.type,
      "color": self.color,
      "isLightColor": self.isLightColor,
      "typeColor": self.typeColor,
      "indicator": self.indicator,
      # We need to call the 'ProductType.serialize()' function on each type
      "types": list(map(ProductType.serialize, self.types.all()))
    }

  # Serialize the product with its types and its category
  def serializeWithCategoryAndTypes(self):
    return {
      "id": self.id,
      "name": self.name,
      "description": self.description,
      "shortDescription": self.shortDescription,
      "type": self.type,
      "color": self.color,
      "isLightColor": self.isLightColor,
      "typeColor": self.typeColor,
      "indicator": self.indicator,
      "category": self.category.serialize(),
      # We need to call the 'ProductType.serialize()' function on each type
      "types": list(map(ProductType.serialize, self.types.all()))
    }

# ProductType (= Options for each product, like color for a Coffee Machine)
class ProductType(models.Model):
  # Number of pods, if applicable
  number = models.IntegerField(default=1)
  product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="types")
  # Price depends on the type
  price = models.DecimalField(max_digits=5, decimal_places=2)
  # Color of the coffee machine, if applicable
  color = models.CharField(max_length=7, null=True)
  name = models.CharField(max_length=10, null=True)

  def __str__(self):
    if self.product.category.isDrinkCategory:
      return f"{self.product} - {self.number} pods"
    return f"{self.product} - {self.name}"

  # Serialize only the ProductType
  def serialize(self):
    return {
      "id": self.id,
      "number": self.number,
      "price": self.price,
      "color": self.color,
      "name": self.name
    }

  # Serialize the ProductType with its product
  def serializeWithProduct(self):
    return {
      "id": self.id,
      "number": self.number,
      "price": self.price,
      "color": self.color,
      "name": self.name,
      "product": self.product.serialize()
    }

  # Serialize the ProductType with its product and the product's category
  def serializeWithProductAndCategory(self):
    return {
      "id": self.id,
      "number": self.number,
      "price": self.price,
      "color": self.color,
      "name": self.name,
      "product": self.product.serializeWithCategory()
    }

  # Used to print a product type as human readable for the email format
  def toCartString(self):
    if self.product.category.isDrinkCategory:
      return f"{self.product.name} {self.product.type} - {self.number} pods"
    return f"{self.product.name} - {self.name}"

# Order class, used to store userdetails. Has orderLines, each representing one product with one quantity
class Order(models.Model):
  fullname = models.CharField(max_length=64)
  address = models.CharField(max_length=127)
  email = models.CharField(max_length=64)
  # Fixed the total of the order here: if a price is edited by an admin, the total here does not change, so the user still pay the same amount
  sum = models.DecimalField(max_digits=6, decimal_places=2)

  def __str__(self):
    return f"{self.id} for {self.fullname}"

  # Serialize only the order
  def serialize(self):
    return {
      "id": self.id,
      "fullname": self.fullname,
      "address": self.address,
      "email": self.email,
      "sum": self.sum
    }

  # Serialize the order with its lines, along with their productType, productType's product, and productType's product's category
  def serializeWithProducts(self):
    return {
      "id": self.id,
      "fullname": self.fullname,
      "address": self.address,
      "email": self.email,
      "sum": self.sum,
      "lines": list(map(OrderLine.serializeWithProduct, self.lines.all()))
    }

class OrderLine(models.Model):
  # Order reference
  order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="lines")
  # ProductType selected
  productType = models.ForeignKey(ProductType, on_delete=models.SET_NULL, null=True, related_name="productTypes")
  quantity = models.IntegerField()

  def __str__(self):
    return f"{self.id} for order #{self.order.id} (Product: {self.productType.product} - {self.productType}, Quantity: {self.quantity})"

  # Serialize the line along with their product and product's category
  def serializeWithProduct(self):
    return {
      "id": self.id,
      "quantity": self.quantity,
      "productType": self.productType.serializeWithProductAndCategory()
    }
