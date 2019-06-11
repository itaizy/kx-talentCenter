from django.shortcuts import render
from django.core import serializers

# Create your views here.

#导入HttpResponse，用来向网页返回内容的，像print一样，不过HttpResponse是把内容显示到网页上。
from django.http import HttpResponse
# Create your views here.
from . models import Kexiedata
from django.http import JsonResponse
import json

def index(request):#定义一个函数，第一个参数必须是request
    print('lalala')
    return HttpResponse("Hello, world. Hello，python.")#返回HttpResonse对象，最终将这行字符显示在页面上

def fetchNews(request):
    res = Kexiedata.objects.order_by('-date')[0:10].values_list()
    return JsonResponse({'data': list(res)}, safe=False)
