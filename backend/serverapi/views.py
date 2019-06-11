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

# def qqscorefree(request):
#     print(request.GET['score'], request.GET['local_type_id'], request.GET['province_id'])
#     res = QQscore10Model.objects.get(score=request.GET['score'], local_type_id=request.GET['local_type_id'], province_id=request.GET['province_id'])
#     # res = QQscore10Model.objects.get(score=520, local_type_id=1)
#     print(res.data)
    
#     return JsonResponse({
#         'score':res.score, 
#         'local_type_id':res.local_type_id, 
#         'counts': res.counts, 
#         'srank':res.srank, 
#         'data':res.data,
#         'nuniv':res.nuniv,
#         'nsp':res.nsp,
#         'total':res.total
#     }, safe=False)
def fetchNews(request):
    print('sdasfda')
    res = Kexiedata.objects.order_by('-date')[0:10]
    print(res)
