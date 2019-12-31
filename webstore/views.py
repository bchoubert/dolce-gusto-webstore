from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, Http404
from django.core import serializers
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMessage

import json
import math

from .models import Category, ProductType, Product, Order, OrderLine

# Create your views here.
# FILE-WIDE NOTE: We return the JSON data as safe (meaning we intentiannaly disable the isJson check, done by default via Django)

def index(request):
  return HttpResponse("This is not the Front-End. Please launch the React app in webstore/webstore-front.")

def getAllCategories(request):
  # Get all categories => we call 'Category.serialize()' on each category
  return JsonResponse(list(map(Category.serialize, Category.objects.all())), safe=False)

def getCategoryDetails(request, category_id):
  # Get one category details
  try:
    category = Category.objects.get(pk=category_id)
  except Category.DoesNotExist:
    raise Http404("Category does not exist")
  return JsonResponse(category.serializeWithProducts(), safe=False)

def getProductDetails(request, product_id):
  # Get one product details
  try:
    product = Product.objects.get(pk=product_id)
  except Product.DoesNotExist:
    raise Http404("Product does not exist")
  return JsonResponse(product.serializeWithCategoryAndTypes(), safe=False)

def getProductTypesViaIdList(request):
  # Get all products types that correspond to an id from the idList
  # Ids are passed as get parameter, like : '?id=1&id=2&id=3', so this line returns [1, 2, 3]
  idList = request.GET.getlist('id')
  if not type(idList) is list:
    raise Http404("Pass a correct id list to getProductTypesViaIdList")
  productTypes = {}
  for id in idList:
    try:
      productTypes[id] = ProductType.objects.get(pk=id).serializeWithProductAndCategory()
    except ProductType.DoesNotExist:
      raise Http404(f"No productType corresponding to id {id}")
  return JsonResponse(productTypes, safe=False)

@csrf_exempt
def order(request):
  # Order method. This is not a Form validation method, but an API creation method, so we excempt the request from CSRF_token
  # because we don't have other secure choice (other choice would have been to send one to the Front, but that is unsafe as well,
  # because every Front-End can also get one)
  #
  if not request.method == 'POST':
    raise Http404('Order endpoint is POST only')

  if not request.body:
    raise Http404('You must send all parameters in request payload')

  # Parse the request body
  try:
    body = json.loads(request.body)
  except json.decoder.JSONDecodeError:
    raise Http404('Can\'t parse the request')

  # Get all request body parts
  fullname = body['fullname']
  country = body['country']
  city = body['city']
  postalCode = body['postalCode']
  address = body['address']
  email = body['email']
  cart = json.loads(body['cart'])

  # Check for complete request
  if not fullname or not country or not city or not postalCode or not address or not email or not cart:
    raise Http404('Except all parameters to be fulfiled')

  if len(cart.keys()) == 0:
    raise Http404('Can\'t order an empty cart')

  # For each cart line, get the associated productType from its id
  productTypes = dict()
  for key in list(cart.keys()):
    try:
      productTypes[key] = ProductType.objects.get(pk=key)
    except ProductType.DoesNotExist:
      raise Http404(f'Parsing Cart: No product Type for id {key}')

  # Compute order total
  sum = 0.0
  for key in list(productTypes.keys()):
    sum += float(productTypes[key].price) * float(cart[key])

  sum = math.floor(sum * 100) / 100

  # Compute order address
  addressString = f"{address} {postalCode} {city} {country}"
  
  # Create the order
  order = Order(fullname=fullname, address=addressString, email=email, sum=sum)
  order.save()

  # As well as its lines
  for key in list(cart.keys()):
    orderLine = OrderLine(order=order, productType=productTypes[key], quantity=cart[key])
    orderLine.save()

  # Send an email
  subject, from_email, to = f"Your order {order.id} from Dolce Gusto Webstore", "no.reply.dolce.gusto.webstore@gmail.com", order.email

  items = ""
  for key in list(cart.keys()):
    items += f"<tr><td>{productTypes[key].toCartString()}</td><td>{cart[key]}</td><td>{float(productTypes[key].price) * float(cart[key])} €</td></tr>"

  header = f"<h1>Your order {order.id}</h1><p>Thanks for your order from Nescafe Dolce Gusto Webstore!</p>"
  table = f"<table border='1' style='border-collapse:collapse;width: 100%;text-align: center'><tr><th>Product</th><th>Quantity</th><th>Price</th></tr>{items}<tr><td>Total</td><td></td><td>{sum} €</td></tr></table>"

  html_content = f"<div style='text-align: center'>{header}{table}<p>Your order will be packaged to: {addressString}</p></div>"

  msg = EmailMessage(subject, html_content, from_email, [to])
  msg.content_subtype = "html"
  msg.send()

  return JsonResponse({'orderId': order.id}, safe=False)
  


