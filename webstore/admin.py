from django.contrib import admin

from .models import Category, ProductType, Product, Order, OrderLine

# Register your models here.
class ProductInline(admin.TabularInline):
  model = Product

class ProductTypeInline(admin.TabularInline):
  model = ProductType

class OrderLineInline(admin.TabularInline):
  model = OrderLine

# Show the products when editing a category
class CategoryAdmin(admin.ModelAdmin):
  inlines = [
    ProductInline
  ]

# Show the productTypes when editing a product
class ProductAdmin(admin.ModelAdmin):
  inlines = [
    ProductTypeInline
  ]

# Show orderLines when editing an order
class OrderAdmin(admin.ModelAdmin):
  inlines = [
    OrderLineInline
  ]

admin.site.register(ProductType)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderLine)
