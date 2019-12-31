from django.urls import path

from . import views

urlpatterns = [
  path('', views.index, name='index'),
  path('categories', views.getAllCategories, name='getAllCategories'),
  path('category/<int:category_id>', views.getCategoryDetails, name="getCategoryDetails"),
  path('product/<int:product_id>', views.getProductDetails, name='getProductDetails'),
  path('producttype', views.getProductTypesViaIdList, name='getProductTypesViaIdList'),
  path('order', views.order, name='order')
]
