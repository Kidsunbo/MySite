from django.shortcuts import render
import json
from django.http import HttpResponse
from .models import RecordModel,kie_token,raym_token


# Create your views here.
def keyraym_all(request):
    if request.method=='GET':
        result = {'Kie':[],'Raym':[]}
        for item in RecordModel.objects.all():
            data = {}
            data['date'] = item.date.strftime('%Y/%m/%d')
            data['AAT'] = item.AAT
            data['essay'] = item.essay
            data['other'] = item.other
            data['coding'] = item.coding
            data['note'] = item.note
            if item.token == kie_token:
                result['Kie'].append(data)
            elif item.token == raym_token:
                result["Raym"].append(data)
        return HttpResponse(json.dumps(result))


def keyraym_append(request):
    try:
        if request.method=='POST':
            data = json.loads(request.body,encoding='uft-8')
            ret = RecordModel.objects.filter(token=data['token'],date=data['date'])
            if len(ret)!=0:
                result = {}
                result['fail']="该日期已经提交过，请删除后重新提交"
                return HttpResponse(json.dumps(result))
            if data['token'] not in [raym_token,kie_token]:
                result = {}
                result['fail']="当前Token有误，请设置正确的Token"
                return HttpResponse(json.dumps(result))
            d = RecordModel(**data)
            d.save()
            result={}
            if data['token']==kie_token: result['account']="kie"
            elif data['token']==raym_token: result['account']='raym'
            return HttpResponse(json.dumps(result))
    except:
        pass

def keyraym_delete(request):
    if request.method=='POST':
        data = json.loads(request.body, encoding='uft-8')
        ret = RecordModel.objects.filter(token=data['token'],date=data['date'])
        if len(ret)!=0:
            ret.delete()
    return HttpResponse("")
